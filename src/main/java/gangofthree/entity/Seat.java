package gangofthree.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private SeatPosition position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id",  nullable = false)
    private Venue venue;
}