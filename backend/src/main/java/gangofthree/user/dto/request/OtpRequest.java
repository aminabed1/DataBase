package gangofthree.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpRequest {
    @NotBlank(message = "otp code is required.")
    @Size(min = 6, max = 6, message = "Otp code must be 6 digit.")
    private String otp;
}
