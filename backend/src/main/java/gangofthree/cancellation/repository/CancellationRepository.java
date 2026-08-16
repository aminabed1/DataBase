package gangofthree.cancellation.repository;

import gangofthree.cancellation.entity.Cancellation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CancellationRepository extends JpaRepository<Cancellation, Long> {
    @Query(value = "INSERT INTO cancellations (reason, status, requested_at, processed_at, user_id, reservation_id) VALUES (:reason, :status, :requestedAt, :processedAt, :userId, :reservationId) RETURNING id", nativeQuery = true)
    Long insertCancellationNative(@Param("reason") String reason, @Param("status") String status,
                                  @Param("requestedAt") LocalDateTime requestedAt, @Param("processedAt") LocalDateTime processedAt,
                                  @Param("userId") Long userId, @Param("reservationId") Long reservationId);

    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END FROM cancellations WHERE reservation_id = :reservationId AND status = 'REQUESTED'", nativeQuery = true)
    boolean hasPendingCancellationNative(@Param("reservationId") Long reservationId);

    // واکشی کاربران دارای حداقل یک رزرو لغو شده
    @Query(value = "SELECT u.id AS user_id, u.first_name || ' ' || u.last_name AS full_name, u.email, u.phone, " +
            "COUNT(c.id) AS cancellations_count, MAX(c.reason) AS last_reason " +
            "FROM cancellations c " +
            "JOIN users u ON c.user_id = u.id " +
            "GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone", nativeQuery = true)
    List<Object[]> findUsersWithCancellationsRaw();
}