package gangofthree.booking.service;

import gangofthree.booking.dto.response.BookingResponse;
import gangofthree.common.response.ApiResponse;
import gangofthree.ticket.entity.Ticket;
import gangofthree.ticket.entity.enums.TicketStatus;
import gangofthree.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImplementation implements BookingService {

    private final TicketRepository ticketRepository;

    @Override
    public ApiResponse<List<BookingResponse>> getUserBookings(Long userId, String filter) {
        List<Ticket> allTickets = getRawUserTicketsCached(userId);

        if (filter != null && !filter.isEmpty()) {
            allTickets = switch (filter.toUpperCase()) {
                case "FUTURE" -> allTickets.stream()
                        .filter(t -> t.getReservationItem().getMatchSeat().getMatch().getDatetime().isAfter(LocalDateTime.now())
                                && t.getStatus() == TicketStatus.ISSUED)
                        .collect(Collectors.toList());
                case "CANCELLED" -> allTickets.stream()
                        .filter(t -> t.getStatus() == TicketStatus.CANCELLED)
                        .collect(Collectors.toList());
                case "USED" -> allTickets.stream()
                        .filter(t -> t.getStatus() == TicketStatus.USED)
                        .collect(Collectors.toList());
                default -> allTickets;
            };
        }

        List<BookingResponse> responses = allTickets.stream().map(t -> BookingResponse.builder()
                .ticketCode(t.getTicketCode())
                .hostTeam(t.getReservationItem().getMatchSeat().getMatch().getHostTeam().getName())
                .guestTeam(t.getReservationItem().getMatchSeat().getMatch().getGuestTeam().getName())
                .venueName(t.getReservationItem().getMatchSeat().getMatch().getVenue().getName())
                .matchDate(t.getReservationItem().getMatchSeat().getMatch().getDatetime())
                .pricePaid(t.getReservationItem().getPriceAtTime())
                .ticketStatus(t.getStatus())
                .reservationId(t.getReservationItem().getReservation().getId())
                .build()).toList();

        return ApiResponse.success("User bookings retrieved successfully.", 200, responses);
    }

    @Cacheable(value = "userBookingsCache", key = "#userId")
    public List<Ticket> getRawUserTicketsCached(Long userId) {
        return ticketRepository.findAllUserTickets(userId);
    }
}