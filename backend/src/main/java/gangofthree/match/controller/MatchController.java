package gangofthree.match.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.match.entity.Match;
import gangofthree.match.dto.request.MatchRequest;
import gangofthree.match.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ApiResponse<Match> createMatch(@Valid @RequestBody MatchRequest request) {
        Match match = matchService.createMatchFromRequest(request);
        return ApiResponse.success("Match created and indexed successfully.", 200, match);
    }

    @PutMapping("/{id}")
    public ApiResponse<Match> updateMatch(@PathVariable Long id, @Valid @RequestBody MatchRequest request) {
        Match updatedMatch = matchService.updateMatchFromRequest(id, request);
        return ApiResponse.success("Match updated and re-indexed successfully.", 200, updatedMatch);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteMatch(@PathVariable Long id) {
        matchService.deleteMatch(id);
        return ApiResponse.success("Match deleted from Database and Elasticsearch.", 200, "Match ID: " + id);
    }
}
