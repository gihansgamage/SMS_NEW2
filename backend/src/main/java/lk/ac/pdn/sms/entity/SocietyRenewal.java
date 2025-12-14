package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "society_renewals_applications") // Table name changed as requested
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocietyRenewal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Applicant
    private String applicantFullName;
    private String applicantRegNo;
    private String applicantEmail;
    private String applicantFaculty;
    private String applicantMobile;

    // Society Identifier
    private String societyName;
    private Integer renewalYear; // Maps to renewal_year column

    @Enumerated(EnumType.STRING)
    private RenewalStatus status = RenewalStatus.PENDING_DEAN;

    // Dates
    private LocalDate submittedDate; // Maps to submitted_date? Schema doesn't specify, assuming standard

    // Approval Dates
    private LocalDateTime deanApprovalDate;
    private LocalDateTime arApprovalDate;
    private LocalDateTime vcApprovalDate;

    // Comments/Reason
    @Column(columnDefinition = "TEXT")
    private String deanComment;
    @Column(columnDefinition = "TEXT")
    private String arComment;
    @Column(columnDefinition = "TEXT")
    private String vcComment;
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    // Approval Flags
    private Boolean isDeanApproved;
    private Boolean isArApproved;
    private Boolean isVcApproved;
    private LocalDateTime approvedDate;

    // Society Data Update Fields
    private String seniorTreasurerName;
    private String seniorTreasurerEmail;
    private String seniorTreasurerMobile;
    private String seniorTreasurerTitle;
    private String seniorTreasurerDesignation;
    private String seniorTreasurerAddress;
    private String seniorTreasurerDepartment;

    private String presidentName;
    private String presidentRegNo;
    private String presidentEmail;
    private String presidentMobile;
    private String presidentAddress;

    private String secretaryName;
    private String secretaryRegNo;
    private String secretaryEmail;
    private String secretaryMobile;
    private String secretaryAddress;

    // Junior Treasurer (Using junior_treasurer_ columns)
    private String juniorTreasurerName;
    private String juniorTreasurerRegNo;
    private String juniorTreasurerEmail;
    private String juniorTreasurerMobile;
    private String juniorTreasurerAddress;

    private String vicePresidentName;
    private String vicePresidentRegNo;
    private String vicePresidentEmail;
    private String vicePresidentMobile;
    private String vicePresidentAddress;

    private String jointSecretaryName;
    private String jointSecretaryRegNo;
    private String jointSecretaryEmail;
    private String jointSecretaryMobile;
    private String jointSecretaryAddress;

    private String editorName;
    private String editorRegNo;
    private String editorEmail;
    private String editorMobile;
    private String editorAddress;

    private String bankAccount;
    private String bankName;
    private LocalDate agmDate;
    @Column(columnDefinition = "TEXT")
    private String difficulties;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (submittedDate == null) submittedDate = LocalDate.now();
        if (renewalYear == null) renewalYear = LocalDate.now().getYear();

        // Initialize flags
        if (isDeanApproved == null) isDeanApproved = false;
        if (isArApproved == null) isArApproved = false;
        if (isVcApproved == null) isVcApproved = false;
    }

    public enum RenewalStatus {
        PENDING_DEAN, PENDING_AR, PENDING_VC, APPROVED, REJECTED
    }
}