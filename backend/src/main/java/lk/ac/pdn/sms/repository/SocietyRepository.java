package lk.ac.pdn.sms.repository;

import lk.ac.pdn.sms.entity.Society;
import lk.ac.pdn.sms.entity.SocietyId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocietyRepository extends JpaRepository<Society, SocietyId> {

    // Fetch the LATEST record for a society name
    Optional<Society> findTopBySocietyNameOrderByYearDesc(String societyName);

    // Check existence using name and year
    boolean existsBySocietyNameAndYear(String societyName, Integer year);

    // Used for dropdowns (returns all versions or distinct names)
    @Query("SELECT s FROM Society s WHERE s.status = :status ORDER BY s.societyName ASC")
    List<Society> findByStatus(@Param("status") Society.SocietyStatus status);

    long countByStatus(Society.SocietyStatus status);

    // Custom search that handles the composite key structure
    @Query("SELECT s FROM Society s WHERE " +
            "(:search IS NULL OR LOWER(s.societyName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:status IS NULL OR s.status = :status) AND " +
            "(:year IS NULL OR s.year = :year) " +
            "ORDER BY s.year DESC, s.societyName ASC")
    Page<Society> search(@Param("search") String search,
                         @Param("status") Society.SocietyStatus status,
                         @Param("year") Integer year,
                         Pageable pageable);
}