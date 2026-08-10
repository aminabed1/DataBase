package gangofthree.cancellation.service;

import gangofthree.cancellation.dto.response.PenaltyResponse;
import gangofthree.common.response.ApiResponse;

public interface CancellationService {
    ApiResponse<PenaltyResponse> checkPenalty(Long userId, Long reservationId);
    ApiResponse<String> cancelTicketAndRefund(Long userId, Long reservationId, String reason);
}