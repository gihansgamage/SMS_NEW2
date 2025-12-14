package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "event_permissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Applicant Details ---
    @Column(nullable = false)
    private String applicantName;
    @Column(nullable = false)
    private String applicantRegNo;
    @Column(nullable = false)
    private String applicantEmail;
    @Column(nullable = false)
    private String applicantMobile;
    @Column(nullable = false)
    private String applicantPosition;

    // Derived from Society for Dean routing
    @Column(nullable = false)
    private String applicantFaculty;

    // --- Event Details ---
    @Column(nullable = false)
    private String societyName;
    @Column(nullable = false)
    private String eventName;
    @Column(nullable = false)
    private LocalDate eventDate;

    private LocalTime timeFrom;
    private LocalTime timeTo;
    private String place;

    // --- Logistics & Flags ---
    private Boolean isInsideUniversity;
    private Boolean latePassRequired;
    private Boolean outsidersInvited;
    @Column(columnDefinition = "TEXT")
    private String outsidersList;
    private Boolean firstYearParticipation;

    // --- Financials ---
    @Column(columnDefinition = "TEXT")
    private String budgetEstimate;
    private String fundCollectionMethods;
    private String studentFeeAmount;

    // Receipt Details (for premises payment if applicable)
    private String receiptNumber;
    private LocalDate paymentDate;

    // --- Officials Involved ---
    private String seniorTreasurerName;
    private String seniorTreasurerDepartment;
    private String seniorTreasurerMobile;

    private String premisesOfficerName;
    private String premisesOfficerDesignation;
    private String premisesOfficerDivision;

    // --- Approval Workflow ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.PENDING_DEAN;

    private Boolean isDeanApproved = false;
    private Boolean isPremisesApproved = false;
    private Boolean isArApproved = false;
    private Boolean isVcApproved = false;

    private LocalDateTime deanApprovalDate;
    @Column(columnDefinition = "TEXT")
    private String deanComment;

    private LocalDateTime premisesApprovalDate;
    @Column(columnDefinition = "TEXT")
    private String premisesComment;

    private LocalDateTime arApprovalDate;
    @Column(columnDefinition = "TEXT")
    private String arComment;

    private LocalDateTime vcApprovalDate;
    @Column(columnDefinition = "TEXT")
    private String vcComment;

    private LocalDateTime submittedDate;
    private LocalDateTime approvedDate;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @PrePersist
    protected void onCreate() {
        submittedDate = LocalDateTime.now();
    }

    public enum EventStatus {
        PENDING_DEAN,
        PENDING_PREMISES,
        PENDING_AR,
        PENDING_VC,
        APPROVED,
        REJECTED
    }
}