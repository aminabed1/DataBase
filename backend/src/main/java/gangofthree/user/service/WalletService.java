package gangofthree.user.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.user.dto.request.TopUpRequest;
import gangofthree.user.dto.response.WalletResponse;
import gangofthree.user.dto.response.WalletTransactionResponse;
import java.util.List;


public interface WalletService {
    ApiResponse<WalletResponse> getMyWallet(Long userId);
    ApiResponse<WalletResponse> topUpWallet(Long userId, TopUpRequest request);
    ApiResponse<List<WalletTransactionResponse>> getMyTransactions(Long userId);
}