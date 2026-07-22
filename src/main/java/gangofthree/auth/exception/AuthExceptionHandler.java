package gangofthree.auth.exception;

import gangofthree.auth.exception.custom.InvalidCredentialException;
import gangofthree.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "gangofthree.auth")
public class AuthExceptionHandler {
    public ResponseEntity<ApiResponse<Void>> handleInvalidCredentials(
            InvalidCredentialException exception
    ) {
        ApiResponse<Void> response = ApiResponse.failure(exception.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }
}
