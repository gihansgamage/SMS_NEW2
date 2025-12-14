package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.entity.SocietyRegistration;
import lk.ac.pdn.sms.entity.SocietyRenewal;
import lk.ac.pdn.sms.entity.EventPermission;
import lk.ac.pdn.sms.entity.AdminUser;
import lk.ac.pdn.sms.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AdminUserRepository adminUserRepository;

    private static final String EMAIL_SIGNATURE = "\n\nBest regards,\nStudent Service Division\nUniversity of Peradeniya";

    @Async
    public void sendRegistrationConfirmation(SocietyRegistration registration) {
        sendEmail(
                registration.getApplicantEmail(),
                "Society Registration Application Received",
                String.format(
                        "Dear %s,\n\n" +
                                "We have received your application for the registration of '%s'.\n" +
                                "Your application ID is: %d\n\n" +
                                "The application is now pending approval from the Faculty Dean.\n" +
                                EMAIL_SIGNATURE,
                        registration.getApplicantFullName(),
                        registration.getSocietyName(),
                        registration.getId()
                )
        );

        if (registration.getSeniorTreasurerEmail() != null) {
            sendEmail(
                    registration.getSeniorTreasurerEmail(),
                    "Nomination as Senior Treasurer - " + registration.getSocietyName(),
                    String.format(
                            "Dear %s,\n\n" +
                                    "You have been nominated as the Senior Treasurer for the society '%s'.\n" +
                                    "The registration application has been submitted and is currently pending approval from the Faculty Dean.\n" +
                                    EMAIL_SIGNATURE,
                            registration.getSeniorTreasurerFullName(),
                            registration.getSocietyName()
                    )
            );
        }
    }

    @Async
    public void notifyDeanForApproval(SocietyRegistration registration) {
        List<AdminUser> deans = adminUserRepository.findByRoleAndFaculty(
                AdminUser.Role.DEAN, registration.getApplicantFaculty());

        for (AdminUser dean : deans) {
            sendEmail(
                    dean.getEmail(),
                    "Action Required: New Society Registration Application",
                    String.format(
                            "Dear %s,\n\n" +
                                    "A new society registration application requires your review.\n\n" +
                                    "Society: %s\n" +
                                    "Applicant: %s\n" +
                                    "Faculty: %s\n\n" +
                                    "Please log in to the SMS Admin Panel to review and approve/reject this application.\n" +
                                    EMAIL_SIGNATURE,
                            dean.getName(),
                            registration.getSocietyName(),
                            registration.getApplicantFullName(),
                            registration.getApplicantFaculty()
                    )
            );
        }
    }

    @Async
    public void sendRegistrationStatusUpdate(SocietyRegistration registration, String status, String adminRole, String reason) {
        String subject = "Society Registration Status Update: " + status;
        String reasonText = (reason != null && !reason.isEmpty()) ? "\nReason: " + reason + "\n" : "";

        String body = String.format(
                "The society registration application for '%s' has been updated.\n\n" +
                        "New Status: %s\n" +
                        "Updated By: %s\n" +
                        "%s\n" +
                        "Please check the SMS portal for more details.\n" +
                        EMAIL_SIGNATURE,
                registration.getSocietyName(),
                status,
                adminRole,
                reasonText
        );

        sendEmail(registration.getApplicantEmail(), subject, "Dear " + registration.getApplicantFullName() + ",\n\n" + body);

        if (registration.getSeniorTreasurerEmail() != null) {
            sendEmail(registration.getSeniorTreasurerEmail(), subject, "Dear " + registration.getSeniorTreasurerTitle() + " " + registration.getSeniorTreasurerFullName() + ",\n\n" + body);
        }
    }

    @Async
    public void notifyAssistantRegistrarForApproval(SocietyRegistration registration) {
        List<AdminUser> ars = adminUserRepository.findByRole(AdminUser.Role.ASSISTANT_REGISTRAR);
        for (AdminUser ar : ars) {
            sendEmail(
                    ar.getEmail(),
                    "Action Required: Society Registration Pending AR Approval",
                    String.format(
                            "Dear %s,\n\n" +
                                    "The Faculty Dean has approved the registration for '%s'. It now requires your approval.\n\n" +
                                    EMAIL_SIGNATURE,
                            ar.getName(),
                            registration.getSocietyName()
                    )
            );
        }
    }

    @Async
    public void notifyViceChancellorForApproval(SocietyRegistration registration) {
        List<AdminUser> vcs = adminUserRepository.findByRole(AdminUser.Role.VICE_CHANCELLOR);
        for (AdminUser vc : vcs) {
            sendEmail(
                    vc.getEmail(),
                    "Action Required: Society Registration Pending VC Approval",
                    String.format(
                            "Dear %s,\n\n" +
                                    "The Assistant Registrar has approved the registration for '%s'. It now requires your final approval.\n\n" +
                                    EMAIL_SIGNATURE,
                            vc.getName(),
                            registration.getSocietyName()
                    )
            );
        }
    }

    @Async
    public void sendRenewalConfirmation(SocietyRenewal renewal) {
        sendEmail(renewal.getApplicantEmail(), "Society Renewal Application Received",
                "Dear " + renewal.getApplicantFullName() + ",\n\nWe have received your renewal application for '" + renewal.getSocietyName() + "'." + EMAIL_SIGNATURE);
    }

    @Async
    public void notifyDeanForRenewalApproval(SocietyRenewal renewal) {
        List<AdminUser> deans = adminUserRepository.findByRoleAndFaculty(
                AdminUser.Role.DEAN, renewal.getApplicantFaculty());
        for (AdminUser dean : deans) {
            sendEmail(dean.getEmail(), "Action Required: Society Renewal Application",
                    "Dear " + dean.getName() + ",\n\nA society renewal application for '" + renewal.getSocietyName() + "' requires your review." + EMAIL_SIGNATURE);
        }
    }

    @Async
    public void notifyAssistantRegistrarForRenewalApproval(SocietyRenewal renewal) {
        List<AdminUser> ars = adminUserRepository.findByRole(AdminUser.Role.ASSISTANT_REGISTRAR);
        for (AdminUser ar : ars) {
            sendEmail(ar.getEmail(), "Action Required: Society Renewal Pending AR Approval",
                    "Dear " + ar.getName() + ",\n\nThe Faculty Dean has approved the renewal for '" + renewal.getSocietyName() + "'. It now requires your approval." + EMAIL_SIGNATURE);
        }
    }

    @Async
    public void notifyViceChancellorForRenewalApproval(SocietyRenewal renewal) {
        List<AdminUser> vcs = adminUserRepository.findByRole(AdminUser.Role.VICE_CHANCELLOR);
        for (AdminUser vc : vcs) {
            sendEmail(vc.getEmail(), "Action Required: Society Renewal Pending VC Approval",
                    "Dear " + vc.getName() + ",\n\nThe Assistant Registrar has approved the renewal for '" + renewal.getSocietyName() + "'. It now requires your final approval." + EMAIL_SIGNATURE);
        }
    }

    @Async
    public void sendRenewalApprovalNotification(SocietyRenewal renewal) {
        sendEmail(renewal.getApplicantEmail(), "Congratulations! Society Renewal Approved",
                "Dear " + renewal.getApplicantFullName() + ",\n\nWe are pleased to inform you that the renewal application for '" + renewal.getSocietyName() + "' has been APPROVED by the Vice Chancellor.\n\nAcademic Year: " + renewal.getRenewalYear() + "\n\nYou may now continue your society activities." + EMAIL_SIGNATURE);
    }

    @Async
    public void sendRenewalRejectionNotification(SocietyRenewal renewal) {
        sendEmail(renewal.getApplicantEmail(), "Society Renewal Application Rejected",
                "Dear " + renewal.getApplicantFullName() + ",\n\nWe regret to inform you that your renewal application for '" + renewal.getSocietyName() + "' has been rejected.\n\nReason: " + renewal.getRejectionReason() + EMAIL_SIGNATURE);
    }

    @Async
    public void sendRenewalStatusUpdate(SocietyRenewal renewal, String status, String adminName) {
        sendEmail(renewal.getApplicantEmail(), "Society Renewal Status Update: " + status,
                "Dear " + renewal.getApplicantFullName() + ",\n\nYour society renewal application status has been updated to: " + status + " by " + adminName + "." + EMAIL_SIGNATURE);
    }

    @Async
    public void sendEventPermissionConfirmation(EventPermission event) {
        sendEmail(event.getApplicantEmail(), "Event Permission Request Received",
                String.format(
                        "Dear %s,\n\n" +
                                "We have received your permission request for the event '%s'.\n" +
                                "Date: %s\n" +
                                "Place: %s\n\n" +
                                "The request is now pending approval from the Faculty Dean.\n" +
                                EMAIL_SIGNATURE,
                        event.getApplicantName(), event.getEventName(), event.getEventDate(), event.getPlace())
        );
    }

    @Async
    public void notifyDeanForEventApproval(EventPermission event) {
        List<AdminUser> deans = adminUserRepository.findByRoleAndFaculty(
                AdminUser.Role.DEAN, event.getApplicantFaculty());

        for (AdminUser dean : deans) {
            sendEmail(dean.getEmail(), "Action Required: Event Permission Request",
                    String.format(
                            "Dear %s,\n\n" +
                                    "An event permission request requires your review.\n\n" +
                                    "Society: %s\nEvent: %s\nDate: %s\n\n" +
                                    "Please log in to the SMS Admin Panel to review.\n" +
                                    EMAIL_SIGNATURE,
                            dean.getName(), event.getSocietyName(), event.getEventName(), event.getEventDate())
            );
        }
    }

    @Async
    public void notifyPremisesOfficerForApproval(EventPermission event) {
        List<AdminUser> officers = adminUserRepository.findByRole(AdminUser.Role.PREMISES_OFFICER);

        for (AdminUser officer : officers) {
            sendEmail(officer.getEmail(), "Action Required: Event Venue Approval",
                    String.format(
                            "Dear %s,\n\n" +
                                    "The Faculty Dean has approved the event '%s'. It now requires your venue approval.\n\n" +
                                    "Place: %s\nDate: %s\nTime: %s - %s\n\n" +
                                    "Please log in to the SMS Admin Panel to review.\n" +
                                    EMAIL_SIGNATURE,
                            officer.getName(), event.getEventName(), event.getPlace(),
                            event.getEventDate(), event.getTimeFrom(), event.getTimeTo())
            );
        }
    }

    @Async
    public void notifyAssistantRegistrarForEventApproval(EventPermission event) {
        List<AdminUser> ars = adminUserRepository.findByRole(AdminUser.Role.ASSISTANT_REGISTRAR);

        for (AdminUser ar : ars) {
            sendEmail(ar.getEmail(), "Action Required: Event Permission Pending AR Approval",
                    String.format(
                            "Dear %s,\n\n" +
                                    "The Premises Officer has approved the venue for '%s'. It now requires your approval.\n" +
                                    EMAIL_SIGNATURE,
                            ar.getName(), event.getEventName())
            );
        }
    }

    @Async
    public void notifyViceChancellorForEventApproval(EventPermission event) {
        List<AdminUser> vcs = adminUserRepository.findByRole(AdminUser.Role.VICE_CHANCELLOR);

        for (AdminUser vc : vcs) {
            sendEmail(vc.getEmail(), "Action Required: Event Permission Pending VC Approval",
                    String.format(
                            "Dear %s,\n\n" +
                                    "The Assistant Registrar has approved the event '%s'. It now requires your final approval.\n" +
                                    EMAIL_SIGNATURE,
                            vc.getName(), event.getEventName())
            );
        }
    }

    @Async
    public void sendEventStatusUpdate(EventPermission event, String status, String adminRole) {
        sendEmail(event.getApplicantEmail(), "Event Permission Status Update: " + status,
                String.format(
                        "Dear %s,\n\n" +
                                "Your event permission request for '%s' has been updated.\n" +
                                "New Status: %s\n" +
                                "Updated By: %s\n\n" +
                                "Please check the portal for details.\n" +
                                EMAIL_SIGNATURE,
                        event.getApplicantName(), event.getEventName(), status, adminRole)
        );
    }

    @Async
    public void sendEventRejectionNotification(EventPermission event) {
        sendEmail(event.getApplicantEmail(), "Event Permission Request Rejected",
                String.format(
                        "Dear %s,\n\n" +
                                "We regret to inform you that permission for your event '%s' has been rejected.\n" +
                                "Reason: %s\n" +
                                EMAIL_SIGNATURE,
                        event.getApplicantName(), event.getEventName(), event.getRejectionReason())
        );
    }

    // CHANGED TO PUBLIC
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }
}