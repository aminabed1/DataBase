package gangofthree.match.repository;

import gangofthree.match.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query(value = """
        SELECT 
            m.id as id,
            LOWER(s.name) as sport,
            t.name as league,
            ht.name as homeTeam,
            gt.name as guestTeam,
            m.datetime as datetime,
            c.name as city,
            p.name as province,
            v.name as stadium,
            
            -- ۱. محاسبه ظرفیت کل مسابقه با شمارش تمام صندلی‌های ثبت شده برای آن
            CAST(COUNT(ms.id) AS INTEGER) as capacity,
            
            -- ۲. محاسبه صندلی‌های باقیمانده با شمارش صندلی‌هایی که وضعیت AVAILABLE دارند
            CAST(COALESCE(SUM(CASE WHEN ms.status = 'AVAILABLE' THEN 1 ELSE 0 END), 0) AS INTEGER) as remainingSeats,
            
            MIN(ms.price) as minPrice,
            MAX(ms.price) as maxPrice,
            STRING_AGG(DISTINCT tc.name, ',') as amenities
        FROM matches m
        JOIN sports s ON m.sport_id = s.id
        JOIN tournaments t ON m.tournament_id = t.id
        JOIN teams ht ON m.host_team_id = ht.id
        JOIN teams gt ON m.guest_team_id = gt.id
        JOIN venues v ON m.venue_id = v.id
        JOIN cities c ON v.city_id = c.id
        JOIN provinces p ON c.province_id = p.id
        LEFT JOIN match_seats ms ON ms.match_id = m.id
        LEFT JOIN ticket_categories tc ON ms.ticket_category_id = tc.id
        WHERE m.status IN ('SCHEDULED', 'ON_SALE')
        GROUP BY m.id, s.name, t.name, ht.name, gt.name, m.datetime, c.name, p.name, v.name
        ORDER BY m.datetime ASC
    """, nativeQuery = true)
    List<MatchBrowserProjection> findAllAvailableMatchesNative();
}