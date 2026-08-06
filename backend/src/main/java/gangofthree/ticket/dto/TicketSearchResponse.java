package gangofthree.ticket.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TicketSearchResponse {
    private Long matchId;
    private String sport;
    private String hostTeam;
    private String guestTeam;
    private String venue;
    private String city;
    private LocalDateTime datetime;
}