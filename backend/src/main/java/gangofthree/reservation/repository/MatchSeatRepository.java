package gangofthree.reservation.repository;

import gangofthree.entity.MatchSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchSeatRepository extends JpaRepository<MatchSeat, Long> {
    @Modifying
    @Query(value = "UPDATE match_seats SET status = :status WHERE id = :id", nativeQuery = true)
    void updateSeatStatusNative(@Param("id") Long id, @Param("status") String status);
}