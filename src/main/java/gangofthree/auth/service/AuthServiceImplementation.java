package gangofthree.auth.service;

import gangofthree.auth.dto.request.ForgotPasswordRequest;
import gangofthree.auth.dto.request.LoginRequest;
import gangofthree.auth.dto.request.RegisterRequest;
import gangofthree.auth.dto.response.AuthResponse;
import gangofthree.auth.exception.custom.DuplicatePhoneNumberException;
import gangofthree.auth.exception.custom.InvalidCredentialException;
import gangofthree.auth.exception.custom.PasswordMismatchException;
import gangofthree.user.entity.User;
import gangofthree.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthServiceImplementation implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findUserByPhoneNumber(loginRequest.getPhoneNumber())
                .orElseThrow(() -> new InvalidCredentialException(
                        "Invalid phone number or password."
                ));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialException("Invalid phone number or password.");
        }

        //TODO: create token for enter to profile after login
        return AuthResponse.builder()
                .message("login successful.")
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