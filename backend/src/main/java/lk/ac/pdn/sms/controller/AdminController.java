package lk.ac.pdn.sms.controller;

import lk.ac.pdn.sms.dto.AdminUserManagementDto;
import lk.ac.pdn.sms.dto.ApprovalDto;
import lk.ac.pdn.sms.entity.ActivityLog;
import lk.ac.pdn.sms.entity.AdminUser;
import lk.ac.pdn.sms.service.AdminService;
import lk.ac.pdn.sms.service.ApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;
    private final ApprovalService approvalService;

    @Autowired
    public AdminController(AdminService adminService, ApprovalService approvalService) {
        this.adminService = adminService;
        this.approvalService = approvalService;
    }

    // --- Core & Dashboard ---

    @GetMapping("/user-info")
    public ResponseEntity<AdminUser> getCurrentAdmin(Authentication authentication) {
        return ResponseEntity.ok(adminService.getAdminFromAuth(authentication));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        AdminUser admin = adminService.getAdminFromAuth(authentication);
        return ResponseEntity.ok(adminService.getDashboardStats(admin));
    }

    // --- Tab: Approvals ---

    @GetMapping("/pending-approvals")
    public ResponseEntity<List<?>> getPendingApprovals(Authentication authentication) {
        AdminUser admin = adminService.getAdminFromAuth(authentication);
        return ResponseEntity.ok(approvalService.getPendingItemsForAdmin(admin));
    }

    @PostMapping("/approve-registration/{id}")
    @PreAuthorize("hasAnyRole('DEAN', 'ASSISTANT_REGISTRAR', 'VICE_CHANCELLOR')")
    public ResponseEntity<?> approveRegistration(@PathVariable Long id, @RequestBody ApprovalDto dto) {
        approvalService.processRegistrationApproval(id, dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reject-registration/{id}")
    @PreAuthorize("hasAnyRole('DEAN', 'ASSISTANT_REGISTRAR', 'VICE_CHANCELLOR')")
    public ResponseEntity<?> rejectRegistration(@PathVariable Long id, @RequestBody ApprovalDto dto) {
        approvalService.processRegistrationApproval(id, dto);
        return ResponseEntity.ok().build();
    }

    // --- Tab: Societies ---

    @GetMapping("/societies")
    public ResponseEntity<Page<Object>> getAdminSocieties(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(adminService.getAdminSocieties(year, status, pageable));
    }

    // --- Tab: Activity Logs ---

    @GetMapping("/activity-logs")
    public ResponseEntity<Page<ActivityLog>> getActivityLogs(
            @RequestParam(required = false) String user,
            @RequestParam(required = false) String action,
            Pageable pageable) {
        return ResponseEntity.ok(adminService.getActivityLogs(user, action, pageable));
    }

    // --- Tab: Communication ---

    @PostMapping("/send-email")
    public ResponseEntity<?> sendBulkEmail(Authentication authentication, @RequestBody Map<String, Object> emailRequest) {
        AdminUser admin = adminService.getAdminFromAuth(authentication);
        String subject = (String) emailRequest.get("subject");
        String body = (String) emailRequest.get("body");
        List<String> recipients = (List<String>) emailRequest.get("recipients");

        adminService.sendBulkEmail(subject, body, recipients, admin.getName());
        return ResponseEntity.ok().build();
    }

    // --- Tab: User Management (AR Only) ---

    @PostMapping("/ar/manage-admin/add")
    @PreAuthorize("hasRole('ASSISTANT_REGISTRAR')")
    public ResponseEntity<AdminUser> addAdminUser(@Valid @RequestBody AdminUserManagementDto dto) {
        return ResponseEntity.ok(adminService.createAdminUser(dto));
    }

    @GetMapping("/ar/manage-admin/all")
    @PreAuthorize("hasRole('ASSISTANT_REGISTRAR')")
    public ResponseEntity<List<AdminUser>> getAllAdminUsers() {
        return ResponseEntity.ok(adminService.getAllAdminUsers());
    }

    @PostMapping("/ar/manage-admin/toggle-active")
    @PreAuthorize("hasRole('ASSISTANT_REGISTRAR')")
    public ResponseEntity<AdminUser> toggleUserActive(@RequestParam Long id) {
        return ResponseEntity.ok(adminService.toggleUserActive(id));
    }

    // --- Tab: Monitoring (Student Service Only) ---

    @GetMapping("/ss/monitoring-applications")
    @PreAuthorize("hasRole('STUDENT_SERVICE')")
    public ResponseEntity<List<ApprovalDto>> getMonitoringApplications() {
        return ResponseEntity.ok(approvalService.getMonitoringApplications());
    }
}