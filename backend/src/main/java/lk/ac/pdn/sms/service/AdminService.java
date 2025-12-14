package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.dto.AdminUserManagementDto;
import lk.ac.pdn.sms.entity.ActivityLog;
import lk.ac.pdn.sms.entity.AdminUser;
import lk.ac.pdn.sms.entity.Society;
import lk.ac.pdn.sms.repository.ActivityLogRepository;
import lk.ac.pdn.sms.repository.AdminUserRepository;
import lk.ac.pdn.sms.repository.SocietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final AdminUserRepository adminUserRepository;
    private final ActivityLogRepository activityLogRepository;
    private final SocietyRepository societyRepository;
    private final EmailService emailService;

    @Autowired
    public AdminService(AdminUserRepository adminUserRepository,
                        ActivityLogRepository activityLogRepository,
                        SocietyRepository societyRepository,
                        EmailService emailService) {
        this.adminUserRepository = adminUserRepository;
        this.activityLogRepository = activityLogRepository;
        this.societyRepository = societyRepository;
        this.emailService = emailService;
    }

    public AdminUser getAdminFromAuth(Authentication authentication) {
        if (authentication == null) return null;

        Object principal = authentication.getPrincipal();

        if (principal instanceof AdminUser) {
            return (AdminUser) principal;
        }

        if (principal instanceof DefaultOidcUser) {
            DefaultOidcUser oidcUser = (DefaultOidcUser) principal;
            String email = oidcUser.getEmail();
            return adminUserRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Admin user not found for email: " + email));
        }

        throw new RuntimeException("Unknown authentication principal type: " + principal.getClass().getName());
    }

    public Map<String, Object> getDashboardStats(AdminUser admin) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSocieties", societyRepository.count());
        // FIXED: Use the Enum constant, not a String
        stats.put("activeSocieties", societyRepository.countByStatus(Society.SocietyStatus.ACTIVE));
        stats.put("userRole", admin.getRole());
        return stats;
    }

    public Page<Object> getAdminSocieties(Integer year, String status, Pageable pageable) {
        return societyRepository.findAll(pageable).map(s -> (Object)s);
    }

    public Page<ActivityLog> getActivityLogs(String user, String action, Pageable pageable) {
        if (user != null && !user.isEmpty()) {
            // FIXED: Use findByUserNameContaining to match your Repository
            return activityLogRepository.findByUserNameContaining(user, pageable);
        }
        return activityLogRepository.findAll(pageable);
    }

    public void sendBulkEmail(String subject, String body, List<String> recipients, String senderName) {
        for (String recipient : recipients) {
            // NOTE: Ensure sendEmail is public in EmailService
            emailService.sendEmail(recipient, subject, body);
        }

        ActivityLog log = new ActivityLog();
        // FIXED: Use setUserName (your entity doesn't have setUser(String))
        log.setUserName(senderName);
        log.setAction("BULK_EMAIL_SENT");
        // FIXED: Use setTarget (your entity doesn't have setDetails)
        log.setTarget("Sent email '" + subject + "' to " + recipients.size() + " recipients");
        log.setTimestamp(LocalDateTime.now());
        activityLogRepository.save(log);
    }

    public AdminUser createAdminUser(AdminUserManagementDto dto) {
        if (adminUserRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        AdminUser newUser = new AdminUser();
        newUser.setName(dto.getName());
        newUser.setEmail(dto.getEmail());
        // FIXED: DTO already returns the Enum, no need for valueOf()
        newUser.setRole(dto.getRole());
        newUser.setFaculty(dto.getFaculty());
        newUser.setIsActive(true);

        return adminUserRepository.save(newUser);
    }

    public List<AdminUser> getAllAdminUsers() {
        return adminUserRepository.findAll();
    }

    public AdminUser toggleUserActive(Long id) {
        AdminUser user = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(!user.getIsActive());
        return adminUserRepository.save(user);
    }
}