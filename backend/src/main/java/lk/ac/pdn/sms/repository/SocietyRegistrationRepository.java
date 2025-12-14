package lk.ac.pdn.sms.repository;

import lk.ac.pdn.sms.entity.SocietyRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocietyRegistrationRepository extends JpaRepository<SocietyRegistration, Long> {

    List<SocietyRegistration> findByStatus(SocietyRegistration.ApprovalStage status);

    List<SocietyRegistration> findByStatusAndApplicantFaculty(
            SocietyRegistration.ApprovalStage status, String faculty);

    Page<SocietyRegistration> findByYear(Integer year, Pageable pageable);

    @Query("SELECT COUNT(r) FROM SocietyRegistration r WHERE r.year = :year")
    long countByYear(@Param("year") Integer year);

    long countByStatus(SocietyRegistration.ApprovalStage status);

    // Added missing method
    Optional<SocietyRegistration> findTopBySocietyNameAndStatusOrderByApprovedDateDesc(
            String societyName, SocietyRegistration.ApprovalStage status);
}