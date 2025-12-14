package lk.ac.pdn.sms.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class EventPermissionDto {
    @NotBlank(message = "Society name is required")
    private String societyName;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @NotBlank(message = "Registration number is required")
    private String applicantRegNo;

    @NotBlank(message = "Email is required")
    private String applicantEmail;

    @NotBlank(message = "Position is required")
    private String applicantPosition;

    @NotBlank(message = "Mobile is required")
    private String applicantMobile;

    @NotBlank(message = "Event name is required")
    private String eventName;

    @NotNull(message = "Event date is required")
    private String eventDate; // String to handle ISO date parsing in Service

    private String timeFrom;
    private String timeTo;
    private String place;

    private Boolean isInsideUniversity;
    private Boolean latePassRequired;
    private Boolean outsidersInvited;
    private String outsidersList;
    private Boolean firstYearParticipation;

    private String budgetEstimate;
    private String fundCollectionMethods;
    private String studentFeeAmount;

    private String seniorTreasurerName;
    private String seniorTreasurerDepartment;
    private String seniorTreasurerMobile;

    private String premisesOfficerName;
    private String premisesOfficerDesignation;
    private String premisesOfficerDivision;

    private String receiptNumber;
    private String paymentDate;
}