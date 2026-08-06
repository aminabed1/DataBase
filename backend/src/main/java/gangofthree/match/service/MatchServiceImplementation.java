package gangofthree.match.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import gangofthree.common.response.ApiResponse;
import gangofthree.match.dto.response.MatchDetailResponse;
import gangofthree.match.dto.response.MatchSummaryResponse;
import gangofthree.match.dto.response.TicketCategoryInfo;
import gangofthree.match.repository.MatchDetailProjection;
import gangofthree.match.repository.MatchRepository;
import gangofthree.match.repository.MatchSummaryProjection;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchServiceImplementation implements MatchService {

    private final MatchRepository matchRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public ApiResponse<List<MatchSummaryResponse>> searchMatches(String city, String sport) {
        String cacheKey = String.format("cache:matches:search:%s:%s", 
                city != null ? city : "all", 
                sport != null ? sport : "all");

        try {
            String cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                List<MatchSummaryResponse> responses = objectMapper.readValue(cachedData, new TypeReference<>() {});
                return ApiResponse.success("Matches retrieved from Redis cache.", 200, responses);
            }
        } catch (Exception e) {
            log.error("Redis Cache Error: ", e);
        }

        List<MatchSummaryProjection> projections = matchRepository.searchMatches(city, sport);
        List<MatchSummaryResponse> responses = projections.stream().map(p ->
                MatchSummaryResponse.builder()
                        .id(p.getId())
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
            log.error("Failed to write to Redis: ", e);
        }

        return ApiResponse.success("Matches retrieved from Database.", 200, responses);
    }

    @Override
    public ApiResponse<MatchDetailResponse> getMatchDetails(Long matchId) {
        String cacheKey = "cache:matches:details:" + matchId;

        try {
            String cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                MatchDetailResponse response = objectMapper.readValue(cachedData, MatchDetailResponse.class);
                return ApiResponse.success("Match details retrieved from Redis cache.", 200, response);
            }
        } catch (Exception e) {
            log.error("Redis Cache Error: ", e);
        }

        List<MatchDetailProjection> projections = matchRepository.getMatchTicketDetails(matchId);

        if (projections.isEmpty()) {
            return ApiResponse.failure("Match not found or no tickets available.", 404, "MATCH_NOT_FOUND");
        }

        MatchDetailProjection baseInfo = projections.get(0);
        
        List<TicketCategoryInfo> availableTickets = projections.stream().map(p ->
                TicketCategoryInfo.builder()
                        .categoryName(p.getCategoryName())
                        .amenities(p.getAmenities())
                        .price(p.getPrice())
                        .remainingCapacity(p.getRemainingCapacity())
                        .build()
        ).toList();
