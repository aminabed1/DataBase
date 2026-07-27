package gangofthree.auth.service.otp;

import org.springframework.stereotype.Service;

@Service
public class SmsService implements OtpSendService {

    @Override
    public void sendOtp(String credential, String otp, Integer expirationSeconds){
        System.out.println("Sending OTP...");
    }

    @Override
    public void sendOtp(String credential, String otp) {
        sendOtp(credential, otp, null);
    }
}
