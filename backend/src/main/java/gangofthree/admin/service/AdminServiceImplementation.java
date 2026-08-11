package gangofthree.admin.service;

import gangofthree.admin.repository.IssueReportRepository;
import gangofthree.common.response.ApiResponse;
import gangofthree.entity.IssueReport;
import gangofthree.entity.Payment;
import gangofthree.entity.Reservation;
import gangofthree.entity.enums.IssueReportStatus;
import gangofthree.entity.enums.PaymentStatus;
import gangofthree.entity.enums.ReservationStatus;
import gangofthree.payment.repository.PaymentRepository;
import gangofthree.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImplementation implements AdminService {

    private final IssueReportRepository issueReportRepository;
    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    @Override
    public ApiResponse<List<IssueReport>> getOpenReports() {
        List<IssueReport> reports = issueReportRepository.findByStatus(IssueReportStatus.OPEN);
        return ApiResponse.success("Open reports retrieved", 200, reports);
    }

    @Override
    public ApiResponse<List<Payment>> getSuspiciousPayments() {
        List<Payment> suspicious = paymentRepository.findByStatus(PaymentStatus.FAILED);
        return ApiResponse.success("Suspicious payments retrieved", 200, suspicious);
    }

    @Override
    @Transactional
    public ApiResponse<String> forceCancelReservation(Long reservationId, String reason) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);

        return ApiResponse.success("Reservation force cancelled by Admin.", 200, "Reason: " + reason);
    }

    @Override
    public ApiResponse<String> replyToReport(Long reportId, String replyText) {
        IssueReport report = issueReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        String updatedDescription = report.getDescription() + "\n\n--- Admin Reply ---\n" + replyText;
        report.setDescription(updatedDescription);
        
        report.setStatus(IssueReportStatus.RESOLVED);
        report.setUpdatedAt(LocalDateTime.now());
        report.setResolvedAt(LocalDateTime.now());
        
        issueReportRepository.save(report);
        
        return ApiResponse.success("Reply submitted and report resolved.", 200, "Report ID: " + reportId);
    }

    @Override
    public ApiResponse<List<Reservation>> getCancelledReservations() {
        List<Reservation> cancelled = reservationRepository.findByStatus(ReservationStatus.CANCELLED);
        return ApiResponse.success("Cancelled reservations retrieved.", 200, cancelled);
    }
}