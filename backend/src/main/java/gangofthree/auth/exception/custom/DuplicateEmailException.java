package gangofthree.auth.exception.custom;

public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException() {
        super("Email already exists.");
    }

    public DuplicateEmailException(String message) {
        super(message);
    }

}
