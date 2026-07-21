package gangofthree.entity;

import gangofthree.entity.enums.TicketStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.Check;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Check(name = "chk_ticket_dates", constraints = "used_at IS NULL OR issued_at <= used_at")
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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_item_id", nullable = false)
    private ReservationItem reservationItem;


    
}
