package gangofthree.match.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.match.dto.response.MatchDetailResponse;
import gangofthree.match.dto.response.MatchSummaryResponse;
import gangofthree.match.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    // API 5:
    @GetMapping
    public ApiResponse<List<MatchSummaryResponse>> searchMatches(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String sport) {
        
        return matchService.searchMatches(city, sport);
    }

    // API 6: 
    @GetMapping("/{matchId}")
    public ApiResponse<MatchDetailResponse> getMatchDetails(@PathVariable Long matchId) {
        return matchService.getMatchDetails(matchId);
    }
}
