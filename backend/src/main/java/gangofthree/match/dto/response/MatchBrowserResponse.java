package gangofthree.match.dto.response;
import gangofthree.match.dto.response.MatchBrowserResponse;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class MatchBrowserResponse {
    private String id;
    private String sport;
    private String league;
    private TeamDto teamHome;
    private TeamDto teamAway;
    private String date;
    private String time;
    private LocationDto location;
    private MatchDetailsDto details;

    @Data @Builder public static class TeamDto {
        private String name;
        private String logo;
    }

    @Data @Builder public static class LocationDto {
        private String city;
        private String province;
        private String stadium;
    }

    @Data @Builder public static class MatchDetailsDto {
        private Integer capacity;
        private Integer remainingSeats;
        private List<String> amenities;
        private EstimatedPriceDto estimatedPrice;
    }

    @Data @Builder public static class EstimatedPriceDto {
        private BigDecimal min;
        private BigDecimal max;
    }
}