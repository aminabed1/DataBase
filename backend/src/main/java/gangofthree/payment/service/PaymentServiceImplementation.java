package gangofthree.payment.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.entity.MatchSeat;
import gangofthree.entity.PaymentMethod;
import gangofthree.entity.Reservation;
import gangofthree.entity.ReservationItem;
import gangofthree.entity.enums.MatchSeatStatus;
import gangofthree.entity.enums.PaymentStatus;
import gangofthree.entity.enums.ReservationStatus;
import gangofthree.entity.enums.TicketStatus;
import gangofthree.payment.dto.request.PaymentRequest;
import gangofthree.payment.repository.PaymentMethodRepository;
import gangofthree.payment.repository.PaymentRepository;
import gangofthree.reservation.repository.MatchSeatRepository;
import gangofthree.reservation.repository.ReservationItemRepository;
import gangofthree.reservation.repository.ReservationRepository;
import gangofthree.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImplementation implements PaymentService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;
    private final ReservationItemRepository reservationItemRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final MatchSeatRepository matchSeatRepository;

    @Override
    @Transactional
    @CacheEvict(value = {"userBookingsCache", "userProfileCache"}, key = "#userId")
    public ApiResponse<String> processPayment(Long userId, PaymentRequest request) {
        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        if (!reservation.getUser().getId().equals(userId)) {
            return ApiResponse.failure("Unauthorized access.", 403, "UNAUTHORIZED");
        }
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            return ApiResponse.failure("Reservation is not pending.", 400, "INVALID_STATUS");
        }
        if (reservation.getExpiredAt() != null && reservation.getExpiredAt().isBefore(LocalDateTime.now())) {
            return ApiResponse.failure("Reservation has expired.", 400, "EXPIRED_RESERVATION");
        }

        PaymentMethod method = paymentMethodRepository.findById(request.getPaymentMethodId())
                .orElseThrow(() -> new RuntimeException("Payment method not found"));
        
        List<ReservationItem> items = reservationItemRepository.findByReservationId(reservation.getId());
        BigDecimal totalAmount = items.stream()
                .map(ReservationItem::getPriceAtTime)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String transactionRef = "TRX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LocalDateTime now = LocalDateTime.now();

        paymentRepository.insertPaymentNative(
                totalAmount, now, PaymentStatus.SUCCESS.name(), transactionRef, method.getId(), reservation.getId()
        );

        reservationRepository.updateReservationStatusNative(reservation.getId(), ReservationStatus.CONFIRMED.name());

        for (ReservationItem item : items) {
            MatchSeat seat = item.getMatchSeat();
            matchSeatRepository.updateSeatStatusNative(seat.getId(), MatchSeatStatus.SOLD.name());

            String ticketCode = "TCK-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
            String qrPayload = "https://gangofthree.ir/verify/" + ticketCode;
            
            ticketRepository.insertTicketNative(
                    now, qrPayload, TicketStatus.ISSUED.name(), ticketCode, item.getId()
            );
        }

        return ApiResponse.success("Payment successful. Tickets have been issued.", 200, transactionRef);
    }
}