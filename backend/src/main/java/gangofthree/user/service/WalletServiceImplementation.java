package gangofthree.user.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.payment.entity.Payment;
import gangofthree.payment.entity.PaymentMethod;
import gangofthree.payment.entity.enums.PaymentStatus;
import gangofthree.payment.repository.PaymentMethodRepository;
import gangofthree.payment.repository.PaymentRepository;
import gangofthree.user.dto.request.TopUpRequest;
import gangofthree.user.dto.response.WalletResponse;
import gangofthree.user.dto.response.WalletTransactionResponse;
import gangofthree.user.entity.User;
import gangofthree.user.entity.Wallet;
import gangofthree.user.entity.WalletTransaction;
import gangofthree.user.entity.enums.TransactionType;
import gangofthree.user.repository.UserRepository;
import gangofthree.user.repository.WalletRepository;
import gangofthree.user.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletServiceImplementation implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final UserRepository userRepository;

    private Wallet getOrCreateWallet(Long userId) {
        return walletRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found."));
            Wallet newWallet = new Wallet();
            newWallet.setUser(user);
            newWallet.setCredit(BigDecimal.ZERO);
            return walletRepository.save(newWallet);
        });
    }

    @Override
    public ApiResponse<WalletResponse> getMyWallet(Long userId) {
        Wallet wallet = getOrCreateWallet(userId);
        return ApiResponse.success("Wallet retrieved successfully.", 200, new WalletResponse(wallet.getCredit()));
    }

   @Override
    @Transactional
    public ApiResponse<WalletResponse> topUpWallet(Long userId, TopUpRequest request) {
        Wallet wallet = getOrCreateWallet(userId);
        User currentUser = wallet.getUser();

        PaymentMethod method = paymentMethodRepository.findById(request.getPaymentMethodId())
                .orElseThrow(() -> new RuntimeException("Payment method not found."));

        String randomRef = "TRX-" + (10000000 + new java.util.Random().nextInt(90000000));

        Payment payment = new Payment();
        payment.setUser(currentUser);
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionRef(randomRef); 
        payment.setPaymentMethod(method);
        payment = paymentRepository.save(payment);

        wallet.setCredit(wallet.getCredit().add(request.getAmount()));
        walletRepository.save(wallet);

        WalletTransaction tx = new WalletTransaction();
        tx.setWallet(wallet);
        tx.setPayment(payment);
        tx.setAmount(request.getAmount());
        tx.setType(TransactionType.CREDIT);
        tx.setDescription("Wallet Top-Up");
        tx.setTransactionDate(LocalDateTime.now());
        walletTransactionRepository.save(tx);

        return ApiResponse.success("Wallet topped up successfully.", 200, new WalletResponse(wallet.getCredit()));
    }

    @Override
    public ApiResponse<List<WalletTransactionResponse>> getMyTransactions(Long userId) {
        Wallet wallet = getOrCreateWallet(userId);

        List<WalletTransaction> transactions = walletTransactionRepository.findByWalletIdOrderByTransactionDateDesc(wallet.getId());

        List<WalletTransactionResponse> responses = transactions.stream().map(tx -> WalletTransactionResponse.builder()
                .id("TX-" + tx.getId())
                .title(tx.getDescription())
                .date(tx.getTransactionDate())
                .amount(tx.getAmount())
                .type(tx.getType().name().toLowerCase())
                .status(tx.getPayment() != null ? tx.getPayment().getStatus().name().toLowerCase() : "completed")
                .method(tx.getPayment() != null ? tx.getPayment().getPaymentMethod().getDescription() : "Wallet Balance")
                .build()).collect(Collectors.toList());

        return ApiResponse.success("Transactions retrieved successfully.", 200, responses);
    }
}