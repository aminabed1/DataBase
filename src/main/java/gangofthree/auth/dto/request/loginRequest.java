package gangofthree.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class loginRequest {
    @NotBlank(message = "phone number is required.")
    private String phoneNumber;

    @NotBlank(message = "password is required.")
    private String password;
}
