package gangofthree.report.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.report.dto.request.ReportIssueRequest;
import gangofthree.report.dto.response.IssueReportResponse;
import java.util.List;
public interface ReportService {
    ApiResponse<String> submitReport(Long userId, ReportIssueRequest request);
    ApiResponse<List<IssueReportResponse>> getUserReports(Long userId);
}