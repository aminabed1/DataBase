package gangofthree.user.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.user.dto.request.TopUpRequest;
import gangofthree.user.dto.response.WalletResponse;
import gangofthree.user.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import gangofthree.user.dto.response.WalletTransactionResponse;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/wallets/me")
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ApiResponse<WalletResponse> getMyWallet(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return walletService.getMyWallet(userId);
    }

    @PostMapping("/top-up")
    public ApiResponse<WalletResponse> topUpWallet(Authentication authentication, @Valid @RequestBody TopUpRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return walletService.topUpWallet(userId, request);
    }

    @GetMapping("/transactions")
    public ApiResponse<List<WalletTransactionResponse>> getMyTransactions(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return walletService.getMyTransactions(userId);
    }
}