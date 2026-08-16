package gangofthree.payment.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.payment.dto.request.PaymentRequest;
import gangofthree.payment.entity.PaymentMethod;

import java.util.List;

public interface PaymentService {
    ApiResponse<String> processPayment(Long userId, PaymentRequest request);
    ApiResponse<List<PaymentMethod>> getAllowedPaymentMethods();

    // متدهای اختصاصی پنل پشتیبان
    ApiResponse<List<PaymentMethod>> getAllPaymentMethods();
    ApiResponse<String> toggleMethodStatus(Long methodId);
}