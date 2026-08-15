package gangofthree.auth.service;

import gangofthree.auth.dto.request.LoginRequest;
import gangofthree.auth.dto.request.OtpRequest;
import gangofthree.auth.dto.request.RegisterRequest;
import gangofthree.auth.dto.request.forgotpassword.ForgotPasswordOtpRequest;
import gangofthree.auth.dto.request.forgotpassword.ForgotPasswordRequest;
import gangofthree.auth.dto.request.forgotpassword.ResetPasswordRequest;
import gangofthree.auth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse verifyOtp(OtpRequest otpRequest);
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse forgotPassword(ForgotPasswordRequest forgotPasswordRequest);
    AuthResponse verifyForgotPasswordOtp(ForgotPasswordOtpRequest request);
    AuthResponse resetPassword(ResetPasswordRequest request);
    AuthResponse requestLoginOtp(String credential);
}