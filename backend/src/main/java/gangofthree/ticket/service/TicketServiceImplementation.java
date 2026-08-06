package gangofthree.ticket.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gangofthree.common.response.ApiResponse;
import gangofthree.ticket.dto.response.TicketDetailResponse;
import gangofthree.ticket.dto.response.TicketSearchResponse;
import gangofthree.ticket.dto.response.TicketCategoryInfo;
import gangofthree.ticket.repository.TicketDetailProjection;
import gangofthree.ticket.repository.TicketRepository;
import gangofthree.ticket.repository.TicketSearchProjection;
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

    @Override
    public ApiResponse<List<TicketSearchResponse>> searchTickets(String city, String sport) {
        String cacheKey = String.format("cache:tickets:search:%s:%s", 
                city != null ? city : "all", 
                sport != null ? sport : "all");

        try {
            String cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                List<TicketSearchResponse> responses = objectMapper.readValue(cachedData, new TypeReference<>() {});
                return ApiResponse.success("Tickets retrieved from Redis cache.", 200, responses);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        List<TicketSearchProjection> projections = ticketRepository.searchTickets(city, sport);
        List<TicketSearchResponse> responses = projections.stream().map(p ->
                TicketSearchResponse.builder()
                        .matchId(p.getMatchId())
                        .sport(p.getSport())
                        .hostTeam(p.getHostTeam())
                        .guestTeam(p.getGuestTeam())
                        .venue(p.getVenue())
                        .city(p.getCity())
                        .datetime(p.getDatetime())
                        .build()
        ).toList();

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(responses), Duration.ofMinutes(15));
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return ApiResponse.success("Tickets retrieved from Database.", 200, responses);
    }

    @Override
    public ApiResponse<TicketDetailResponse> getTicketDetails(Long matchId) {
        String cacheKey = "cache:tickets:details:" + matchId;

        try {
            String cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                TicketDetailResponse response = objectMapper.readValue(cachedData, TicketDetailResponse.class);
                return ApiResponse.success("Ticket details retrieved from Redis cache.", 200, response);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

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

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(response), Duration.ofMinutes(10));
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return ApiResponse.success("Ticket details retrieved from Database.", 200, response);
    }
}