package gangofthree.cancellation.service;

import gangofthree.cancellation.entity.enums.CancellationStatus;
import gangofthree.reservation.entity.ReservationItem;
import gangofthree.reservation.entity.Reservation;
import gangofthree.cancellation.dto.response.PenaltyResponse;
import gangofthree.cancellation.repository.CancellationRepository;
import gangofthree.common.response.ApiResponse;
import gangofthree.reservation.repository.ReservationItemRepository;
import gangofthree.reservation.repository.ReservationRepository;
import gangofthree.reservation.entity.enums.ReservationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CancellationServiceImplementation implements CancellationService {

    private final ReservationRepository reservationRepository;
    private final ReservationItemRepository reservationItemRepository;
    private final CancellationRepository cancellationRepository;

    @Override
    public ApiResponse<PenaltyResponse> checkPenalty(Long userId, Long reservationId) {
        Reservation reservation = validateAndGetReservation(userId, reservationId);
        List<ReservationItem> items = reservationItemRepository.findByReservationId(reservation.getId());
        
        LocalDateTime matchDate = items.get(0).getMatchSeat().getMatch().getDatetime();
        BigDecimal totalPaid = calculateTotalPaid(items);
        int penaltyPercentage = calculatePenaltyPercentage(matchDate);

        BigDecimal penaltyAmount = totalPaid.multiply(BigDecimal.valueOf(penaltyPercentage)).divide(BigDecimal.valueOf(100));
        BigDecimal refundAmount = totalPaid.subtract(penaltyAmount);

        PenaltyResponse response = PenaltyResponse.builder()
                .totalPaid(totalPaid)
                .penaltyPercentage(penaltyPercentage)
                .penaltyAmount(penaltyAmount)
                .refundAmount(refundAmount)
                .build();

        return ApiResponse.success("Penalty calculated successfully.", 200, response);
    }

    @Override
    @Transactional
    public ApiResponse<String> cancelTicketAndRefund(Long userId, Long reservationId, String reason) {
        Reservation reservation = validateAndGetReservation(userId, reservationId);
        List<ReservationItem> items = reservationItemRepository.findByReservationId(reservation.getId());
        
        LocalDateTime matchDate = items.get(0).getMatchSeat().getMatch().getDatetime();
        if (matchDate.isBefore(LocalDateTime.now())) {
            return ApiResponse.failure("Cannot cancel tickets for a past match.", 400, "MATCH_STARTED");
        }

        // ۱. فقط ثبت درخواست کنسلی در دیتابیس با وضعیت REQUESTED 
        // در اینجا هیچ تغییری روی پول، صندلی‌ها و وضعیت رزرو انجام نمی‌شود
        cancellationRepository.insertCancellationNative(
                reason != null ? reason : "Requested by user",
                CancellationStatus.REQUESTED.name(),
                LocalDateTime.now(),
                null, // زمان پردازش خالی است چون توسط ادمین در آینده پر می‌شود
                userId,
                reservation.getId()
        );

        return ApiResponse.success("Cancellation request submitted successfully. Support will review it.", 200, "Reservation ID: " + reservationId);
    }

    private Reservation validateAndGetReservation(Long userId, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new RuntimeException("Reservation not found"));
        if (!reservation.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed reservations can be cancelled");
        }
        return reservation;
    }

    private BigDecimal calculateTotalPaid(List<ReservationItem> items) {
        return items.stream().map(ReservationItem::getPriceAtTime).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private int calculatePenaltyPercentage(LocalDateTime matchDate) {
        long hoursUntilMatch = Duration.between(LocalDateTime.now(), matchDate).toHours();
        if (hoursUntilMatch > 48) return 10; 
        if (hoursUntilMatch > 24) return 30; 
        return 50; 
    }
}