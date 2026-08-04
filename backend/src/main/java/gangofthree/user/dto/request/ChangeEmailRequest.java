package gangofthree.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeEmailRequest {

    @NotBlank(message = "email is required.")
    @Email(message = "invalid email address.")
    private String email;
}
