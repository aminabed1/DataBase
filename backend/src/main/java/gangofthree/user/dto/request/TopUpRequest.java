package gangofthree.user.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TopUpRequest {
    @NotNull(message = "Amount is required.")
    @Positive(message = "Amount must be greater than zero.")
    private BigDecimal amount;

    @NotNull(message = "Payment method is required.")
    private Long paymentMethodId;
}