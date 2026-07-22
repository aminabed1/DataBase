package gangofthree.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = "phone number is required")
    @Pattern(regexp = "^09\\d{9}$", message = "Phone number must be valid")
    private String phoneNumber;

    @NotBlank(message = "first name is required.")
    private String firstName;

    @NotBlank(message = "last name is required.")
    private String lastName;
}