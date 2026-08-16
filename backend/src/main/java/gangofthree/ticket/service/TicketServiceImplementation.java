package gangofthree.ticket.service;

import java.util.stream.Collectors;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gangofthree.cancellation.repository.CancellationRepository;
import gangofthree.common.response.ApiResponse;
import gangofthree.match.entity.Match;
import gangofthree.match.repository.MatchRepository;
import gangofthree.match.service.MatchSearchService;
import gangofthree.ticket.dto.TicketDetailResponse;
import gangofthree.ticket.dto.response.TicketSearchResponse;
import gangofthree.ticket.dto.response.TicketCategoryInfo;
import gangofthree.ticket.dto.response.TicketResponse;
import gangofthree.ticket.entity.Ticket;
import gangofthree.ticket.repository.TicketDetailProjection;
import gangofthree.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketServiceImplementation implements TicketService {

    private final TicketRepository ticketRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final MatchSearchService matchSearchService;
    private final MatchRepository matchRepository;
    private final CancellationRepository cancellationRepository;

    @Override
    public ApiResponse<List<TicketSearchResponse>> searchTickets(String query, String city, String sport) {
        String cacheKey = String.format("cache:tickets:search:%s:%s:%s",
                query != null ? query : "all",
                city != null ? city : "all",
                sport != null ? sport : "all");

        try {
            String cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                List<TicketSearchResponse> responses = objectMapper.readValue(
                        cachedData,
                        new TypeReference<List<TicketSearchResponse>>() {}
                );
                return ApiResponse.success("Tickets retrieved from Redis cache.", 200, responses);
            }
        } catch (Exception e) {
            log.error("Redis read failed: {}", e.getMessage());
        }

        List<Long> matchIds = matchSearchService.searchMatchIds(query, sport, city);

        if (matchIds.isEmpty()) {
            return ApiResponse.success("No tickets found.", 200, List.of());
        }

        List<Match> matches = matchRepository.findAllById(matchIds);

        List<TicketSearchResponse> responses = matches.stream()
                .map(match -> TicketSearchResponse.builder()
                        .matchId(match.getId())
                        .sport(match.getSport().getName())
                        .hostTeam(match.getHostTeam().getName())
                        .guestTeam(match.getGuestTeam().getName())
                        .venue(match.getVenue().getName())
                        .city(match.getVenue().getCity().getName())
                        .datetime(match.getDatetime())
                        .build())
                .toList();

        try {
            redisTemplate.opsForValue().set(
                    cacheKey,
                    objectMapper.writeValueAsString(responses),
                    Duration.ofMinutes(15)
            );
        } catch (Exception e) {
            log.error("Redis write failed: {}", e.getMessage());
        }

        return ApiResponse.success("Tickets retrieved from Elasticsearch.", 200, responses);
    }

    @Override
    public ApiResponse<TicketDetailResponse> getTicketDetails(Long matchId) {
        List<TicketDetailProjection> projections = ticketRepository.getTicketDetails(matchId);

        if (projections.isEmpty()) {
            return ApiResponse.failure("No tickets available for this match.", 404, "TICKETS_NOT_FOUND");
        }

        TicketDetailProjection baseInfo = projections.get(0);

        List<TicketCategoryInfo> availableTickets = projections.stream().map(p -> {
            JsonNode amenitiesJson = null;
            try {
                if (p.getAmenities() != null) {
                    amenitiesJson = objectMapper.readTree(p.getAmenities());
                }
            } catch (Exception e) {
                log.error(e.getMessage());
            }

            return TicketCategoryInfo.builder()
                    .categoryName(p.getCategoryName())
                    .amenities(amenitiesJson)
                    .price(p.getPrice())
                    .remainingCapacity(p.getRemainingCapacity())
                    .build();
        }).toList();

        TicketDetailResponse response = TicketDetailResponse.builder()
                .matchId(baseInfo.getMatchId())
                .sport(baseInfo.getSport())
                .hostTeam(baseInfo.getHostTeam())
                .guestTeam(baseInfo.getGuestTeam())
                .venue(baseInfo.getVenue())
                .venueAddress(baseInfo.getVenueAddress())
                .datetime(baseInfo.getDatetime())
                .availableTickets(availableTickets)
                .build();

        return ApiResponse.success("Ticket details retrieved from Database.", 200, response);
    }

    @Override
    public ApiResponse<List<TicketResponse>> getMyTickets(Long userId) {
        List<Ticket> tickets = ticketRepository.findAllUserTickets(userId);

        List<TicketResponse> responses = tickets.stream().map(t -> {
            var match = t.getReservationItem().getMatchSeat().getMatch();

            boolean isCancelReq = cancellationRepository.hasPendingCancellationNative(
                    t.getReservationItem().getReservation().getId()
            );

            return TicketResponse.builder()
                    .id(t.getId())
                    .ticketCode(t.getTicketCode())
                    .status(t.getStatus().name())
                    .category(t.getReservationItem().getMatchSeat().getTicketCategory().getName())
                    .sport(match.getSport() != null ? match.getSport().getName() : "General")
                    .issuedAt(t.getIssuedAt() != null ? t.getIssuedAt().toString() : "")
                    .matchDate(match.getDatetime() != null ? match.getDatetime().toString() : "")
                    .venueName(match.getVenue() != null ? match.getVenue().getName() : "")
                    .hostTeam(match.getHostTeam() != null ? match.getHostTeam().getName() : "")
                    .guestTeam(match.getGuestTeam() != null ? match.getGuestTeam().getName() : "")
                    .price(t.getReservationItem().getPriceAtTime())
                    .reservationId(t.getReservationItem().getReservation().getId())
                    .cancellationRequested(isCancelReq)
                    .build();
        }).collect(Collectors.toList());

        return ApiResponse.success("Tickets retrieved successfully", 200, responses);
    }

    public List<Match> searchMatches(String query, String sport, String city) {
        List<Long> matchIds = matchSearchService.searchMatchIds(query, sport, city);

        if (matchIds.isEmpty()) {
            return List.of();
        }

        return matchRepository.findAllById(matchIds);
    }
}