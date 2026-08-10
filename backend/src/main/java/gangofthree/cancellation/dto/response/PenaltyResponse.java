package gangofthree.cancellation.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class PenaltyResponse {
    private BigDecimal totalPaid;
    private Integer penaltyPercentage;
    private BigDecimal penaltyAmount;
    private BigDecimal refundAmount;
}