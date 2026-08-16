package gangofthree.match.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.match.dto.response.MatchBrowserResponse;
import gangofthree.match.repository.MatchBrowserProjection;
import gangofthree.match.repository.MatchRepository;
import gangofthree.match.entity.Match;
import gangofthree.entity.MatchSeat;
import gangofthree.match.dto.request.MatchRequest;
import gangofthree.match.repository.*;
import gangofthree.search.service.MatchSearchIndexService;
import gangofthree.reservation.repository.MatchSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchServiceImplementation implements MatchService {

    private final MatchRepository matchRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final VenueRepository venueRepository;
    private final SportRepository sportRepository;
    private final MatchSearchIndexService matchSearchIndexService;
    private final MatchSeatRepository matchSeatRepository;
    // ==========================================
    // بخش اول: متد دریافت مسابقات برای فرانت‌اند
    // ==========================================
    @Override
    public ApiResponse<List<MatchBrowserResponse>> getAvailableMatches() {
        List<MatchBrowserProjection> projections = matchRepository.findAllAvailableMatchesNative();

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        List<MatchBrowserResponse> responses = projections.stream().map(p -> {
            
            String homeLogo = "https://ui-avatars.com/api/?name=" + p.getHomeTeam().replace(" ", "+") + "&background=random&color=fff";
            String awayLogo = "https://ui-avatars.com/api/?name=" + p.getGuestTeam().replace(" ", "+") + "&background=random&color=fff";

            List<String> amenitiesList = p.getAmenities() != null 
                    ? Arrays.asList(p.getAmenities().split(",")) 
                    : List.of("Standard Seating");

            return MatchBrowserResponse.builder()
                    .id(String.valueOf(p.getId()))
                    .sport(p.getSport())
                    .league(p.getLeague())
                    .teamHome(MatchBrowserResponse.TeamDto.builder().name(p.getHomeTeam()).logo(homeLogo).build())
                    .teamAway(MatchBrowserResponse.TeamDto.builder().name(p.getGuestTeam()).logo(awayLogo).build())
                    .date(p.getDatetime().format(dateFormatter))
                    .time(p.getDatetime().format(timeFormatter))
                    .location(MatchBrowserResponse.LocationDto.builder()
                            .city(p.getCity())
                            .province(p.getProvince())
                            .stadium(p.getStadium())
                            .build())
                    .details(MatchBrowserResponse.MatchDetailsDto.builder()
                            .capacity(p.getCapacity())
                            .remainingSeats(p.getRemainingSeats())
                            .amenities(amenitiesList)
                            .estimatedPrice(MatchBrowserResponse.EstimatedPriceDto.builder()
                                    .min(p.getMinPrice())
                                    .max(p.getMaxPrice())
                                    .build())
                            .build())
                    .build();
        }).collect(Collectors.toList());

        return ApiResponse.success("Available matches retrieved successfully", 200, responses);
    }

    // ==========================================
    // بخش دوم: متدهای مدیریت مسابقات و الاستیک سرچ
    // ==========================================
    @Override
    @Transactional
    public Match createMatchFromRequest(MatchRequest request) {
        Match match = new Match();
        return saveAndSync(match, request);
    }

    @Override
    @Transactional
    public Match updateMatchFromRequest(Long id, MatchRequest request) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));
        return saveAndSync(match, request);
    }

    @Override
    @Transactional
    public void deleteMatch(Long matchId) {
        if (!matchRepository.existsById(matchId)) {
            throw new RuntimeException("Match not found with id: " + matchId);
        }
        matchRepository.deleteById(matchId);
        matchSearchIndexService.deleteMatch(matchId);
    }

    private Match saveAndSync(Match match, MatchRequest request) {
        match.setTournament(tournamentRepository.findById(request.getTournamentId())
                .orElseThrow(() -> new RuntimeException("Tournament not found with id: " + request.getTournamentId())));

        match.setHostTeam(teamRepository.findById(request.getHostTeamId())
                .orElseThrow(() -> new RuntimeException("Host Team not found with id: " + request.getHostTeamId())));

        match.setGuestTeam(teamRepository.findById(request.getGuestTeamId())
                .orElseThrow(() -> new RuntimeException("Guest Team not found with id: " + request.getGuestTeamId())));

        match.setVenue(venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + request.getVenueId())));

        match.setSport(sportRepository.findById(request.getSportId())
                .orElseThrow(() -> new RuntimeException("Sport not found with id: " + request.getSportId())));

        match.setDatetime(request.getDatetime());
        match.setStatus(request.getStatus());

        Match savedMatch = matchRepository.save(match);

        matchSearchIndexService.indexMatch(savedMatch);

        return savedMatch;
    }

    @Override
    public ApiResponse<List<java.util.Map<String, Object>>> getMatchSeats(Long matchId) {
        List<MatchSeat> seats = matchSeatRepository.findByMatchId(matchId);
        
        List<java.util.Map<String, Object>> response = seats.stream().map(seat -> 
            java.util.Map.<String, Object>of(
                "id", seat.getId(),
                "price", seat.getPrice(),
                "status", seat.getStatus().name(),
                "category", seat.getTicketCategory().getName(),
                "row", seat.getSeat().getPosition().getRowLabel(),
                "number", seat.getSeat().getPosition().getNumber()
            )
        ).toList();
        
        return gangofthree.common.response.ApiResponse.success("Seats retrieved", 200, response);
    }
}