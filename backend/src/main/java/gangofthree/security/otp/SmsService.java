package gangofthree.security.otp;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class SmsService implements OtpSendService {

    @Async 
    @Override
    public void sendOtp(String credential, String otp, Integer expirationSeconds){
        String dateTime = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        System.out.println("\n==================================================");
        System.out.println("📱 SMS OTP FOR [" + credential + "] : " + otp);
        System.out.println("==================================================\n");

        String message = "Dear User,\n\n" +
                "A verification request was received from you.\n\n" +
                "Verification Code: " + otp + "\n" +
                "Requested at: " + dateTime + "\n\n" +
                "This code is valid for " + (expirationSeconds != null ? expirationSeconds + " seconds.\n" : "a limited time only.\n") +
                "Please do not share it with anyone for security reasons.\n\n" +
                "If you did not request this code, you can safely ignore this email.\n\n"
                ;
        
    }

    @Async
    @Override
    public void sendOtp(String credential, String otp) {
        sendOtp(credential, otp, null);
    }
}