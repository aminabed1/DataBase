package gangofthree.match.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface MatchBrowserProjection {
    Long getId();
    String getSport();
    String getLeague();
    String getHomeTeam();
    String getGuestTeam();
    LocalDateTime getDatetime();
    String getCity();
    String getProvince();
    String getStadium();
    Integer getCapacity();
    Integer getRemainingSeats();
    BigDecimal getMinPrice();
    BigDecimal getMaxPrice();
    String getAmenities();
}