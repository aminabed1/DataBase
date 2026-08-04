package gangofthree.auth.service;

import gangofthree.auth.dto.request.forgotpassword.ForgotPasswordOtpRequest;
import gangofthree.auth.dto.request.forgotpassword.ForgotPasswordRequest;
import gangofthree.auth.dto.request.LoginRequest;
import gangofthree.auth.dto.request.OtpRequest;
import gangofthree.auth.dto.request.RegisterRequest;
import gangofthree.auth.dto.request.forgotpassword.ResetPasswordRequest;
import gangofthree.auth.dto.response.AuthResponse;
import gangofthree.auth.exception.custom.DuplicatePhoneNumberException;
import gangofthree.auth.exception.custom.InvalidCredentialException;
import gangofthree.auth.exception.custom.PasswordMismatchException;
import gangofthree.security.jwt.JwtService;
import gangofthree.security.otp.EmailService;
import gangofthree.security.otp.OtpPurpose;
import gangofthree.security.otp.OtpService;
import gangofthree.security.otp.SmsService;
import gangofthree.auth.service.validator.CredentialType;
import gangofthree.auth.service.validator.CredentialDetector;
import gangofthree.user.entity.User;
import gangofthree.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImplementation implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final SmsService smsService;
    private final EmailService emailService;
    private final JwtService jwtService;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {

        CredentialType credentialType = CredentialDetector.detect(loginRequest.getCredential());
        Optional<User> optionalUser = switch (credentialType) {
            case EMAIL -> userRepository.findUserByEmail(loginRequest.getCredential());
            case PHONE -> userRepository.findUserByPhoneNumber(loginRequest.getCredential());
            case INVALID -> throw new InvalidCredentialException("Invalid credential.");
        };

        User user = optionalUser.orElseThrow(() -> new InvalidCredentialException(
                "Invalid credential or password."));


        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialException("Invalid credential or password.");
        }

        String otp = otpService.generateOtp();
        String credential = credentialType.equals(CredentialType.PHONE) ? user.getPhoneNumber() : user.getEmail();
        otpService.saveOtp(credential, otp, OtpPurpose.LOGIN);

        if (credentialType.equals(CredentialType.EMAIL)) {
            emailService.sendOtp(credential, otp, 120);
        } else {
            smsService.sendOtp(credential, otp, 120);
        }

        return AuthResponse.builder()
                .message("first step of login successful. otp sent successfully!")
                .build();
    }

    @Override
    public AuthResponse verifyOtp(OtpRequest otpRequest) {
        boolean isValidOtp = otpService.verifyOtp(otpRequest.getCredential(), otpRequest.getOtp(), otpRequest.getPurpose());
        if (!isValidOtp) {
            throw new InvalidCredentialException("Invalid otp code.");
        }

        CredentialType credentialType = CredentialDetector.detect(otpRequest.getCredential());

        Optional<User> optionalUser = switch (credentialType) {
            case EMAIL -> userRepository.findUserByEmail(otpRequest.getCredential());
            case PHONE -> userRepository.findUserByPhoneNumber(otpRequest.getCredential());
            case INVALID -> throw new InvalidCredentialException("Invalid credential.");
        };

        User user = optionalUser.orElseThrow(() -> new InvalidCredentialException(
                "Invalid credential."));

        String jwtToken = jwtService.generateAccessToken(user);

        return AuthResponse.builder()
                .message("login successful")
                .token(jwtToken)
                .build();
    }

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsUserByPhoneNumber(registerRequest.getPhoneNumber())) {
            throw new DuplicatePhoneNumberException("Phone number already exists.");
        }

        String password = registerRequest.getPassword();
        String confirmPassword = registerRequest.getConfirmPassword();

        if (!Objects.equals(password, confirmPassword)) {
            throw new PasswordMismatchException("Passwords do not match.");
        }

        String hashedPassword = passwordEncoder.encode(password);

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .phoneNumber(registerRequest.getPhoneNumber())
                .email(registerRequest.getEmail())
                .isActive(true)
                .passwordHash(hashedPassword)
                .role(registerRequest.getRole())
//                .city(registerRequest.getCity())
                .build();

        userRepository.save(user);

        String jwtToken = jwtService.generateRegisterToken(user);
        return AuthResponse.builder()
                .message("register successful.")
                .token(jwtToken)
                .build();
    }

    @Override
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        String credential = request.getCredential();
        CredentialType credentialType = CredentialDetector.detect(credential);

        Optional<User> optionalUser = switch (credentialType) {
            case EMAIL -> userRepository.findUserByEmail(credential);
            case PHONE -> userRepository.findUserByPhoneNumber(credential);
            case INVALID -> throw new InvalidCredentialException("Invalid credential.");
        };

        User user = optionalUser.orElseThrow(() ->
                new InvalidCredentialException("User not found."));

        String otp = otpService.generateOtp();
        otpService.saveOtp(credential, otp,  OtpPurpose.RESET_PASSWORD);

        if (credentialType == CredentialType.EMAIL) {
            emailService.sendOtp(user.getEmail(), otp, 120);
        } else {
            smsService.sendOtp(user.getPhoneNumber(), otp, 120);
        }

        return AuthResponse.builder()
                .message("OTP sent successfully.")
                .build();
    }

    @Override
    public AuthResponse verifyForgotPasswordOtp(ForgotPasswordOtpRequest request) {
        String credential = request.getCredential();
        CredentialType credentialType = CredentialDetector.detect(credential);

        Optional<User> optionalUser = switch (credentialType) {
            case EMAIL -> userRepository.findUserByEmail(credential);
            case PHONE -> userRepository.findUserByPhoneNumber(credential);
            case INVALID -> throw new InvalidCredentialException("Invalid credential.");
        };

        User user = optionalUser.orElseThrow(() -> new InvalidCredentialException("User not found."));

        boolean isOtpValid = otpService.verifyOtp(credential, request.getOtp(), OtpPurpose.RESET_PASSWORD);

        if (!isOtpValid) {
            throw new InvalidCredentialException("Invalid OTP.");
        }

        String resetToken = jwtService.generateResetToken(user);

        return AuthResponse.builder()
                .message("OTP verified successfully.")
                .token(resetToken)
                .build();
    }

    @Override
    public AuthResponse resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new InvalidCredentialException("Password and confirm password do not match.");
        }

        Long userId = Long.valueOf(jwtService.extractUserId(request.getResetToken()));

        User user = userRepository.findById(userId).orElseThrow(() -> new InvalidCredentialException("Invalid reset token."));

        if (!jwtService.isPasswordResetTokenValid(request.getResetToken(), user)) {
            throw new InvalidCredentialException("Invalid or expired reset token.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        return AuthResponse.builder()
                .message("Password reset successfully.")
                .build();
    }
}