package gangofthree.ticket.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import gangofthree.ticket.dto.response.TicketCategoryInfo;

@Data
@Builder
public class TicketDetailResponse {
    private Long matchId;
    private String sport;
    private String hostTeam;
    private String guestTeam;
    private String venue;
    private String venueAddress;
    private LocalDateTime datetime;
    private List<TicketCategoryInfo> availableTickets;
}