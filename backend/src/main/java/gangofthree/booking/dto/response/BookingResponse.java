package gangofthree.booking.dto.response;

import gangofthree.entity.enums.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {
    private String ticketCode;
    private String hostTeam;
    private String guestTeam;
    private String venueName;
    private LocalDateTime matchDate;
    private BigDecimal pricePaid;
    private TicketStatus ticketStatus;
    private Long reservationId;
}