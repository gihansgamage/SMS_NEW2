package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "society_renewals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocietyRenewal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String applicantFullName;

    @Column(nullable = false)
    private String applicantRegNo;

    @Column(nullable = false)
    private String applicantEmail;

    @Column(nullable = false)
    private String applicantFaculty;

    @Column(nullable = false)
    private String applicantMobile;

    @Column(nullable = false)
    private String societyName;

    @Column(nullable = false)
    private Integer renewalYear = LocalDate.now().getYear();

    @Column(columnDefinition = "TEXT")
    private String website;

    private LocalDate agmDate;

    private String bankAccount;
    private String bankName;

    @Column(columnDefinition = "TEXT")
    private String difficulties;

    @Column(nullable = false)
    private String seniorTreasurerTitle;

    @Column(nullable = false)
    private String seniorTreasurerFullName;

    @Column(nullable = false)
    private String seniorTreasurerDesignation;

    @Column(nullable = false)
    private String seniorTreasurerDepartment;

    @Column(nullable = false)
    private String seniorTreasurerEmail;

    @Column(nullable = false)
    private String seniorTreasurerAddress;

    @Column(nullable = false)
    private String seniorTreasurerMobile;

    private String presidentRegNo;
    private String presidentName;
    private String presidentAddress;
    private String presidentEmail;
    private String presidentMobile;

    private String vicePresidentRegNo;
    private String vicePresidentName;
    private String vicePresidentAddress;
    private String vicePresidentEmail;
    private String vicePresidentMobile;

    private String juniorTreasurerRegNo;
    private String juniorTreasurerName;
    private String juniorTreasurerAddress;
    private String juniorTreasurerEmail;
    private String juniorTreasurerMobile;

    private String secretaryRegNo;
    private String secretaryName;
    private String secretaryAddress;
    private String secretaryEmail;
    private String secretaryMobile;

    private String jointSecretaryRegNo;
    private String jointSecretaryName;
    private String jointSecretaryAddress;
    private String jointSecretaryEmail;
    private String jointSecretaryMobile;

    private String editorRegNo;
    private String editorName;
    private String editorAddress;
    private String editorEmail;
    private String editorMobile;

    @OneToMany(mappedBy = "renewal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PreviousActivity> previousActivities;

    @OneToMany(mappedBy = "renewal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RenewalAdvisoryBoardMember> advisoryBoard;

    @OneToMany(mappedBy = "renewal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RenewalCommitteeMember> committeeMember;

    @OneToMany(mappedBy = "renewal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RenewalSocietyMember> member;

    @OneToMany(mappedBy = "renewal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RenewalPlanningEvent> planningEvents;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RenewalStatus status = RenewalStatus.PENDING_DEAN;

    @Column(name = "is_dean_approved")
    private Boolean isDeanApproved = false;
    @Column(name = "is_ar_approved")
    private Boolean isArApproved = false;
    @Column(name = "is_vc_approved")
    private Boolean isVcApproved = false;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "dean_approval_date")
    private LocalDateTime deanApprovalDate;

    @Column(name = "ar_approval_date")
    private LocalDateTime arApprovalDate;

    @Column(name = "vc_approval_date")
    private LocalDateTime vcApprovalDate;

    @Column(columnDefinition = "TEXT")
    private String deanComment;

    @Column(columnDefinition = "TEXT")
    private String arComment;

    @Column(columnDefinition = "TEXT")
    private String vcComment;

    @Column(nullable = false)
    private Integer year = LocalDate.now().getYear();

    @Column(name = "submitted_date", updatable = false)
    private LocalDateTime submittedDate;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        submittedDate = LocalDateTime.now();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (this.year == null) {
            this.year = LocalDate.now().getYear();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum RenewalStatus {
        PENDING_DEAN,
        PENDING_AR,
        PENDING_VC,
        APPROVED,
        REJECTED
    }
}