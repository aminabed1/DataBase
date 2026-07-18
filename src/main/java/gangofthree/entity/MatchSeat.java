package gangofthree.entity;

import gangofthree.entity.enums.MatchSeatStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "match_seats")
public class MatchSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchSeatStatus status;
}
