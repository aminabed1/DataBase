package gangofthree.reservation.repository;

import gangofthree.entity.Reservation;
import gangofthree.entity.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserIdAndStatus(Long userId, ReservationStatus status);
    List<Reservation> findByUserIdOrderByReservedAtDesc(Long userId);
    List<Reservation> findByStatusAndExpiredAtBefore(ReservationStatus status, LocalDateTime now);
    List<Reservation> findByStatus(ReservationStatus status);

    @Modifying
    @Query(value = "UPDATE reservations SET status = :status WHERE id = :id", nativeQuery = true)
    void updateReservationStatusNative(@Param("id") Long id, @Param("status") String status);
}