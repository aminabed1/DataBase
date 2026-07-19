package gangofthree.entity;

import gangofthree.entity.enums.LogHistoryAction;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "log_histories")
public class LogHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private LocalDateTime DateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LogHistoryAction action;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
