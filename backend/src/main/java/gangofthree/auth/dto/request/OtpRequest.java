package gangofthree.auth.dto.request;

import gangofthree.auth.service.otp.OtpPurpose;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpRequest {

    @NotBlank(message = "credential field is required.")
    private String credential;

    @NotBlank(message = "otp is required.")
    private String otp;

    @NotBlank(message = "purpose is required")
    private OtpPurpose purpose;
}
