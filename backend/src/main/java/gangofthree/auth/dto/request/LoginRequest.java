package gangofthree.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "credential is required.")
    private String credential;

    @NotBlank(message = "password is required.")
    private String password;
}