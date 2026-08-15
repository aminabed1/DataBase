package gangofthree.admin.controller;

import gangofthree.search.service.MatchSearchIndexService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/search")
@RequiredArgsConstructor
public class AdminSearchController {

    private final MatchSearchIndexService searchIndexService;

    @PostMapping("/reindex")
    public ResponseEntity<String> reindex() {
        long count = searchIndexService.reindexAllMatches();
        return ResponseEntity.ok("Successfully reindexed " + count + " matches.");
    }
}
