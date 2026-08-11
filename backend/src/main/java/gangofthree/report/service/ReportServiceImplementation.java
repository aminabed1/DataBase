package gangofthree.report.service;

import gangofthree.report.repository.IssueReportRepository;
import gangofthree.common.response.ApiResponse;
import gangofthree.report.entity.IssueReport;
import gangofthree.payment.entity.Payment;
import gangofthree.report.entity.enums.IssueReportStatus;
import gangofthree.payment.repository.PaymentRepository;
import gangofthree.report.dto.request.ReportIssueRequest;
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
    public ApiResponse<List<IssueReport>> getUserReports(Long userId) {
        List<IssueReport> reports = issueReportRepository.findByUserId(userId);
        return ApiResponse.success("User reports retrieved.", 200, reports);
    }
}