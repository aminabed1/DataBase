package gangofthree.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiResponse {
    private String message;
    private String token;
}