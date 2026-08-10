package gangofthree.user.controller;

import gangofthree.auth.dto.request.OtpRequest;
import gangofthree.common.response.ApiResponse;
import gangofthree.user.dto.request.ChangeEmailRequest;
import gangofthree.user.dto.request.ChangePhoneRequest;
import gangofthree.user.dto.request.UpdateProfileRequest;
import gangofthree.user.dto.response.UserProfileResponse;
import gangofthree.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ApiResponse<UserProfileResponse> getProfile(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return userService.getProfile(userId);
    }

    @PatchMapping
    public ApiResponse<UserProfileResponse> updateProfile(Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return userService.updateProfile(userId, request);
    }

    @PostMapping("/email/change/old/send-otp")
    public ApiResponse<Void> sendOtpToOldEmail(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return userService.sendOtpToOldEmail(userId);
    }

    @PostMapping("/email/change/old/verify-otp")
    public ApiResponse<String> verifyOldEmailOtp(Authentication authentication,@Valid @RequestBody OtpRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        String otp = request.getOtp();
        return userService.verifyOldEmailOtp(userId, otp);
    }

    @PostMapping("/email/change/new/send-otp")
    public ApiResponse<Void> sendOtpToNewEmail(Authentication authentication, @Valid @RequestBody ChangeEmailRequest request, @RequestHeader(value = "X-Email-Change-Token", required = false) String tempToken) {
        Long userId = (Long) authentication.getPrincipal();
        return userService.sendOtpToNewEmail(userId, request, tempToken);

    }

    @PostMapping("/email/change/new/verify-otp")
    public ApiResponse<Void> verifyNewEmailAndChange(Authentication authentication, @Valid @RequestBody OtpRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        String otp = request.getOtp();
        return userService.verifyNewEmailAndChange(userId, otp);
    }

    @PostMapping("/phone/change/old/send-otp")
    public ApiResponse<Void> sendOtpToOldPhone(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return userService.sendOtpToOldPhone(userId);
    }

    @PostMapping("/phone/change/old/verify-otp")
    public ApiResponse<String> verifyOldPhoneOtp(Authentication authentication, @Valid @RequestBody OtpRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        String otp = request.getOtp();
        return userService.verifyOldPhoneOtp(userId, otp);
    }

    @PostMapping("/phone/change/new/send-otp")
    public ApiResponse<Void> sendOtpToNewPhone(Authentication authentication, @Valid @RequestBody ChangePhoneRequest request, @RequestHeader(value = "X-Phone-Change-Token", required = false) String tempToken) {
        Long userId = (Long) authentication.getPrincipal();
        return userService.sendOtpToNewPhone(userId, request, tempToken);
    }

    @PostMapping("/phone/change/new/verify-otp")
    public ApiResponse<Void> verifyNewPhoneAndChange(Authentication authentication, @Valid @RequestBody OtpRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        String otp = request.getOtp();
        return userService.verifyNewPhoneAndChange(userId, otp);
    }
}
