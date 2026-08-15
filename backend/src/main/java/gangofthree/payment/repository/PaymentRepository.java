package gangofthree.payment.repository;

import gangofthree.payment.entity.Payment;
import gangofthree.payment.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatus(PaymentStatus status);

    @Modifying
    @Query(value = "INSERT INTO payments (amount, payment_date, status, transaction_ref, payment_method_id, reservation_id, user_id) VALUES (:amount, :paymentDate, :status, :transactionRef, :paymentMethodId, :reservationId, :userId)", nativeQuery = true)
    void insertPaymentNative(@Param("amount") BigDecimal amount, 
                             @Param("paymentDate") LocalDateTime paymentDate, 
                             @Param("status") String status, 
                             @Param("transactionRef") String transactionRef, 
                             @Param("paymentMethodId") Long paymentMethodId, 
                             @Param("reservationId") Long reservationId,
                             @Param("userId") Long userId);
}