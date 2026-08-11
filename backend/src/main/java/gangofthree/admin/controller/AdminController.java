package gangofthree.admin.controller;

import gangofthree.admin.service.AdminService;
import gangofthree.common.response.ApiResponse;
import gangofthree.report.entity.IssueReport;
import gangofthree.payment.entity.Payment;
import gangofthree.reservation.entity.Reservation;
import gangofthree.admin.dto.request.ReplyReportRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;


    @GetMapping("/reports")
    public ApiResponse<List<IssueReport>> getReports() {
        return adminService.getOpenReports();
    }

    @GetMapping("/payments/suspicious")
    public ApiResponse<List<Payment>> getSuspiciousPayments() {
        return adminService.getSuspiciousPayments();
    }

    @PostMapping("/reservations/{id}/force-cancel")
    public ApiResponse<String> forceCancelReservation(@PathVariable Long id, @RequestParam String reason) {
        return adminService.forceCancelReservation(id, reason);
    }

    @PostMapping("/reports/{id}/reply")
    public ApiResponse<String> replyToReport(@PathVariable Long id, @RequestBody ReplyReportRequest request) {
        return adminService.replyToReport(id, request.getAdminReply());
    }

    @GetMapping("/reservations/cancelled")
    public ApiResponse<List<Reservation>> getCancelledReservations() {
        return adminService.getCancelledReservations();
    }
}