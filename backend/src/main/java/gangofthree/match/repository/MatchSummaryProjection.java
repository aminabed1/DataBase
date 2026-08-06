package gangofthree.match.repository;

import java.time.LocalDateTime;

public interface MatchSummaryProjection {
    Long getId();
    String getSport();
    String getHostTeam();
    String getGuestTeam();
    String getVenue();
    String getCity();
    LocalDateTime getDatetime();
}
