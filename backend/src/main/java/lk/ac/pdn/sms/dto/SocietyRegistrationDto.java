package lk.ac.pdn.sms.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class SocietyRegistrationDto {
    // Applicant
    private String applicantFullName;
    private String applicantRegNo;
    private String applicantEmail;
    private String applicantFaculty;
    private String applicantMobile;

    // Society
    private String societyName;
    private String aims;
    private String agmDate; // Frontend sends string usually
    private String bankAccount;
    private String bankName;

    // Senior Treasurer
    private String seniorTreasurerTitle;
    private String seniorTreasurerFullName;
    private String seniorTreasurerDesignation;
    private String seniorTreasurerDepartment;
    private String seniorTreasurerEmail;
    private String seniorTreasurerAddress;
    private String seniorTreasurerMobile;

    // Officials
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

    private String juniorTreasurerRegNo;
    private String juniorTreasurerName;
    private String juniorTreasurerAddress;
    private String juniorTreasurerEmail;
    private String juniorTreasurerMobile;

    private String editorRegNo;
    private String editorName;
    private String editorAddress;
    private String editorEmail;
    private String editorMobile;

    // Lists
    private List<AdvisoryBoardMemberDto> advisoryBoard;
    private List<CommitteeMemberDto> committeeMember;
    private List<MemberDto> member; // General Members
    private List<PlanningEventDto> planningEvents;

    // Static Inner Classes for Lists
    @Data
    public static class AdvisoryBoardMemberDto {
        private String name;
        private String designation;
        private String department;
    }

    @Data
    public static class CommitteeMemberDto {
        private String regNo;
        private String name;
    }

    @Data
    public static class MemberDto {
        private String regNo;
        private String name;
    }

    @Data
    public static class PlanningEventDto {
        private String month;
        private String activity;
    }
}
