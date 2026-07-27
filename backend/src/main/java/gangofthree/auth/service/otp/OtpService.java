package gangofthree.auth.service.otp;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@RequiredArgsConstructor
@Service
public class OtpService {
    private final StringRedisTemplate redisTemplate;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    private static final Duration OTP_EXPIRE = Duration.ofSeconds(120);
    private static final int MAX_OTP_ATTEMPTS = 5;

    public String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    public void saveOtp(String credential, String otp, OtpPurpose purpose) {
        String otpKey = buildOtpKey(credential,  purpose);
        String attemptKey = buildAttemptsKey(credential, purpose);

        String hashedOtp = passwordEncoder.encode(otp);

        redisTemplate.opsForValue().set(otpKey, hashedOtp, OTP_EXPIRE);
        redisTemplate.delete(attemptKey);
    }

    public boolean verifyOtp(String credential, String otp, OtpPurpose purpose) {
        String otpKey = buildOtpKey(credential,  purpose);
        String attemptKey = buildAttemptsKey(credential, purpose);

        String savedOtp = redisTemplate.opsForValue().get(otpKey);

        if (savedOtp == null) {
            return false;
        }

        Long attempts = redisTemplate.opsForValue().increment(attemptKey);

        if (attempts != null && attempts == 1L) {
            redisTemplate.expire(attemptKey, OTP_EXPIRE);
        }

        if (attempts != null && attempts > MAX_OTP_ATTEMPTS) {
            redisTemplate.delete(otpKey);
            redisTemplate.delete(attemptKey);
            return false;
        }


        boolean matched = passwordEncoder.matches(otp, savedOtp);

        if (matched) {
            redisTemplate.delete(otpKey);
            redisTemplate.delete(attemptKey);
        }

        return matched;
    }

    private String buildOtpKey(String credential, OtpPurpose purpose) {
        return String.format("otp:%s:%s", purpose.getKey(), normalizeCredential(credential));
    }

    private String buildAttemptsKey(String credential, OtpPurpose purpose) {
        return String.format("otp:%s:%s:attempts", purpose.getKey(), normalizeCredential(credential));
    }

    private String normalizeCredential(String string) {
        return string.trim().toLowerCase();
    }
}
