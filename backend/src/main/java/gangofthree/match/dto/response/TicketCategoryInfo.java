package gangofthree.match.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class TicketCategoryInfo {
    private String categoryName;
    private String amenities;
    private BigDecimal price;
    private Integer remainingCapacity;
}
