package gangofthree.auth.service.otp;

import org.springframework.stereotype.Service;

@Service
public class SmsService implements OtpSendService {
    public void sendOtp(String credential, String otp, Integer expirationSeconds){
    }
}
