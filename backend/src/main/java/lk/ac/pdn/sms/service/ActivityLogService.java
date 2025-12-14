package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.entity.ActivityLog;
import lk.ac.pdn.sms.entity.AdminUser;
import lk.ac.pdn.sms.repository.ActivityLogRepository;
import lk.ac.pdn.sms.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    public void logActivity(String action, String target, String userName) {
        // MODIFIED: Removed + "@pdn.ac.lk" to allow finding users by ANY email (e.g., Gmail)
        AdminUser user = adminUserRepository.findByEmail(userName).orElse(null);

        ActivityLog log = new ActivityLog();
        // FIX: Set to null if user not found (instead of 0L)
        log.setUserId(user != null ? user.getId() : null);
        log.setUserName(userName);
        log.setAction(action);
        log.setTarget(target);

        activityLogRepository.save(log);
    }

    public void logActivity(String action, String target, String adminId, String userName) {
        ActivityLog log = new ActivityLog();
        try {
            log.setUserId(Long.valueOf(adminId));
        } catch (NumberFormatException | NullPointerException e) {
            // FIX: Set to null if ID invalid
            log.setUserId(null);
        }

        log.setUserName(userName);
        log.setAction(action);
        log.setTarget(target);

        activityLogRepository.save(log);
    }

    public void logAction(String action, String target, Long userId, String userName, String additionalInfo) {
        ActivityLog log = new ActivityLog();
        log.setUserId(userId);
        log.setUserName(userName);
        log.setAction(action);
        log.setTarget(target);

        activityLogRepository.save(log);
    }

    public List<ActivityLog> getAllLogs() {
        return activityLogRepository.findAll();
    }

    public Page<ActivityLog> getActivityLogs(String userFilter, String actionFilter, Pageable pageable) {
        if (userFilter != null && !userFilter.isEmpty() && actionFilter != null && !actionFilter.isEmpty()) {
            return activityLogRepository.findByUserNameContainingAndActionContaining(userFilter, actionFilter, pageable);
        } else if (userFilter != null && !userFilter.isEmpty()) {
            return activityLogRepository.findByUserNameContaining(userFilter, pageable);
        } else if (actionFilter != null && !actionFilter.isEmpty()) {
            return activityLogRepository.findByActionContaining(actionFilter, pageable);
        }

        return activityLogRepository.findAll(pageable);
    }
}