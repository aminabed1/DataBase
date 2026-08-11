package gangofthree.admin.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.report.entity.IssueReport;
import gangofthree.payment.entity.Payment;
import gangofthree.reservation.entity.Reservation;

import java.util.List;

public interface AdminService {
    ApiResponse<List<IssueReport>> getOpenReports();
    ApiResponse<List<Payment>> getSuspiciousPayments();
    ApiResponse<String> forceCancelReservation(Long reservationId, String reason);
    ApiResponse<String> replyToReport(Long reportId, String replyText);
    ApiResponse<List<Reservation>> getCancelledReservations();
}
