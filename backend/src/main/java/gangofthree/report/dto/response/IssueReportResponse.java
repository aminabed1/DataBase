package gangofthree.report.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class IssueReportResponse {
    private Long id;
    private String subject;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private String adminReply;
    private Long relatedPaymentId;
}