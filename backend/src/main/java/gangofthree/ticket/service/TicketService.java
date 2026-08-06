package gangofthree.ticket.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.ticket.dto.response.TicketDetailResponse;
import gangofthree.ticket.dto.response.TicketSearchResponse;

import java.util.List;

public interface TicketService {
    ApiResponse<List<TicketSearchResponse>> searchTickets(String city, String sport);
    ApiResponse<TicketDetailResponse> getTicketDetails(Long matchId);
}