package gangofthree.match.dto.request;

import gangofthree.entity.enums.MatchStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MatchRequest {
    private Long tournamentId;
    private Long hostTeamId;
    private Long guestTeamId;
    private Long venueId;
    private Long sportId;
    private LocalDateTime datetime;
    private MatchStatus status;
}
