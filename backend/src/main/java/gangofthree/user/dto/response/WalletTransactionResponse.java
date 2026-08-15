package gangofthree.user.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class WalletTransactionResponse {
    private String id;
    private String title;
    private LocalDateTime date;
    private BigDecimal amount;
    private String type;
    private String status;
    private String method;
}