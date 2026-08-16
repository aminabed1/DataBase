package gangofthree.payment.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.entity.MatchSeat;
import gangofthree.payment.entity.Payment;
import gangofthree.payment.entity.PaymentMethod;
import gangofthree.reservation.entity.Reservation;
import gangofthree.reservation.entity.ReservationItem;
import gangofthree.entity.enums.MatchSeatStatus;
import gangofthree.payment.entity.enums.PaymentStatus;
import gangofthree.reservation.entity.enums.ReservationStatus;
import gangofthree.ticket.entity.enums.TicketStatus;
import gangofthree.payment.dto.request.PaymentRequest;
import gangofthree.payment.repository.PaymentMethodRepository;
import gangofthree.payment.repository.PaymentRepository;
import gangofthree.reservation.repository.MatchSeatRepository;
import gangofthree.reservation.repository.ReservationItemRepository;
import gangofthree.reservation.repository.ReservationRepository;
import gangofthree.ticket.repository.TicketRepository;
import gangofthree.user.entity.Wallet;
import gangofthree.user.entity.WalletTransaction;
import gangofthree.user.entity.enums.TransactionType;
import gangofthree.user.repository.WalletRepository;
import gangofthree.user.repository.WalletTransactionRepository;
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
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;

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

        // ۱. بررسی اینکه آیا درگاه انتخابی کیف پول است؟
        boolean isWallet = method.getDescription().toLowerCase().contains("wallet") ||
                           method.getDescription().contains("کیف پول");

        Wallet wallet = null;
        
        // ۲. هندلینگ دقیق کیف پول (بررسی موجودی و کسر مبلغ)
        if (isWallet) {
            wallet = walletRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Wallet not found"));
            
            // چک کردن اینکه آیا موجودی کافی است؟
            if (wallet.getCredit().compareTo(totalAmount) < 0) {
                // پیام خطای انگلیسی دقیقاً برای فرانت‌اند
                return ApiResponse.failure("Insufficient wallet balance. Please choose another payment method.", 400, "INSUFFICIENT_FUNDS");
            }
            
            // کسر مبلغ و ذخیره کیف پول جدید
            wallet.setCredit(wallet.getCredit().subtract(totalAmount));
            walletRepository.save(wallet);
        }

        String transactionRef = "TRX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LocalDateTime now = LocalDateTime.now();

        // ۳. ثبت تراکنش کلی سیستم
        Payment payment = new Payment();
        payment.setAmount(totalAmount);
        payment.setPaymentDate(now);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionRef(transactionRef);
        payment.setPaymentMethod(method);
        payment.setReservation(reservation);
        payment.setUser(reservation.getUser());
        payment = paymentRepository.save(payment);

        // ۴. ثبت سابقه برای بخش My Wallet داشبورد
        Wallet userWalletForHistory = walletRepository.findByUserId(userId).orElse(null);
        if (userWalletForHistory != null) {
            WalletTransaction tx = new WalletTransaction();
            tx.setWallet(userWalletForHistory);
            tx.setPayment(payment);
            tx.setAmount(totalAmount);
            tx.setType(TransactionType.DEBIT);
            tx.setDescription(isWallet ? "Ticket Purchase (Paid via Wallet)" : "Ticket Purchase (Paid via " + method.getDescription() + ")");
            tx.setTransactionDate(now);
            walletTransactionRepository.save(tx);
        }

        // ۵. قطعی کردن وضعیت رزرو
        reservationRepository.updateReservationStatusNative(reservation.getId(), ReservationStatus.CONFIRMED.name());

        // ۶. تولید بلیت (Ticket) برای تک‌تک صندلی‌های خریداری شده
        for (ReservationItem item : items) {
            MatchSeat seat = item.getMatchSeat();
            // تغییر وضعیت صندلی در استادیوم به فروخته شده
            matchSeatRepository.updateSeatStatusNative(seat.getId(), MatchSeatStatus.SOLD.name());

            String ticketCode = "TCK-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
            String qrPayload = "https://gangofthree.ir/verify/" + ticketCode;
            
            // صدور قطعی بلیت
            ticketRepository.insertTicketNative(
                    now, qrPayload, TicketStatus.ISSUED.name(), ticketCode, item.getId()
            );
        }

        return ApiResponse.success("Payment successful. Tickets have been issued.", 200, transactionRef);
    }

    @Override
    public ApiResponse<List<PaymentMethod>> getAllowedPaymentMethods() {
        List<PaymentMethod> methods = paymentMethodRepository.findAll().stream()
                .filter(m -> m.getStatus() == gangofthree.payment.entity.enums.PaymentMethodStatus.ALLOWED)
                .collect(java.util.stream.Collectors.toList());
        return ApiResponse.success("Payment methods retrieved successfully.", 200, methods);
    }
}