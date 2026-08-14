package gangofthree.security.otp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService implements OtpSendService {
    private final JavaMailSender mailSender;

    @Override
    public void sendOtp(String credential, String otp, Integer expirationSeconds) {
        String dateTime = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

//         SimpleMailMessage message = new SimpleMailMessage();

//         message.setFrom("Gang-Of-Three-Team");
//         message.setTo(credential);
// //        message.setReplyTo("amin.m.abdollahi@gmail.com");
//         message.setSubject("One-Time Verification Code | Gang Of Three Team");
//         message.setSentDate(new Date());

//         message.setText(
//                 "Dear User,\n\n" +
//                         "A verification request was received from you.\n\n" +
//                         "Verification Code: " + otp + "\n" +
//                         "Requested at: " + dateTime + "\n\n" +
//                         "This code is valid for " + (expirationSeconds != null ? expirationSeconds + " seconds.\n" : "a limited time only.\n") +
//                         "Please do not share it with anyone for security reasons.\n\n" +
//                         "If you did not request this code, you can safely ignore this email.\n\n"
//         );

//         mailSender.send(message);

        // چاپ کردن کد در ترمینال اینتلی‌جی (IntelliJ)
        System.out.println("=====================================");
        System.out.println("📧 MOCK EMAIL SENT TO: " + credential);
        System.out.println("🔑 YOUR OTP CODE IS: " + otp);
        System.out.println("=====================================");

        log.info("OTP email successfully sent to: {}", credential);
    }

    @Override
    public void sendOtp(String credential, String otp) {
        sendOtp(credential, otp, null);
    }
}
