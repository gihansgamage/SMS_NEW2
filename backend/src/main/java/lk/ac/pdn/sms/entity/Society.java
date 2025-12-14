package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "societies")
@IdClass(SocietyId.class) // Uses the composite key
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Society {

    @Id
    @Column(name = "society_name", nullable = false)
    private String societyName;

    @Id
    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(nullable = false)
    private String faculty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SocietyStatus status = SocietyStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String aims;

    private LocalDate agmDate;
    private String website;
    private String bankAccount;
    private String bankName;

    // Officials
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

    // Mapping Junior Treasurer to specific columns
    private String juniorTreasurerName;
    private String juniorTreasurerRegNo;
    private String juniorTreasurerEmail;
    private String juniorTreasurerMobile;

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
        // Year must be set by service/controller before saving
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SocietyStatus {
        ACTIVE, INACTIVE, PENDING
    }
}