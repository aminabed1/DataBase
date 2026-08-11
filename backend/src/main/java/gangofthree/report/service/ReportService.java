package gangofthree.report.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.report.entity.IssueReport;
import gangofthree.report.dto.request.ReportIssueRequest;

import java.util.List;

public interface ReportService {
    
    ApiResponse<String> submitReport(Long userId, ReportIssueRequest request);
    
    ApiResponse<List<IssueReport>> getUserReports(Long userId);
}