package gangofthree.cancellation.service;

import gangofthree.cancellation.dto.response.PenaltyResponse;
import gangofthree.common.response.ApiResponse;

import java.util.List;
import java.util.Map;

public interface CancellationService {
    ApiResponse<PenaltyResponse> checkPenalty(Long userId, Long reservationId);
    ApiResponse<String> cancelTicketAndRefund(Long userId, Long reservationId, String reason);

    // متد اجرای پروسیجر تحلیلی کنسلی‌ها برای پشتیبان
    ApiResponse<List<Map<String, Object>>> getCancelledUsersAudit(String supportIdentifier);
}