package lk.ac.pdn.sms.repository;

import lk.ac.pdn.sms.entity.SocietyRenewal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocietyRenewalRepository extends JpaRepository<SocietyRenewal, Long> {

    List<SocietyRenewal> findByStatus(SocietyRenewal.RenewalStatus status);

    List<SocietyRenewal> findByStatusAndApplicantFaculty(
            SocietyRenewal.RenewalStatus status, String applicantFaculty);

    Page<SocietyRenewal> findByYear(Integer year, Pageable pageable);

    @Query("SELECT COUNT(r) FROM SocietyRenewal r WHERE r.year = :year")
    long countByYear(@Param("year") Integer year);

    long countByStatus(SocietyRenewal.RenewalStatus status);

    // Added missing methods to match Service calls
    boolean existsBySocietyNameAndYear(String societyName, Integer year);

    Optional<SocietyRenewal> findTopBySocietyNameAndStatusOrderByApprovedDateDesc(
            String societyName, SocietyRenewal.RenewalStatus status);
}