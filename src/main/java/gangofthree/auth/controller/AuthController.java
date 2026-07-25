package gangofthree.auth.controller;

import gangofthree.auth.dto.request.ForgotPasswordRequest;
import gangofthree.auth.dto.request.LoginRequest;
import gangofthree.auth.dto.request.OtpRequest;
import gangofthree.auth.dto.request.RegisterRequest;
import gangofthree.auth.dto.response.AuthResponse;
import gangofthree.auth.service.AuthService;
import gangofthree.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return ApiResponse.success("register successful", response);
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ApiResponse.success("login successful", response);
    }

    @PostMapping("/verify-otp")
    public ApiResponse<AuthResponse> verifyOtp(@Valid @RequestBody OtpRequest otpRequest) {
        AuthResponse response = authService.verifyOtp(otpRequest);
        return ApiResponse.success("verify opt successful", response);
    }

    @PostMapping("/forgot-password")
    public ApiResponse<AuthResponse> forgetPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        AuthResponse response = authService.forgotPassword(forgotPasswordRequest);
        return ApiResponse.success("reset password successful", response);
    }
}