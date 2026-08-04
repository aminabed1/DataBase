package gangofthree.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePhoneRequest {
    @NotBlank(message = "phone number is required.")
    @Pattern(regexp = "^(09|9)[0-9]{9}$", message = "invalid phone number.")
    private String phone;
}
