package gangofthree.admin.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.entity.IssueReport;
import gangofthree.entity.Payment;
import gangofthree.entity.Reservation;

import java.util.List;

public interface AdminService {
    ApiResponse<List<IssueReport>> getOpenReports();
    ApiResponse<List<Payment>> getSuspiciousPayments();
    ApiResponse<String> forceCancelReservation(Long reservationId, String reason);
    ApiResponse<String> replyToReport(Long reportId, String replyText);
    ApiResponse<List<Reservation>> getCancelledReservations();
}
