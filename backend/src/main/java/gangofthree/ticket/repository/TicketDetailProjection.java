package gangofthree.ticket.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface TicketDetailProjection {
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