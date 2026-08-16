package gangofthree.payment.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.payment.dto.request.PaymentRequest;
import gangofthree.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout")
    public ApiResponse<String> processPayment(
            Authentication authentication, 
            @Valid @RequestBody PaymentRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return paymentService.processPayment(userId, request);
    }

    @GetMapping("/methods")
    public ApiResponse<java.util.List<gangofthree.payment.entity.PaymentMethod>> getPaymentMethods() {
        return paymentService.getAllowedPaymentMethods();
    }

    @GetMapping("/methods/all")
    public ApiResponse<java.util.List<gangofthree.payment.entity.PaymentMethod>> getAllPaymentMethods() {
        return paymentService.getAllPaymentMethods();
    }

    @PatchMapping("/methods/{id}/toggle")
    public ApiResponse<String> togglePaymentMethodStatus(@PathVariable Long id) {
        return paymentService.toggleMethodStatus(id);
    }
}