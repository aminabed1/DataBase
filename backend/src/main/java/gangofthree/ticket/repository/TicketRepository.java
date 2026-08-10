package gangofthree.ticket.repository;

import gangofthree.ticket.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query(value = """
        SELECT m.id AS matchId, s.name AS sport, ht.name AS hostTeam, gt.name AS guestTeam, 
               v.name AS venue, c.name AS city, m.datetime AS datetime
        FROM matches m
        JOIN sports s ON m.sport_id = s.id
        JOIN teams ht ON m.host_team_id = ht.id
        JOIN teams gt ON m.guest_team_id = gt.id
        JOIN venues v ON m.venue_id = v.id
        JOIN cities c ON v.city_id = c.id
        WHERE (CAST(:city AS text) IS NULL OR CAST(:city AS text) = '' OR c.name = CAST(:city AS text))
          AND (CAST(:sport AS text) IS NULL OR CAST(:sport AS text) = '' OR s.name = CAST(:sport AS text))
          AND m.status IN ('SCHEDULED', 'ON_SALE')
        ORDER BY m.datetime ASC
        """, nativeQuery = true)
List<TicketSearchProjection> searchTickets(@Param("city") String city, @Param("sport") String sport);

    @Query(value = """
            SELECT m.id AS matchId, m.datetime AS datetime, ht.name AS hostTeam, gt.name AS guestTeam, 
                   s.name AS sport, v.name AS venue, v.address AS venueAddress, 
                   tc.name AS categoryName, CAST(tc.amenities AS TEXT) AS amenities, 
                   ms.price AS price, CAST(COUNT(ms.id) AS INTEGER) AS remainingCapacity
            FROM matches m
            JOIN sports s ON m.sport_id = s.id
            JOIN teams ht ON m.host_team_id = ht.id
            JOIN teams gt ON m.guest_team_id = gt.id
            JOIN venues v ON m.venue_id = v.id
            JOIN match_seats ms ON ms.match_id = m.id
            JOIN ticket_categories tc ON ms.ticket_category_id = tc.id
            WHERE m.id = :matchId AND ms.status = 'AVAILABLE'
            GROUP BY m.id, m.datetime, ht.name, gt.name, s.name, v.name, v.address, tc.name, CAST(tc.amenities AS TEXT), ms.price
            """, nativeQuery = true)
    List<TicketDetailProjection> getTicketDetails(@Param("matchId") Long matchId);

    Ticket findByReservationItemId(Long reservationItemId);
}
