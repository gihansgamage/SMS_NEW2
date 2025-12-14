package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Entity
@Table(name = "societies", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"society_name", "year"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Society {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "society_name", nullable = false)
    private String societyName;

    @Column(nullable = false)
    private String faculty;

    @Column(nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SocietyStatus status = SocietyStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String aims;

    private LocalDate agmDate;
    private String website;
    private String bankAccount;
    private String bankName;

    private String presidentName;
    private String presidentRegNo;
    private String presidentEmail;
    private String presidentMobile;

    private String vicePresidentName;
    private String vicePresidentRegNo;
    private String vicePresidentEmail;
    private String vicePresidentMobile;

    private String secretaryName;
    private String secretaryRegNo;
    private String secretaryEmail;
    private String secretaryMobile;

    private String jointSecretaryName;
    private String jointSecretaryRegNo;
    private String jointSecretaryEmail;
    private String jointSecretaryMobile;

    private String treasurerName;
    private String treasurerRegNo;
    private String treasurerEmail;
    private String treasurerMobile;

    private String editorName;
    private String editorRegNo;
    private String editorEmail;
    private String editorMobile;

    private String seniorTreasurerName;
    private String seniorTreasurerEmail;

    private LocalDate registeredDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (this.registeredDate == null) this.registeredDate = LocalDate.now();
        if (this.year == null) this.year = LocalDate.now().getYear();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SocietyStatus {
        ACTIVE, INACTIVE, PENDING
    }
}