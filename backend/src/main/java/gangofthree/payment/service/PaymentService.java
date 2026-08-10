package gangofthree.payment.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.payment.dto.request.PaymentRequest;

public interface PaymentService {
    ApiResponse<String> processPayment(Long userId, PaymentRequest request);
}