package gangofthree.user.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.user.dto.request.ChangeEmailRequest;
import gangofthree.user.dto.request.ChangePhoneRequest;
import gangofthree.user.dto.request.UpdateProfileRequest;
import gangofthree.user.dto.response.UserProfileResponse;

public interface UserService {
    ApiResponse<UserProfileResponse> getProfile(Long userId);
    ApiResponse<UserProfileResponse> updateProfile(Long userId, UpdateProfileRequest request);
    // ApiResponse<Void> sendOtpToOldEmail(Long userId);
    // ApiResponse<String> verifyOldEmailOtp(Long userId, String otpCode);
    ApiResponse<Void> sendOtpToNewEmail(Long userId, ChangeEmailRequest request);
    ApiResponse<Void> verifyNewEmailAndChange(Long userId, String otpCode);
    // ApiResponse<Void> sendOtpToOldPhone(Long userId);
    // ApiResponse<String> verifyOldPhoneOtp(Long userId, String otpCode);
    ApiResponse<Void> sendOtpToNewPhone(Long userId, ChangePhoneRequest request);
    ApiResponse<Void> verifyNewPhoneAndChange(Long userId, String otpCode);

}
