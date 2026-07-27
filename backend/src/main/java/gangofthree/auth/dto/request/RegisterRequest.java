package gangofthree.auth.dto.request;

import gangofthree.entity.City;
import gangofthree.user.entity.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = "first name is required.")
    private String firstName;

    @NotBlank(message = "last name is required.")
    private String lastName;

    @NotBlank(message = "phone number is required")
    @Pattern(regexp = "^09\\d{9}$", message = "Phone number must be valid")
    private String phoneNumber;

    @NotBlank(message = "email is required.")
    @Email
    private String email;

    @NotBlank(message = "password is required.")
    private String password;

    @NotBlank(message = "password confirm is required.")
    private String confirmPassword;

    @NotNull(message = "role is required.")
    private Role role;

    @NotNull(message = "city id is required")
    private Long cityId;
}