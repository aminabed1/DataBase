package gangofthree.report.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.report.entity.IssueReport;
import gangofthree.report.dto.request.ReportIssueRequest;
import gangofthree.report.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
    public ApiResponse<List<IssueReport>> getUserReports(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return reportService.getUserReports(userId);
    }
}