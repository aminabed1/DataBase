package gangofthree.reservation.repository;

import gangofthree.entity.MatchSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchSeatRepository extends JpaRepository<MatchSeat, Long> {
    
    @Query("SELECT DISTINCT ms FROM MatchSeat ms JOIN FETCH ms.seat s JOIN FETCH ms.ticketCategory tc WHERE ms.match.id = :matchId")
    List<MatchSeat> findByMatchId(@Param("matchId") Long matchId);

    @org.springframework.data.jpa.repository.Modifying
    @Query(value = "UPDATE match_seats SET status = :status WHERE id = :id", nativeQuery = true)
    void updateSeatStatusNative(@Param("id") Long id, @Param("status") String status);
}