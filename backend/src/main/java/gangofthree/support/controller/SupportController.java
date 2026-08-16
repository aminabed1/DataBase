package gangofthree.support.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.report.repository.IssueReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final IssueReportRepository issueReportRepository;

    @GetMapping("/issues")
    public ApiResponse<List<Map<String, Object>>> getAllIssues() {
        List<Map<String, Object>> issues = issueReportRepository.findAllIssuesWithUserDetailsNative();
        return ApiResponse.success("Issues retrieved successfully", 200, issues);
    }

    @PostMapping("/issues/{id}/reply")
    public ApiResponse<String> replyToIssue(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String replyText = payload.get("reply");
        issueReportRepository.replyToIssueNative(id, replyText);
        return ApiResponse.success("Issue resolved and replied.", 200, "OK");
    }
}