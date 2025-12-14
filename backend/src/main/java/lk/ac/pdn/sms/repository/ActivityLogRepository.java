package lk.ac.pdn.sms.repository;

import lk.ac.pdn.sms.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    Page<ActivityLog> findByUserNameContaining(String userName, Pageable pageable);
    
    Page<ActivityLog> findByActionContaining(String action, Pageable pageable);
    
    Page<ActivityLog> findByUserNameContainingAndActionContaining(String userName, String action, Pageable pageable);
    
    Page<ActivityLog> findByUserId(Long userId, Pageable pageable);
}