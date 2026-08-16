package gangofthree.reservation.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.reservation.dto.request.ReserveTicketRequest;
import gangofthree.reservation.dto.response.ReservationResponse;
import gangofthree.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ApiResponse<ReservationResponse> reserveTicket(
            Authentication authentication, 
            @Valid @RequestBody ReserveTicketRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return reservationService.createReservation(userId, request);
    }

    @GetMapping("/active")
    public ApiResponse<List<ReservationResponse>> getActiveReservations(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return reservationService.getActiveReservations(userId);
    }

    @GetMapping("/history")
    public ApiResponse<List<ReservationResponse>> getReservationHistory(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return reservationService.getReservationHistory(userId);
    }

    @GetMapping("/all")
    public ApiResponse<List<ReservationResponse>> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<String> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return reservationService.updateReservationStatus(id, status);
    }
}