package gangofthree.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class WalletResponse {
    private BigDecimal credit;
}