package gangofthree.reservation.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.reservation.dto.request.ReserveTicketRequest;
import gangofthree.reservation.dto.response.ReservationResponse;

import java.util.List;

public interface ReservationService {
    ApiResponse<ReservationResponse> createReservation(Long userId, ReserveTicketRequest request);
    ApiResponse<List<ReservationResponse>> getActiveReservations(Long userId);
    ApiResponse<List<ReservationResponse>> getReservationHistory(Long userId);

    ApiResponse<List<ReservationResponse>> getAllReservations();
    ApiResponse<String> updateReservationStatus(Long reservationId, String status);
}