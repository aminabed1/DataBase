package gangofthree.ticket.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.ticket.dto.response.TicketDetailResponse;
import gangofthree.ticket.dto.response.TicketSearchResponse;
import gangofthree.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping("/search")
    public ApiResponse<List<TicketSearchResponse>> searchTickets(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String sport) {
        
        return ticketService.searchTickets(city, sport);
    }

    @GetMapping("/{matchId}/details")
    public ApiResponse<TicketDetailResponse> getTicketDetails(@PathVariable Long matchId) {
        return ticketService.getTicketDetails(matchId);
    }
}