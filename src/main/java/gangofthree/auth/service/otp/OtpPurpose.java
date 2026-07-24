package gangofthree.auth.service.otp;

import lombok.Getter;

@Getter
public enum OtpPurpose {

    LOGIN("login"),
    REGISTER("register"),
    FORGOT_PASSWORD("forgot-password"),
    RESET_PASSWORD("reset-password"),
    CHANGE_PASSWORD("change-password"),

    VERIFY_PHONE("verify-phone"),
    VERIFY_EMAIL("verify-email"),

    CHANGE_PHONE("change-phone"),
    CHANGE_EMAIL("change-email"),

    TWO_FACTOR_AUTH("2fa"),
    SENSITIVE_ACTION("sensitive-action"),

    PAYMENT_CONFIRMATION("payment-confirmation"),
    RESERVATION_CONFIRMATION("reservation-confirmation"),

    ACCOUNT_ACTIVATION("account-activation"),
    ACCOUNT_DELETION("account-deletion");

    private final String key;

    OtpPurpose(String key) {
        this.key = key;
    }
}
