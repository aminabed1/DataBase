package gangofthree.reservation.repository;

import gangofthree.entity.MatchSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchSeatRepository extends JpaRepository<MatchSeat, Long> {
}