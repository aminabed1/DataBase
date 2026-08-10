package gangofthree.user.service;

import gangofthree.security.otp.EmailService;
import gangofthree.security.otp.OtpPurpose;
import gangofthree.security.otp.OtpService;
import gangofthree.common.response.ApiResponse;
import gangofthree.security.otp.SmsService;
import gangofthree.user.dto.request.ChangeEmailRequest;
import gangofthree.user.dto.request.ChangePhoneRequest;
import gangofthree.user.dto.request.UpdateProfileRequest;
import gangofthree.user.dto.response.UserProfileResponse;
import gangofthree.user.entity.User;
import gangofthree.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {
    private final StringRedisTemplate redisTemplate;
    private final UserRepository userRepository;
    private final OtpService otpService;
    private final SmsService smsService;
    private final EmailService emailService;

    private static final Duration TEMP_TOKEN_EXPIRE = Duration.ofMinutes(5);

    @Override
    public ApiResponse<UserProfileResponse> getProfile(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ApiResponse.failure("User not found", 404, "USER_NOT_FOUND");
        }

        User user = optionalUser.get();
        UserProfileResponse response = UserProfileResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .isActive(user.getIsActive())
                .role(user.getRole())
                .build();

        return ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .message("User profile fetched successfully.")
                .status(200)
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<UserProfileResponse> updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ApiResponse.failure("User not found", 404, "USER_NOT_FOUND");
        }

        if (request.getFirstName() == null && request.getLastName() == null && request.getCityId() == null) {
            return ApiResponse.failure("Request body cannot be empty", 400, "EMPTY_REQUEST_BODY");
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        userRepository.save(user);

        UserProfileResponse response = UserProfileResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .isActive(user.getIsActive())
                .role(user.getRole())
                .build();

        return ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .message("Profile updated successfully")
                .status(200)
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<Void> sendOtpToOldEmail(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ApiResponse.failure("User not found", 404, "USER_NOT_FOUND");
        }

        String oldEmail = user.getEmail();
        if (oldEmail == null || oldEmail.isEmpty()) {
            return ApiResponse.success("No old email registered. Please proceed to verify the new email directly.", 200);
        }

        String otp = otpService.generateOtp();
        otpService.saveOtp("CHANGE_EMAIL_" + userId, otp, OtpPurpose.CHANGE_EMAIL);
        emailService.sendOtp(oldEmail, otp);

        return ApiResponse.success("Otp sent successfully.");
    }

    @Override
    public ApiResponse<String> verifyOldEmailOtp(Long userId, String otpCode) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ApiResponse.failure("User not found", 404, "USER_NOT_FOUND");
        }

        String subject = "CHANGE_EMAIL_" + userId;
        boolean isValidOtp = otpService.verifyOtp(subject, otpCode, OtpPurpose.CHANGE_EMAIL);
        if (!isValidOtp) {
            return ApiResponse.failure("Invalid OTP code.", 400, "INVALID_OTP");
        }

        String tempToken = UUID.randomUUID().toString();
        String tokenKey = "email_change_token:" + userId;

        redisTemplate.opsForValue().set(tokenKey, tempToken, TEMP_TOKEN_EXPIRE);

        return ApiResponse.success("Old email verified. You can now request the new email change.", 200, tempToken);
    }

    @Override
    public ApiResponse<Void> sendOtpToNewEmail(Long userId, ChangeEmailRequest request, String tempToken) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ApiResponse.failure("User not found", 404, "USER_NOT_FOUND");
        }

        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            String tokenKey = "email_change_token:" + userId;
            String savedToken = redisTemplate.opsForValue().get(tokenKey);

            if (savedToken == null || !savedToken.equals(tempToken)) {
                return ApiResponse.failure("Unauthorized action. Please verify your old email first.", 403, "OLD_EMAIL_NOT_VERIFIED");
            }
            redisTemplate.delete(tokenKey);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.failure("Email is already in use by another account.", 400, "EMAIL_ALREADY_EXISTS");
        }

        String otp = otpService.generateOtp();

        otpService.saveRawData("CHANGE_EMAIL_NEW_VAL_" + userId, request.getEmail(), TEMP_TOKEN_EXPIRE);
        otpService.saveOtp("CHANGE_EMAIL_NEW_OTP_" + userId, otp, OtpPurpose.CHANGE_EMAIL);

        emailService.sendOtp(request.getEmail(), otp);
        return ApiResponse.success("Otp sent to the new email successfully.", 200);
    }

    @Override
    public ApiResponse<Void> verifyNewEmailAndChange(Long userId, String otpCode) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ApiResponse.failure("User not found", 404, "USER_NOT_FOUND");
        }

        String otpKey = "CHANGE_EMAIL_NEW_OTP_" + userId;
        boolean isOtpValid = otpService.verifyOtp(otpKey, otpCode, OtpPurpose.CHANGE_EMAIL);
        if (!isOtpValid) {
            return ApiResponse.failure("Invalid or expired OTP code for new email.", 400, "INVALID_OTP");
        }

        String newEmail = otpService.getSavedOtp("CHANGE_EMAIL_NEW_VAL_" + userId);
        if (newEmail == null) {
            return ApiResponse.failure("Session expired. Please restart the email change process.", 400, "SESSION_EXPIRED");
        }

        if (userRepository.existsByEmail(newEmail)) {
            otpService.deleteRawData("CHANGE_EMAIL_NEW_VAL_" + userId);
            return ApiResponse.failure("Email is already in use by another account.", 400, "EMAIL_ALREADY_EXISTS");
        }

        user.setEmail(newEmail);
        userRepository.save(user);

        otpService.deleteRawData("CHANGE_EMAIL_NEW_VAL_" + userId);

        return ApiResponse.success("Your account email address has been updated successfully.", 200);
    }

    @Override
    public ApiResponse<Void> sendOtpToOldPhone(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ApiResponse.failure("User not found", 404, "USER_NOT_FOUND");
        }

        String oldPhone = user.getPhoneNumber();
        if (oldPhone == null || oldPhone.isEmpty()) {
            return ApiResponse.success("No old phone registered. Please proceed to verify the new phone directly.", 200);
        }

        String otp = otpService.generateOtp();
        otpService.saveOtp("CHANGE_PHONE_" + userId, otp, OtpPurpose.CHANGE_PHONE);
        smsService.sendOtp(oldPhone, otp);

        return ApiResponse.success("Otp sent successfully.");
    }

    @Override
    public ApiResponse<String> verifyOldPhoneOtp(Long userId, String otpCode) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ApiResponse.failure("User not found", 404, "USER_NOT_FOUND");
        }

        String subject = "CHANGE_PHONE_" + userId;
        boolean isValidOtp = otpService.verifyOtp(subject, otpCode, OtpPurpose.CHANGE_PHONE);
        if (!isValidOtp) {
            return ApiResponse.failure("Invalid OTP code.", 400, "INVALID_OTP");
        }

        String tempToken = UUID.randomUUID().toString();
        String tokenKey = "phone_change_token:" + userId;

        redisTemplate.opsForValue().set(tokenKey, tempToken, TEMP_TOKEN_EXPIRE);

        return ApiResponse.success("Old phone verified. You can now request the new phone change.", 200, tempToken);
    }

    @Override
    public ApiResponse<Void> sendOtpToNewPhone(Long userId, ChangePhoneRequest request, String tempToken) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ApiResponse.failure("User not found", 404, "USER_NOT_FOUND");
        }

        if (user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) {
            String tokenKey = "phone_change_token:" + userId;
            String savedToken = redisTemplate.opsForValue().get(tokenKey);

            if (savedToken == null || !savedToken.equals(tempToken)) {
                return ApiResponse.failure("Unauthorized action. Please verify your old phone first.", 403, "OLD_PHONE_NOT_VERIFIED");
            }
            redisTemplate.delete(tokenKey);
        }

        if (userRepository.existsUserByPhoneNumber(request.getPhone())) {
            return ApiResponse.failure("Phone number is already in use by another account.", 400, "PHONE_ALREADY_EXISTS");
        }

        String otp = otpService.generateOtp();

        otpService.saveRawData("CHANGE_PHONE_NEW_VAL_" + userId, request.getPhone(), TEMP_TOKEN_EXPIRE);
        otpService.saveOtp("CHANGE_PHONE_NEW_OTP_" + userId, otp, OtpPurpose.CHANGE_PHONE);

        smsService.sendOtp(request.getPhone(), otp);
        return ApiResponse.success("Otp sent to the new phone successfully.", 200);
    }

    @Override
    public ApiResponse<Void> verifyNewPhoneAndChange(Long userId, String otpCode) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ApiResponse.failure("User not found", 404, "USER_NOT_FOUND");
        }

        String otpKey = "CHANGE_PHONE_NEW_OTP_" + userId;
        boolean isOtpValid = otpService.verifyOtp(otpKey, otpCode, OtpPurpose.CHANGE_PHONE);
        if (!isOtpValid) {
            return ApiResponse.failure("Invalid or expired OTP code for new phone.", 400, "INVALID_OTP");
        }

        String newPhone = otpService.getSavedOtp("CHANGE_PHONE_NEW_VAL_" + userId);
        if (newPhone == null) {
            return ApiResponse.failure("Session expired. Please restart the phone change process.", 400, "SESSION_EXPIRED");
        }

        if (userRepository.existsUserByPhoneNumber(newPhone)) {
            otpService.deleteRawData("CHANGE_PHONE_NEW_VAL_" + userId);
            return ApiResponse.failure("Phone number is already in use by another account.", 400, "PHONE_ALREADY_EXISTS");
        }

        user.setPhoneNumber(newPhone);
        userRepository.save(user);

        otpService.deleteRawData("CHANGE_PHONE_NEW_VAL_" + userId);

        return ApiResponse.success("Your account phone number has been updated successfully.", 200);
    }
}
