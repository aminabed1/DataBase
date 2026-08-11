package gangofthree.cancellation.entity;

import gangofthree.reservation.entity.Reservation;
import gangofthree.cancellation.entity.enums.CancellationStatus;
import gangofthree.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.Check;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "cancellations")
@Check(name = "chk_cancellation_dates", constraints = "processed_at IS NULL OR requested_at <= processed_at")
public class Cancellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "text")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CancellationStatus status;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

}
