package gangofthree.match.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.match.dto.response.MatchDetailResponse;
import gangofthree.match.dto.response.MatchSummaryResponse;

import java.util.List;

public interface MatchService {
    ApiResponse<List<MatchSummaryResponse>> searchMatches(String city, String sport);
    ApiResponse<MatchDetailResponse> getMatchDetails(Long matchId);
}
