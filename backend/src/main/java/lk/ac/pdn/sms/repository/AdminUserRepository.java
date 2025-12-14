package lk.ac.pdn.sms.repository;

import lk.ac.pdn.sms.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    
    Optional<AdminUser> findByEmail(String email);
    
    List<AdminUser> findByRole(AdminUser.Role role);
    
    List<AdminUser> findByRoleAndFaculty(AdminUser.Role role, String faculty);
    
    List<AdminUser> findByIsActive(Boolean isActive);
    
    boolean existsByEmail(String email);
}