package gangofthree.auth.exception;

import gangofthree.auth.exception.custom.DuplicateEmailException;
import gangofthree.auth.exception.custom.DuplicatePhoneNumberException;
import gangofthree.auth.exception.custom.InvalidCredentialException;
import gangofthree.auth.exception.custom.PasswordMismatchException;
import gangofthree.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "gangofthree.auth")
public class AuthExceptionHandler {

    @ExceptionHandler(InvalidCredentialException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidCredentials(
            InvalidCredentialException exception
    ) {
        ApiResponse<Void> response = ApiResponse.failure(exception.getMessage(), 401);
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }

    @ExceptionHandler(DuplicatePhoneNumberException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicatePhoneNumber(
            DuplicatePhoneNumberException exception
    ) {
        ApiResponse<Void> response = ApiResponse.failure(exception.getMessage(), 409);
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateEmail(
            DuplicateEmailException exception
    ) {
        ApiResponse<Void> response = ApiResponse.failure(exception.getMessage(), 409);
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleMismatchPassword(
            PasswordMismatchException exception
    ) {
        ApiResponse<Void> response = ApiResponse.failure(exception.getMessage(), 400);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}
