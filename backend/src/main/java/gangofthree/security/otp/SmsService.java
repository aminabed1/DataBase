package gangofthree.security.otp;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class SmsService implements OtpSendService {

    @Override
    public void sendOtp(String credential, String otp, Integer expirationSeconds){
        String dateTime = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        String message = "Dear User,\n\n" +
                "A verification request was received from you.\n\n" +
                "Verification Code: " + otp + "\n" +
                "Requested at: " + dateTime + "\n\n" +
                "This code is valid for " + (expirationSeconds != null ? expirationSeconds + " seconds.\n" : "a limited time only.\n") +
                "Please do not share it with anyone for security reasons.\n\n" +
                "If you did not request this code, you can safely ignore this email.\n\n"
                ;
        System.out.println(message);
    }

    @Override
    public void sendOtp(String credential, String otp) {
        sendOtp(credential, otp, null);
    }
}
