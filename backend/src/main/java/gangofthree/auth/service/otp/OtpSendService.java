package gangofthree.auth.service.otp;

public interface OtpSendService {
    void sendOtp(String credential, String otp, Integer expirationSeconds);
    void sendOtp(String credential, String otp);
}
