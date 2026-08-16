package gangofthree.report.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.report.dto.response.IssueReportResponse;
import gangofthree.report.dto.request.ReportIssueRequest;
import gangofthree.report.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import gangofthree.report.dto.response.IssueReportResponse;
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ApiResponse<String> submitReport(Authentication authentication, @Valid @RequestBody ReportIssueRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return reportService.submitReport(userId, request);
    }

    @GetMapping
    public ApiResponse<List<IssueReportResponse>> getUserReports(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return reportService.getUserReports(userId);
    }

    @GetMapping("/all")
    public ApiResponse<List<IssueReportResponse>> getAllReports() {
        return reportService.getAllReports();
    }

    @PutMapping("/{id}/resolve")
    public ApiResponse<String> resolveReport(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        String reply = body.getOrDefault("reply", "Issue resolved by support.");
        return reportService.resolveReport(id, reply);
    }
}