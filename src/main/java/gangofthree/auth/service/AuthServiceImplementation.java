package gangofthree.auth.service;

import gangofthree.auth.dto.request.ForgotPasswordRequest;
import gangofthree.auth.dto.request.LoginRequest;
import gangofthree.auth.dto.request.OtpRequest;
import gangofthree.auth.dto.request.RegisterRequest;
import gangofthree.auth.dto.response.AuthResponse;
import gangofthree.auth.exception.custom.DuplicatePhoneNumberException;
import gangofthree.auth.exception.custom.InvalidCredentialException;
import gangofthree.auth.exception.custom.PasswordMismatchException;
import gangofthree.auth.service.otp.EmailService;
import gangofthree.auth.service.otp.OtpPurpose;
import gangofthree.auth.service.otp.OtpService;
import gangofthree.auth.service.otp.SmsService;
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

    @Override
    public AuthResponse login(LoginRequest loginRequest) {

        CredentialType credentialType = CredentialDetector.getCredentialType(loginRequest.getCredential());
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
            emailService.sendOtp(credential, otp);
        } else {
            smsService.sendOtp(credential, otp);
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

        CredentialType credentialType = CredentialDetector.getCredentialType(otpRequest.getCredential());

        Optional<User> optionalUser = switch (credentialType) {
            case EMAIL -> userRepository.findUserByEmail(otpRequest.getCredential());
            case PHONE -> userRepository.findUserByPhoneNumber(otpRequest.getCredential());
            case INVALID -> throw new InvalidCredentialException("Invalid credential.");
        };

        User user = optionalUser.orElseThrow(() -> new InvalidCredentialException(
                "Invalid credential."));

        //TODO: replace with functional jwt service
        String jwtToken = "some-khozaabal-token" + user.getId();

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

        return AuthResponse.builder()
                .message("register successful.")
                .build();
        //TODO: create token for enter to profile after register
    }

    @Override
    public AuthResponse forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        return null;
    }
}