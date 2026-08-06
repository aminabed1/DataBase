package gangofthree.ticket.dto.response;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class TicketCategoryInfo {
    private String categoryName;
    private JsonNode amenities;
    private BigDecimal price;
    private Integer remainingCapacity;
}