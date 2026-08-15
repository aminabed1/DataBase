package gangofthree.entity;

import gangofthree.match.entity.Venue;
import jakarta.persistence.*;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "seats")
@Check(name = "chk_seat_number", constraints = "position_number > 0")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private SeatPosition position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;
    
    
}
