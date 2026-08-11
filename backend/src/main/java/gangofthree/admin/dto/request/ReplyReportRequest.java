package gangofthree.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplyReportRequest {
    @NotBlank(message = "Reply message cannot be empty")
    private String adminReply;
}