package gangofthree.reservation.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import org.hibernate.annotations.Check;
import lombok.Getter;
import lombok.Setter;
import gangofthree.entity.MatchSeat;

@Getter
@Setter
@Entity
@Table(name = "reservation_items")
@Check(name = "chk_price_at_time", constraints = "price_at_time >= 0")
public class ReservationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price_at_time", nullable = false, precision = 19, scale = 2)
    private BigDecimal priceAtTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_seat_id", nullable = false)
    private MatchSeat matchSeat;
}