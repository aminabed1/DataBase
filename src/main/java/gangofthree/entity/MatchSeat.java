package gangofthree.entity;

import gangofthree.entity.enums.MatchSeatStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.Check;
import java.math.BigDecimal;

@Entity
@Table(name = "match_seats")
@Check(name = "chk_seat_price", constraints = "price >= 0")
public class MatchSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchSeatStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_category_id", nullable = false)
    private TicketCategory ticketCategory;
}
