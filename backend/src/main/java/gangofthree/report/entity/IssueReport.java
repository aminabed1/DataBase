package gangofthree.report.entity;

import gangofthree.report.entity.enums.IssueReportStatus;
import gangofthree.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.Check;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import gangofthree.payment.entity.Payment;

@Entity
@Getter
@Setter
@Table(name = "issue_reports")
@Check(name = "chk_issue_dates", constraints = "(resolved_at IS NULL OR created_at <= resolved_at) AND (updated_at IS NULL OR created_at <= updated_at)")
public class IssueReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueReportStatus status;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = true)
    private Payment payment;

}
