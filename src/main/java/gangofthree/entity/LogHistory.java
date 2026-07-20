package gangofthree.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "logs")
public class LogHistory{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "action_date", nullable = false)
    private LocalDateTime actionDate;

    @Column(name = "action", nullable = false)
    private String action;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
