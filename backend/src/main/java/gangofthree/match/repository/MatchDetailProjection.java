package gangofthree.match.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface MatchDetailProjection {
    Long getMatchId();
    LocalDateTime getDatetime();
    String getHostTeam();
    String getGuestTeam();
    String getSport();
    String getVenue();
    String getVenueAddress();
    String getCategoryName();
    String getAmenities();
    BigDecimal getPrice();
    Integer getRemainingCapacity();
}
