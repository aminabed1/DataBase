package gangofthree.auth.controller;

import gangofthree.auth.dto.request.ForgotPasswordRequest;
import gangofthree.auth.dto.request.LoginRequest;
import gangofthree.auth.dto.request.RegisterRequest;
import gangofthree.auth.dto.response.AuthResponse;
import gangofthree.auth.service.AuthService;
import gangofthree.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);
        return ApiResponse.success("something");
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        authService.login(loginRequest);
        return ApiResponse.success("something", null);
    }

    @PostMapping("/forget-password")
    public ApiResponse<AuthResponse> forgetPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        authService.forgotPassword(forgotPasswordRequest);
        return ApiResponse.success("something", null);
    }
}