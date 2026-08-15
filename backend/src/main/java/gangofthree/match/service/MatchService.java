package gangofthree.match.service;

import gangofthree.match.entity.Match;
import gangofthree.match.dto.request.MatchRequest;
import gangofthree.match.repository.*;
import gangofthree.search.service.MatchSearchIndexService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final VenueRepository venueRepository;
    private final SportRepository sportRepository;
    private final MatchSearchIndexService matchSearchIndexService;

    @Transactional
    public Match createMatchFromRequest(MatchRequest request) {
        Match match = new Match();
        return saveAndSync(match, request);
    }

    @Transactional
    public Match updateMatchFromRequest(Long id, MatchRequest request) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));
        return saveAndSync(match, request);
    }

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
}
