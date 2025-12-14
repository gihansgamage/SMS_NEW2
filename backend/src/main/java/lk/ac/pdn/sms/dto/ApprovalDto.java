package lk.ac.pdn.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalDto {

    // --- Fields for Listing (Dashboard) ---
    private Long id;
    private String type; // "registration", "renewal", "event"
    private String societyName;
    private String eventName;
    private String applicantName;
    private String faculty;
    private LocalDateTime submittedDate;
    private String status;

    // --- Fields for Actions (Approve/Reject) ---
    private Long applicationId;
    private ApprovalAction action;
    private String rejectionReason;
    private String comment;
    private String approverRole;

    // --- HELPER METHOD (FIXES YOUR ERROR) ---
    // This allows RenewalService to call .getReason() instead of .getRejectionReason()
    public String getReason() {
        return rejectionReason != null ? rejectionReason : comment;
    }

    public enum ApprovalAction {
        APPROVE, REJECT
    }
}