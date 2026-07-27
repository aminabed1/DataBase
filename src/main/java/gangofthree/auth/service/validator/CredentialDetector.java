package gangofthree.auth.service.validator;

import java.util.regex.Pattern;

public class CredentialDetector {
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^09\\d{9}$");

    public static CredentialType detect(String credential) {
        return isEmail(credential) ? CredentialType.EMAIL
                    : isPhoneNumber(credential) ? CredentialType.PHONE
                    : CredentialType.INVALID;
    }

    private static boolean isEmail(String credential) {
        return EMAIL_PATTERN.matcher(credential).matches();
    }

    private static boolean isPhoneNumber(String credential) {
        return PHONE_PATTERN.matcher(credential).matches();
    }
}
