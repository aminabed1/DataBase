package gangofthree.user.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(max = 50, message = "first name must not exceed 50 characters.")
    private String firstName;

    @Size(max = 50, message = "last name must not exceed 50 characters.")
    private String lastName;

    private Long cityId;
}
