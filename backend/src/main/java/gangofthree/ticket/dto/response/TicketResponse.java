package gangofthree.ticket.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class TicketResponse {
    private Long id;
    private String ticketCode;
    private String status;
    private String issuedAt;
    private String matchDate;
    private String sport;
    private String category;
    private String venueName;
    private String hostTeam;
    private String guestTeam;
    private BigDecimal price;
    private Long reservationId;
    private Boolean cancellationRequested;
}