package gangofthree.auth.service;

import gangofthree.auth.dto.request.ForgotPasswordRequest;
import gangofthree.auth.dto.request.LoginRequest;
import gangofthree.auth.dto.request.RegisterRequest;
import gangofthree.auth.dto.response.AuthResponse;
import gangofthree.auth.exception.custom.DuplicatePhoneNumberException;
import gangofthree.auth.exception.custom.InvalidCredentialException;
import gangofthree.user.entity.User;
import gangofthree.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthServiceImplementation implements AuthService {
    private final UserRepository userRepository;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByPhoneNumberAndPasswordHash(loginRequest.getPhoneNumber(), loginRequest.getPassword())//TODO give password hash to method later
                .orElseThrow(() -> new InvalidCredentialException(
                        "Phone number or password is incorrect"
                ));

        return AuthResponse.builder()
                .message("login successful.")
                .build();
    }

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            throw new DuplicatePhoneNumberException("Phone number already exists.");
        }

        User user = new User();
        //TODO: hash password and fix city null value in builder pattern.
        // check equal method for password and confirmed password
        User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .phoneNumber(registerRequest.getPhoneNumber())
                .email(registerRequest.getEmail())
                .isActive(true)
                .passwordHash(registerRequest.getPassword())
                .role(registerRequest.getRole())
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .message("register successful.")
                .build();
    }

    @Override
    public AuthResponse forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        return null;
    }
}

