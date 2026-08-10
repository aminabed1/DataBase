package gangofthree.payment.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    @NotNull(message = "Reservation ID is required.")
    private Long reservationId;

    @NotNull(message = "Payment Method ID is required.")
    private Long paymentMethodId;
}