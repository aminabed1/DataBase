package gangofthree.match.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MatchSummaryResponse {
    private Long id;
    private String sport;
    private String hostTeam;
    private String guestTeam;
    private String venue;
    private String city;
    private LocalDateTime datetime;
}
