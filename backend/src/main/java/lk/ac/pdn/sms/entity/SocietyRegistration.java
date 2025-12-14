package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "society_registration_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocietyRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- 1. Applicant ---
    private String applicantFullName;
    private String applicantRegNo;
    private String applicantEmail;
    private String applicantFaculty;
    private String applicantMobile;

    // --- 2. Society Info ---
    private String societyName;
    @Column(columnDefinition = "TEXT")
    private String aims;
    private LocalDate agmDate; // Parsed from String in Service/Controller
    private String bankAccount;
    private String bankName;

    // --- 3. Senior Treasurer ---
    private String seniorTreasurerTitle;
    private String seniorTreasurerFullName;
    private String seniorTreasurerDesignation;
    private String seniorTreasurerDepartment;
    private String seniorTreasurerEmail;
    private String seniorTreasurerAddress;
    private String seniorTreasurerMobile;

    // --- 4. Officials (Flattened) ---
    // President
    private String presidentRegNo;
    private String presidentName;
    private String presidentAddress;
    private String presidentEmail;
    private String presidentMobile;

    // Vice President (NEW)
    private String vicePresidentRegNo;
    private String vicePresidentName;
    private String vicePresidentAddress;
    private String vicePresidentEmail;
    private String vicePresidentMobile;

    // Secretary
    private String secretaryRegNo;
    private String secretaryName;
    private String secretaryAddress;
    private String secretaryEmail;
    private String secretaryMobile;

    // Joint Secretary (NEW)
    private String jointSecretaryRegNo;
    private String jointSecretaryName;
    private String jointSecretaryAddress;
    private String jointSecretaryEmail;
    private String jointSecretaryMobile;

    // Junior Treasurer
    private String juniorTreasurerRegNo;
    private String juniorTreasurerName;
    private String juniorTreasurerAddress;
    private String juniorTreasurerEmail;
    private String juniorTreasurerMobile;

    // Editor (NEW)
    private String editorRegNo;
    private String editorName;
    private String editorAddress;
    private String editorEmail;
    private String editorMobile;

    // --- 5. Lists (Linked Tables) ---

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "registration_id")
    private List<RegistrationAdvisoryBoardMember> advisoryBoard;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "registration_id")
    private List<RegistrationCommitteeMember> committeeMember;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "registration_id")
    private List<RegistrationGeneralMember> member; // General Members

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "registration_id")
    private List<RegistrationPlanningEvent> planningEvents; // Planning Events

    // --- 6. Workflow & Meta ---
    @Enumerated(EnumType.STRING)
    private ApprovalStage status = ApprovalStage.PENDING_DEAN;

    private Integer year;
    private LocalDateTime submittedDate;
    private LocalDateTime approvedDate;
    private String rejectionReason;

    private Boolean isDeanApproved = false;
    private Boolean isArApproved = false;
    private Boolean isVcApproved = false;

    private LocalDateTime deanApprovalDate;
    private LocalDateTime arApprovalDate;
    private LocalDateTime vcApprovalDate;

    @Column(columnDefinition = "TEXT")
    private String deanComment;

    @Column(columnDefinition = "TEXT")
    private String arComment;

    @Column(columnDefinition = "TEXT")
    private String vcComment;

    @PrePersist
    protected void onCreate() {
        submittedDate = LocalDateTime.now();
        if (year == null) year = LocalDate.now().getYear();
    }

    public enum ApprovalStage {
        PENDING_DEAN, PENDING_AR, PENDING_VC, APPROVED, REJECTED
    }
}