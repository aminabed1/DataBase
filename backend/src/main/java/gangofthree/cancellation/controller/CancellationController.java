package gangofthree.cancellation.controller;

import gangofthree.cancellation.dto.response.PenaltyResponse;
import gangofthree.cancellation.service.CancellationService;
import gangofthree.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cancellations")
@RequiredArgsConstructor
public class CancellationController {

    private final CancellationService cancellationService;

    @GetMapping("/{reservationId}/penalty")
    public ApiResponse<PenaltyResponse> checkPenalty(Authentication authentication, @PathVariable Long reservationId) {
        Long userId = (Long) authentication.getPrincipal();
        return cancellationService.checkPenalty(userId, reservationId);
    }

    @PostMapping("/{reservationId}")
    public ApiResponse<String> cancelTicket(
            Authentication authentication, 
            @PathVariable Long reservationId,
            @RequestParam(required = false) String reason) {
        Long userId = (Long) authentication.getPrincipal();
        return cancellationService.cancelTicketAndRefund(userId, reservationId, reason);
    }

    @GetMapping("/audit")
    public ApiResponse<java.util.List<java.util.Map<String, Object>>> getCancelledUsersAudit(
            @RequestParam(defaultValue = "sup1@test.com") String identifier) {
        return cancellationService.getCancelledUsersAudit(identifier);
    }
}