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
}