    package gangofthree.reservation.dto.response;

import gangofthree.reservation.entity.enums.ReservationStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

    @Data
@Builder
public class ReservationResponse {
    private Long reservationId;
    private LocalDateTime reservedAt;
    private LocalDateTime expiredAt;
    private ReservationStatus status;
    private BigDecimal totalAmount;
    private String sport;
    private String hostTeam;
    private String guestTeam;
    private String venue;
    private List<Map<String, Object>> seats;
}