package gangofthree.auth.controller;

import gangofthree.auth.dto.request.forgotpassword.ForgotPasswordOtpRequest;
import gangofthree.auth.dto.request.forgotpassword.ForgotPasswordRequest;
import gangofthree.auth.dto.request.LoginRequest;
import gangofthree.auth.dto.request.OtpRequest;
import gangofthree.auth.dto.request.RegisterRequest;
import gangofthree.auth.dto.request.forgotpassword.ResetPasswordRequest;
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
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ApiResponse.success("register successful.", response);
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ApiResponse.success("login successful.", response);
    }

    @PostMapping("/verify-otp")
    public ApiResponse<AuthResponse> verifyOtp(@Valid @RequestBody OtpRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ApiResponse.success("verify otp successful.", response);
    }

    @PostMapping("/forgot-password")
    public ApiResponse<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        AuthResponse response = authService.forgotPassword(request);
        return ApiResponse.success("reset password successful.", response);
    }

    @PostMapping("/forgot-password/verify-otp")
    public ApiResponse<AuthResponse> verifyForgotPasswordOtp(@Valid @RequestBody ForgotPasswordOtpRequest request) {
        AuthResponse response = authService.verifyForgotPasswordOtp(request);
        return ApiResponse.success("verify otp successful.", response);
    }

    @PostMapping("/forgot-password/reset")
    public ApiResponse<AuthResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        AuthResponse response = authService.resetPassword(request);
        return ApiResponse.success("reset password successful.", response);
    }

    @PostMapping("/login/otp-request")
    public ApiResponse<AuthResponse> requestLoginOtp(@Valid @RequestBody ForgotPasswordRequest request) {
        AuthResponse response = authService.requestLoginOtp(request.getCredential());
        return ApiResponse.success("OTP sent.", response);
    }
}