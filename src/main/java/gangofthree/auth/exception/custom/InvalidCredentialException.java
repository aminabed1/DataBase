package gangofthree.auth.exception.custom;

public class InvalidCredentialException extends RuntimeException {
    public InvalidCredentialException(String message) {
        super(message);
    }
    public InvalidCredentialException() {
        super("Invalid username or password.");
    }
}
