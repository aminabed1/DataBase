package gangofthree.ticket.repository;

import java.time.LocalDateTime;

public interface TicketSearchProjection {
    Long getMatchId();
    String getSport();
    String getHostTeam();
    String getGuestTeam();
    String getVenue();
    String getCity();
    LocalDateTime getDatetime();
}