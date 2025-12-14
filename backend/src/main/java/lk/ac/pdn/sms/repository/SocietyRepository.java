package lk.ac.pdn.sms.repository;

import lk.ac.pdn.sms.entity.Society;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface SocietyRepository extends JpaRepository<Society, Long> {
    Optional<Society> findBySocietyName(String societyName);

    boolean existsBySocietyNameAndYear(String societyName, Integer year);

    // Used for Dashboard Statistics
    long countByStatus(Society.SocietyStatus status);

    List<Society> findByStatus(Society.SocietyStatus status);

    // Custom search query for the Explore page filters
    @Query("SELECT s FROM Society s WHERE " +
            "(:search IS NULL OR LOWER(s.societyName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:status IS NULL OR s.status = :status) AND " +
            "(:year IS NULL OR s.year = :year)")
    Page<Society> search(@Param("search") String search,
                         @Param("status") Society.SocietyStatus status,
                         @Param("year") Integer year,
                         Pageable pageable);
}