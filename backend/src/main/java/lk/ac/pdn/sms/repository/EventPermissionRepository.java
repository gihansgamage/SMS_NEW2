package lk.ac.pdn.sms.repository;

import lk.ac.pdn.sms.entity.EventPermission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventPermissionRepository extends JpaRepository<EventPermission, Long> {

    List<EventPermission> findByStatus(EventPermission.EventStatus status);

    // Added Missing Method
    List<EventPermission> findByStatusAndApplicantFaculty(EventPermission.EventStatus status, String applicantFaculty);

    Page<EventPermission> findByStatus(EventPermission.EventStatus status, Pageable pageable);

    @Query("SELECT e FROM EventPermission e WHERE e.status = 'APPROVED' AND e.eventDate >= CURRENT_DATE ORDER BY e.eventDate ASC")
    List<EventPermission> findUpcomingApprovedEvents();

    @Query("SELECT e FROM EventPermission e WHERE e.status = 'APPROVED' AND e.eventDate >= :currentDate ORDER BY e.eventDate ASC")
    Page<EventPermission> findUpcomingApprovedEvents(@Param("currentDate") LocalDate currentDate, Pageable pageable);

    // Added Missing Count Method
    long countByStatus(EventPermission.EventStatus status);
}