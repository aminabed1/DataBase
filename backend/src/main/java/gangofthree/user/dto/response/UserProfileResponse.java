package gangofthree.user.dto.response;

import gangofthree.user.entity.enums.Role;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserProfileResponse {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private Boolean isActive;
    private Role role;
    private String cityId;
    private String provinceId;
    private String cityName;     
    private String provinceName; 
    private String loginMethod;
}