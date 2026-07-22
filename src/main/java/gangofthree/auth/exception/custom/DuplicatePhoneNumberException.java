package gangofthree.auth.exception.custom;

public class DuplicatePhoneNumberException extends RuntimeException {
    public DuplicatePhoneNumberException(String message) {
        super(message);
    }

    public DuplicatePhoneNumberException() {
        super("Duplicate phone number.");
    }
}
