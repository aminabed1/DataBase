package gangofthree.ticket.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.ticket.dto.TicketDetailResponse;
import gangofthree.ticket.dto.response.TicketSearchResponse;
import gangofthree.ticket.dto.response.TicketResponse;
import java.util.List;

public interface TicketService {
    ApiResponse<List<TicketSearchResponse>> searchTickets(String city, String sport);
    ApiResponse<TicketDetailResponse> getTicketDetails(Long matchId);
    ApiResponse<List<TicketResponse>> getMyTickets(Long userId);
}