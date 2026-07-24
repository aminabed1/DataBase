package gangofthree.auth.service;

import gangofthree.auth.dto.request.ForgotPasswordRequest;
import gangofthree.auth.dto.request.LoginRequest;
import gangofthree.auth.dto.request.OtpRequest;
import gangofthree.auth.dto.request.RegisterRequest;
import gangofthree.auth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse verifyOtp(OtpRequest otpRequest);
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse forgotPassword(ForgotPasswordRequest forgotPasswordRequest);
}
