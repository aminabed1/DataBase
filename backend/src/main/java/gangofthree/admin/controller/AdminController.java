package gangofthree.admin.controller;

import gangofthree.admin.service.AdminService;
import gangofthree.common.response.ApiResponse;
import gangofthree.entity.IssueReport;
import gangofthree.entity.Payment;
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
}