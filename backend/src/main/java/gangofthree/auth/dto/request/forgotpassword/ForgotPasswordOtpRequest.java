package gangofthree.auth.dto.request.forgotpassword;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordOtpRequest {

    @NotBlank(message = "Credential is required.")
    private String credential;

    @NotBlank(message = "Otp is required.")
    @Pattern(regexp = "^\\d{6}$", message = "OTP must be 6 digits.")
    private String otp;
}
