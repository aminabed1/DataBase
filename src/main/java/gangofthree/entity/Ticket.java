package gangofthree.entity;

import gangofthree.entity.enums.TicketStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String ticketCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Column(nullable = true)
    private LocalDateTime usedAt;

    @Column(nullable = false)
    private LocalDateTime issuedAt;

    @Column(columnDefinition = "TEXT")
    private String qrPayload;

    @OneToOne(mappedBy = "Ticket")
    private ReservationItem reservationItem;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_seat_id", nullable = false)
    private MatchSeat matchSeat;

    @OneToOne(optional = true)
    @JoinColumn(name = "cancellation_id", nullable = true, unique = true)
    private Cancellation cancellation;
}
