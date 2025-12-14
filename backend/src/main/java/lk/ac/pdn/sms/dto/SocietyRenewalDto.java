package lk.ac.pdn.sms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class SocietyRenewalDto {
    
    @NotBlank(message = "Applicant full name is required")
    private String applicantFullName;
    
    @NotBlank(message = "Applicant registration number is required")
    private String applicantRegNo;
    
    @Email(message = "Valid email address is required")
    @NotBlank(message = "Applicant email is required")
    private String applicantEmail;
    
    @NotBlank(message = "Applicant faculty is required")
    private String applicantFaculty;
    
    @NotBlank(message = "Applicant mobile number is required")
    private String applicantMobile;
    
    @NotBlank(message = "Society name is required")
    private String societyName;
    
    @NotBlank(message = "Bank account number is required")
    private String bankAccount;
    
    @NotBlank(message = "Bank name is required")
    private String bankName;
    
    @NotNull(message = "AGM date is required")
    private LocalDate agmDate;
    
    @NotBlank(message = "Difficulties description is required")
    private String difficulties;
    
    private String website;
    
    // Senior Treasurer
    @NotBlank(message = "Senior treasurer title is required")
    private String seniorTreasurerTitle;
    
    @NotBlank(message = "Senior treasurer name is required")
    private String seniorTreasurerFullName;
    
    @NotBlank(message = "Senior treasurer designation is required")
    private String seniorTreasurerDesignation;
    
    @NotBlank(message = "Senior treasurer department is required")
    private String seniorTreasurerDepartment;
    
    @Email(message = "Valid senior treasurer email is required")
    @NotBlank(message = "Senior treasurer email is required")
    private String seniorTreasurerEmail;
    
    @NotBlank(message = "Senior treasurer address is required")
    private String seniorTreasurerAddress;
    
    @NotBlank(message = "Senior treasurer mobile is required")
    private String seniorTreasurerMobile;
    
    // Advisory Board
    private List<AdvisoryBoardMemberDto> advisoryBoard;
    
    // Society Officials
    @NotBlank(message = "President registration number is required")
    private String presidentRegNo;
    
    @NotBlank(message = "President name is required")
    private String presidentName;
    
    @NotBlank(message = "President address is required")
    private String presidentAddress;
    
    @Email(message = "Valid president email is required")
    @NotBlank(message = "President email is required")
    private String presidentEmail;
    
    @NotBlank(message = "President mobile is required")
    private String presidentMobile;
    
    // Vice President
    @NotBlank(message = "Vice president registration number is required")
    private String vicePresidentRegNo;
    
    @NotBlank(message = "Vice president name is required")
    private String vicePresidentName;
    
    @NotBlank(message = "Vice president address is required")
    private String vicePresidentAddress;
    
    @Email(message = "Valid vice president email is required")
    @NotBlank(message = "Vice president email is required")
    private String vicePresidentEmail;
    
    @NotBlank(message = "Vice president mobile is required")
    private String vicePresidentMobile;
    
    // Junior Treasurer
    @NotBlank(message = "Junior treasurer registration number is required")
    private String juniorTreasurerRegNo;
    
    @NotBlank(message = "Junior treasurer name is required")
    private String juniorTreasurerName;
    
    @NotBlank(message = "Junior treasurer address is required")
    private String juniorTreasurerAddress;
    
    @Email(message = "Valid junior treasurer email is required")
    @NotBlank(message = "Junior treasurer email is required")
    private String juniorTreasurerEmail;
    
    @NotBlank(message = "Junior treasurer mobile is required")
    private String juniorTreasurerMobile;
    
    // Secretary
    @NotBlank(message = "Secretary registration number is required")
    private String secretaryRegNo;
    
    @NotBlank(message = "Secretary name is required")
    private String secretaryName;
    
    @NotBlank(message = "Secretary address is required")
    private String secretaryAddress;
    
    @Email(message = "Valid secretary email is required")
    @NotBlank(message = "Secretary email is required")
    private String secretaryEmail;
    
    @NotBlank(message = "Secretary mobile is required")
    private String secretaryMobile;
    
    // Joint Secretary
    @NotBlank(message = "Joint secretary registration number is required")
    private String jointSecretaryRegNo;
    
    @NotBlank(message = "Joint secretary name is required")
    private String jointSecretaryName;
    
    @NotBlank(message = "Joint secretary address is required")
    private String jointSecretaryAddress;
    
    @Email(message = "Valid joint secretary email is required")
    @NotBlank(message = "Joint secretary email is required")
    private String jointSecretaryEmail;
    
    @NotBlank(message = "Joint secretary mobile is required")
    private String jointSecretaryMobile;
    
    // Editor
    @NotBlank(message = "Editor registration number is required")
    private String editorRegNo;
    
    @NotBlank(message = "Editor name is required")
    private String editorName;
    
    @NotBlank(message = "Editor address is required")
    private String editorAddress;
    
    @Email(message = "Valid editor email is required")
    @NotBlank(message = "Editor email is required")
    private String editorEmail;
    
    @NotBlank(message = "Editor mobile is required")
    private String editorMobile;
    
    // Committee Members and General Members
    private List<CommitteeMemberDto> committeeMember;
    private List<MemberDto> member;
    
    // Previous Activities
    private List<PreviousActivityDto> previousActivities;
    
    // Future Planning Events
    private List<PlanningEventDto> planningEvents;

    @Data
    public static class AdvisoryBoardMemberDto {
        @NotBlank(message = "Advisory board member name is required")
        private String name;
        
        @NotBlank(message = "Advisory board member designation is required")
        private String designation;
        
        @NotBlank(message = "Advisory board member department is required")
        private String department;
    }

    @Data
    public static class CommitteeMemberDto {
        @NotBlank(message = "Committee member registration number is required")
        private String regNo;
        
        @NotBlank(message = "Committee member name is required")
        private String name;
    }

    @Data
    public static class MemberDto {
        @NotBlank(message = "Member registration number is required")
        private String regNo;
        
        @NotBlank(message = "Member name is required")
        private String name;
    }

    @Data
    public static class PreviousActivityDto {
        @NotBlank(message = "Previous activity month is required")
        private String month;
        
        @NotBlank(message = "Previous activity description is required")
        private String activity;
    }

    @Data
    public static class PlanningEventDto {
        @NotBlank(message = "Planning event month is required")
        private String month;
        
        @NotBlank(message = "Planning event activity is required")
        private String activity;
    }
}