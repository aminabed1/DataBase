package gangofthree.auth.dto.request.forgotpassword;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordRequest {

    @NotBlank(message = "Credential is required.")
    private String credential;
}