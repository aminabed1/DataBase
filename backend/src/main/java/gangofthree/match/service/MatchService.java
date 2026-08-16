package gangofthree.match.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.match.dto.response.MatchBrowserResponse;
import gangofthree.match.dto.request.MatchRequest;
import gangofthree.match.entity.Match;
import java.util.List;

public interface MatchService {
    ApiResponse<List<MatchBrowserResponse>> getAvailableMatches();
    ApiResponse<List<java.util.Map<String, Object>>> getMatchSeats(Long matchId);
    Match createMatchFromRequest(MatchRequest request);
    Match updateMatchFromRequest(Long id, MatchRequest request);
    void deleteMatch(Long matchId);
}