package gangofthree.auth.exception.custom;

public class PasswordMismatchException extends RuntimeException {
    public PasswordMismatchException(String message) {
        super(message);
    }

    public PasswordMismatchException() {
        super("Passwords do not match.");
    }
}
