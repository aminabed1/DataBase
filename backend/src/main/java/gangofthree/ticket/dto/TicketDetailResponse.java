package gangofthree.ticket.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

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