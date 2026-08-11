package gangofthree.cancellation.repository;

import gangofthree.entity.Cancellation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface CancellationRepository extends JpaRepository<Cancellation, Long> {
    @Query(value = "INSERT INTO cancellations (reason, status, requested_at, processed_at, user_id, reservation_id) VALUES (:reason, :status, :requestedAt, :processedAt, :userId, :reservationId) RETURNING id", nativeQuery = true)
    Long insertCancellationNative(@Param("reason") String reason, @Param("status") String status
    , @Param("requestedAt") LocalDateTime requestedAt, @Param("processedAt") LocalDateTime processedAt
    , @Param("userId") Long userId, @Param("reservationId") Long reservationId);
}