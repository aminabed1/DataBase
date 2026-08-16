package gangofthree.report.service;

import gangofthree.report.repository.IssueReportRepository;
import gangofthree.common.response.ApiResponse;
import gangofthree.report.entity.IssueReport;
import gangofthree.payment.entity.Payment;
import gangofthree.report.entity.enums.IssueReportStatus;
import gangofthree.payment.repository.PaymentRepository;
import gangofthree.report.dto.request.ReportIssueRequest;
import gangofthree.report.dto.response.IssueReportResponse;
import gangofthree.user.entity.User;
import gangofthree.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImplementation implements ReportService {

    private final IssueReportRepository issueReportRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public ApiResponse<String> submitReport(Long userId, ReportIssueRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        IssueReport report = new IssueReport();
        report.setUser(user);
        report.setSubject(request.getSubject());
        report.setDescription(request.getDescription());
        report.setStatus(IssueReportStatus.OPEN);
        report.setCreatedAt(LocalDateTime.now());

        if (request.getPaymentId() != null) {
            Payment payment = paymentRepository.findById(request.getPaymentId()).orElse(null);

            if (payment == null) {
                return ApiResponse.failure("Payment ID not found.", 404, "PAYMENT_NOT_FOUND");
            }

            if (!payment.getReservation().getUser().getId().equals(userId)) {
                return ApiResponse.failure("Unauthorized: This payment does not belong to you.", 403, "UNAUTHORIZED_PAYMENT");
            }

            report.setPayment(payment);
        }

        issueReportRepository.save(report);
        return ApiResponse.success("Issue reported successfully. Support will contact you.", 200, "Report ID: " + report.getId());
    }

    @Override
    public ApiResponse<List<IssueReportResponse>> getUserReports(Long userId) {
        List<IssueReport> reports = issueReportRepository.findByUserId(userId);
        
        List<IssueReportResponse> responses = reports.stream()
            .map(report -> gangofthree.report.dto.response.IssueReportResponse.builder()
                .id(report.getId())
                .subject(report.getSubject())
                .description(report.getDescription())
                .status(report.getStatus().name())
                .createdAt(report.getCreatedAt())
                .adminReply(report.getAdminReply())
                .relatedPaymentId(report.getPayment() != null ? report.getPayment().getId() : null)
                .build())
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())) // مرتب‌سازی از جدید به قدیم
            .collect(java.util.stream.Collectors.toList());

        return ApiResponse.success("User reports retrieved.", 200, responses);
    }

    @Override
    public ApiResponse<List<IssueReportResponse>> getAllReports() {
        List<IssueReport> reports = issueReportRepository.findAll();

        List<IssueReportResponse> responses = reports.stream()
                .map(report -> IssueReportResponse.builder()
                        .id(report.getId())
                        .subject(report.getSubject())
                        .description(report.getDescription())
                        .status(report.getStatus().name())
                        .createdAt(report.getCreatedAt())
                        .adminReply(report.getAdminReply())
                        .relatedPaymentId(report.getPayment() != null ? report.getPayment().getId() : null)
                        .build())
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();

        return ApiResponse.success("All reports retrieved for support.", 200, responses);
    }

    @Override
    public ApiResponse<String> resolveReport(Long reportId, String adminReply) {
        IssueReport report = issueReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(IssueReportStatus.RESOLVED);
        report.setAdminReply(adminReply);
        report.setResolvedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());

        issueReportRepository.save(report);
        return ApiResponse.success("Report resolved successfully.", 200, "RESOLVED");
    }
}