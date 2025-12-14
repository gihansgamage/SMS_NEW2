package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.dto.ApprovalDto;
import lk.ac.pdn.sms.entity.*;
import lk.ac.pdn.sms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApprovalService {

    private final SocietyRegistrationRepository registrationRepository;
    private final SocietyRenewalRepository renewalRepository;
    private final EventPermissionRepository eventPermissionRepository;
    private final SocietyRepository societyRepository;
    private final EmailService emailService;
    private final ActivityLogService activityLogService;

    public ApprovalService(SocietyRegistrationRepository registrationRepository,
                           SocietyRenewalRepository renewalRepository,
                           EventPermissionRepository eventPermissionRepository,
                           SocietyRepository societyRepository,
                           EmailService emailService,
                           ActivityLogService activityLogService) {
        this.registrationRepository = registrationRepository;
        this.renewalRepository = renewalRepository;
        this.eventPermissionRepository = eventPermissionRepository;
        this.societyRepository = societyRepository;
        this.emailService = emailService;
        this.activityLogService = activityLogService;
    }

    // --- Added Method to Fix Controller Error ---
    public List<ApprovalDto> getPendingItemsForAdmin(AdminUser admin) {
        List<ApprovalDto> pendingItems = new ArrayList<>();

        if (admin.getRole() == null) return pendingItems;

        switch (admin.getRole()) {
            case DEAN:
                if (admin.getFaculty() != null) {
                    pendingItems.addAll(getDeanPendingApprovals(admin.getFaculty()));
                }
                break;
            case ASSISTANT_REGISTRAR:
                pendingItems.addAll(getARPendingApprovals());
                break;
            case VICE_CHANCELLOR:
                pendingItems.addAll(getVCPendingApprovals());
                break;
            case PREMISES_OFFICER:
                // Premises Officer only sees Event Permissions pending their approval
                List<EventPermission> events = eventPermissionRepository.findByStatus(EventPermission.EventStatus.PENDING_PREMISES);
                pendingItems.addAll(events.stream().map(this::mapToDto).collect(Collectors.toList()));
                break;
            case STUDENT_SERVICE:
                // Usually read-only/monitoring
                break;
        }
        return pendingItems;
    }

    public List<ApprovalDto> getDeanPendingApprovals(String faculty) {
        List<ApprovalDto> dtos = new ArrayList<>();
        List<SocietyRegistration> registrations = registrationRepository.findByStatusAndApplicantFaculty(
                SocietyRegistration.ApprovalStage.PENDING_DEAN, faculty);
        dtos.addAll(registrations.stream().map(this::mapToDto).collect(Collectors.toList()));

        List<SocietyRenewal> renewals = renewalRepository.findByStatusAndApplicantFaculty(
                SocietyRenewal.RenewalStatus.PENDING_DEAN, faculty);
        dtos.addAll(renewals.stream().map(this::mapToDto).collect(Collectors.toList()));

        List<EventPermission> events = eventPermissionRepository.findByStatusAndApplicantFaculty(
                EventPermission.EventStatus.PENDING_DEAN, faculty);
        dtos.addAll(events.stream().map(this::mapToDto).collect(Collectors.toList()));

        return dtos;
    }

    public List<ApprovalDto> getARPendingApprovals() {
        List<ApprovalDto> dtos = new ArrayList<>();
        dtos.addAll(registrationRepository.findByStatus(SocietyRegistration.ApprovalStage.PENDING_AR)
                .stream().map(this::mapToDto).collect(Collectors.toList()));
        dtos.addAll(renewalRepository.findByStatus(SocietyRenewal.RenewalStatus.PENDING_AR)
                .stream().map(this::mapToDto).collect(Collectors.toList()));
        dtos.addAll(eventPermissionRepository.findByStatus(EventPermission.EventStatus.PENDING_AR)
                .stream().map(this::mapToDto).collect(Collectors.toList()));
        return dtos;
    }

    public List<ApprovalDto> getVCPendingApprovals() {
        List<ApprovalDto> dtos = new ArrayList<>();
        dtos.addAll(registrationRepository.findByStatus(SocietyRegistration.ApprovalStage.PENDING_VC)
                .stream().map(this::mapToDto).collect(Collectors.toList()));
        dtos.addAll(renewalRepository.findByStatus(SocietyRenewal.RenewalStatus.PENDING_VC)
                .stream().map(this::mapToDto).collect(Collectors.toList()));
        dtos.addAll(eventPermissionRepository.findByStatus(EventPermission.EventStatus.PENDING_VC)
                .stream().map(this::mapToDto).collect(Collectors.toList()));
        return dtos;
    }

    public List<ApprovalDto> getMonitoringApplications() {
        List<ApprovalDto> dtos = new ArrayList<>();
        dtos.addAll(registrationRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList()));
        dtos.addAll(renewalRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList()));
        dtos.addAll(eventPermissionRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList()));
        return dtos;
    }

    @Transactional
    public void processRegistrationApproval(Long id, ApprovalDto dto) {
        SocietyRegistration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        String adminRole = dto.getApproverRole() != null ? dto.getApproverRole() : "Admin";

        if (dto.getStatus() != null && dto.getStatus().contains("REJECTED")) {
            reg.setStatus(SocietyRegistration.ApprovalStage.REJECTED);
            reg.setRejectionReason(dto.getComment());
            emailService.sendRegistrationStatusUpdate(reg, "REJECTED", adminRole, dto.getComment());
            activityLogService.logAction("REJECT_REGISTRATION", reg.getSocietyName(), null, adminRole, null);
        } else {
            switch (reg.getStatus()) {
                case PENDING_DEAN:
                    reg.setIsDeanApproved(true);
                    reg.setDeanApprovalDate(LocalDateTime.now());
                    reg.setDeanComment(dto.getComment());
                    reg.setStatus(SocietyRegistration.ApprovalStage.PENDING_AR);
                    emailService.sendRegistrationStatusUpdate(reg, "APPROVED BY DEAN", "Dean", dto.getComment());
                    emailService.notifyAssistantRegistrarForApproval(reg);
                    activityLogService.logAction("APPROVE_REGISTRATION_DEAN", reg.getSocietyName(), null, "Dean", null);
                    break;
                case PENDING_AR:
                    reg.setIsArApproved(true);
                    reg.setArApprovalDate(LocalDateTime.now());
                    reg.setArComment(dto.getComment());
                    reg.setStatus(SocietyRegistration.ApprovalStage.PENDING_VC);
                    emailService.sendRegistrationStatusUpdate(reg, "APPROVED BY ASSISTANT REGISTRAR", "Assistant Registrar", dto.getComment());
                    emailService.notifyViceChancellorForApproval(reg);
                    activityLogService.logAction("APPROVE_REGISTRATION_AR", reg.getSocietyName(), null, "Assistant Registrar", null);
                    break;
                case PENDING_VC:
                    reg.setIsVcApproved(true);
                    reg.setVcApprovalDate(LocalDateTime.now());
                    reg.setVcComment(dto.getComment());
                    reg.setStatus(SocietyRegistration.ApprovalStage.APPROVED);
                    reg.setApprovedDate(LocalDateTime.now());
                    createSocietyFromRegistration(reg);
                    emailService.sendRegistrationStatusUpdate(reg, "FULLY APPROVED - Society Registered", "Vice Chancellor", dto.getComment());
                    activityLogService.logAction("APPROVE_REGISTRATION_VC", reg.getSocietyName(), null, "Vice Chancellor", null);
                    break;
                default:
                    break;
            }
        }
        registrationRepository.save(reg);
    }

    @Transactional
    public void processRenewalApproval(Long id, ApprovalDto dto) {
        SocietyRenewal renewal = renewalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Renewal not found"));

        String adminRole = dto.getApproverRole() != null ? dto.getApproverRole() : "Admin";

        if (dto.getStatus() != null && dto.getStatus().contains("REJECTED")) {
            renewal.setStatus(SocietyRenewal.RenewalStatus.REJECTED);
            renewal.setRejectionReason(dto.getComment());
            emailService.sendRenewalRejectionNotification(renewal);
            activityLogService.logAction("REJECT_RENEWAL", renewal.getSocietyName(), null, adminRole, null);
        } else {
            switch (renewal.getStatus()) {
                case PENDING_DEAN:
                    renewal.setIsDeanApproved(true);
                    renewal.setDeanApprovalDate(LocalDateTime.now());
                    renewal.setDeanComment(dto.getComment());
                    renewal.setStatus(SocietyRenewal.RenewalStatus.PENDING_AR);
                    emailService.sendRenewalStatusUpdate(renewal, "APPROVED BY DEAN", "Dean");
                    emailService.notifyAssistantRegistrarForRenewalApproval(renewal);
                    activityLogService.logAction("APPROVE_RENEWAL_DEAN", renewal.getSocietyName(), null, "Dean", null);
                    break;
                case PENDING_AR:
                    renewal.setIsArApproved(true);
                    renewal.setArApprovalDate(LocalDateTime.now());
                    renewal.setArComment(dto.getComment());
                    renewal.setStatus(SocietyRenewal.RenewalStatus.PENDING_VC);
                    emailService.sendRenewalStatusUpdate(renewal, "APPROVED BY ASSISTANT REGISTRAR", "Assistant Registrar");
                    emailService.notifyViceChancellorForRenewalApproval(renewal);
                    activityLogService.logAction("APPROVE_RENEWAL_AR", renewal.getSocietyName(), null, "Assistant Registrar", null);
                    break;
                case PENDING_VC:
                    renewal.setIsVcApproved(true);
                    renewal.setVcApprovalDate(LocalDateTime.now());
                    renewal.setVcComment(dto.getComment());
                    renewal.setStatus(SocietyRenewal.RenewalStatus.APPROVED);
                    renewal.setApprovedDate(LocalDateTime.now());
                    updateSocietyFromRenewal(renewal);
                    emailService.sendRenewalApprovalNotification(renewal);
                    activityLogService.logAction("APPROVE_RENEWAL_VC", renewal.getSocietyName(), null, "Vice Chancellor", null);
                    break;
                default:
                    break;
            }
        }
        renewalRepository.save(renewal);
    }

    @Transactional
    public void processEventPermissionApproval(Long id, ApprovalDto dto) {
        EventPermission event = eventPermissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event request not found"));

        String adminRole = dto.getApproverRole() != null ? dto.getApproverRole() : "Admin";

        if (dto.getStatus() != null && dto.getStatus().contains("REJECTED")) {
            event.setStatus(EventPermission.EventStatus.REJECTED);
            event.setRejectionReason(dto.getComment());
            emailService.sendEventRejectionNotification(event);
            activityLogService.logAction("REJECT_EVENT", event.getEventName(), null, adminRole, null);
        } else {
            switch (event.getStatus()) {
                case PENDING_DEAN:
                    event.setIsDeanApproved(true);
                    event.setDeanApprovalDate(LocalDateTime.now());
                    event.setDeanComment(dto.getComment());
                    event.setStatus(EventPermission.EventStatus.PENDING_PREMISES);
                    emailService.sendEventStatusUpdate(event, "APPROVED BY DEAN", "Dean");
                    emailService.notifyPremisesOfficerForApproval(event);
                    activityLogService.logAction("APPROVE_EVENT_DEAN", event.getEventName(), null, "Dean", null);
                    break;
                case PENDING_PREMISES:
                    event.setIsPremisesApproved(true);
                    event.setPremisesApprovalDate(LocalDateTime.now());
                    event.setPremisesComment(dto.getComment());
                    event.setStatus(EventPermission.EventStatus.PENDING_AR);
                    emailService.sendEventStatusUpdate(event, "APPROVED BY PREMISES OFFICER", "Premises Officer");
                    emailService.notifyAssistantRegistrarForEventApproval(event);
                    activityLogService.logAction("APPROVE_EVENT_PREMISES", event.getEventName(), null, "Premises Officer", null);
                    break;
                case PENDING_AR:
                    event.setIsArApproved(true);
                    event.setArApprovalDate(LocalDateTime.now());
                    event.setArComment(dto.getComment());
                    event.setStatus(EventPermission.EventStatus.PENDING_VC);
                    emailService.sendEventStatusUpdate(event, "APPROVED BY ASSISTANT REGISTRAR", "Assistant Registrar");
                    emailService.notifyViceChancellorForEventApproval(event);
                    activityLogService.logAction("APPROVE_EVENT_AR", event.getEventName(), null, "Assistant Registrar", null);
                    break;
                case PENDING_VC:
                    event.setIsVcApproved(true);
                    event.setVcApprovalDate(LocalDateTime.now());
                    event.setVcComment(dto.getComment());
                    event.setStatus(EventPermission.EventStatus.APPROVED);
                    event.setApprovedDate(LocalDateTime.now());
                    emailService.sendEventStatusUpdate(event, "FULLY APPROVED - Event Approved", "Vice Chancellor");
                    activityLogService.logAction("APPROVE_EVENT_VC", event.getEventName(), null, "Vice Chancellor", null);
                    break;
                default:
                    break;
            }
        }
        eventPermissionRepository.save(event);
    }

    private void createSocietyFromRegistration(SocietyRegistration reg) {
        if (societyRepository.findBySocietyName(reg.getSocietyName()).isPresent()) {
            return;
        }
        Society society = new Society();
        society.setSocietyName(reg.getSocietyName());
        society.setFaculty(reg.getApplicantFaculty());
        society.setStatus(Society.SocietyStatus.ACTIVE);
        society.setRegisteredDate(LocalDate.now());
        society.setYear(reg.getYear() != null ? reg.getYear() : LocalDate.now().getYear());
        society.setAims(reg.getAims());
        society.setAgmDate(reg.getAgmDate());
        society.setBankAccount(reg.getBankAccount());
        society.setBankName(reg.getBankName());

        society.setPresidentName(reg.getPresidentName());
        society.setPresidentRegNo(reg.getPresidentRegNo());
        society.setPresidentEmail(reg.getPresidentEmail());
        society.setPresidentMobile(reg.getPresidentMobile());

        society.setVicePresidentName(reg.getVicePresidentName());
        society.setVicePresidentRegNo(reg.getVicePresidentRegNo());
        society.setVicePresidentEmail(reg.getVicePresidentEmail());
        society.setVicePresidentMobile(reg.getVicePresidentMobile());

        society.setSecretaryName(reg.getSecretaryName());
        society.setSecretaryRegNo(reg.getSecretaryRegNo());
        society.setSecretaryEmail(reg.getSecretaryEmail());
        society.setSecretaryMobile(reg.getSecretaryMobile());

        society.setJointSecretaryName(reg.getJointSecretaryName());
        society.setJointSecretaryRegNo(reg.getJointSecretaryRegNo());
        society.setJointSecretaryEmail(reg.getJointSecretaryEmail());
        society.setJointSecretaryMobile(reg.getJointSecretaryMobile());

        society.setTreasurerName(reg.getJuniorTreasurerName());
        society.setTreasurerRegNo(reg.getJuniorTreasurerRegNo());
        society.setTreasurerEmail(reg.getJuniorTreasurerEmail());
        society.setTreasurerMobile(reg.getJuniorTreasurerMobile());

        society.setEditorName(reg.getEditorName());
        society.setEditorRegNo(reg.getEditorRegNo());
        society.setEditorEmail(reg.getEditorEmail());
        society.setEditorMobile(reg.getEditorMobile());

        society.setSeniorTreasurerName(reg.getSeniorTreasurerFullName());
        society.setSeniorTreasurerEmail(reg.getSeniorTreasurerEmail());

        societyRepository.save(society);
    }

    private void updateSocietyFromRenewal(SocietyRenewal renewal) {
        societyRepository.findBySocietyName(renewal.getSocietyName())
            .ifPresent(society -> {
                society.setStatus(Society.SocietyStatus.ACTIVE);
                society.setYear(renewal.getRenewalYear());
                society.setAgmDate(renewal.getAgmDate());
                society.setWebsite(renewal.getWebsite());
                society.setBankAccount(renewal.getBankAccount());
                society.setBankName(renewal.getBankName());

                if (renewal.getPresidentName() != null) {
                    society.setPresidentName(renewal.getPresidentName());
                    society.setPresidentRegNo(renewal.getPresidentRegNo());
                    society.setPresidentEmail(renewal.getPresidentEmail());
                    society.setPresidentMobile(renewal.getPresidentMobile());
                }

                if (renewal.getSecretaryName() != null) {
                    society.setSecretaryName(renewal.getSecretaryName());
                    society.setSecretaryRegNo(renewal.getSecretaryRegNo());
                    society.setSecretaryEmail(renewal.getSecretaryEmail());
                    society.setSecretaryMobile(renewal.getSecretaryMobile());
                }

                if (renewal.getSeniorTreasurerFullName() != null) {
                    society.setSeniorTreasurerName(renewal.getSeniorTreasurerFullName());
                    society.setSeniorTreasurerEmail(renewal.getSeniorTreasurerEmail());
                }

                societyRepository.save(society);
            });
    }

    private ApprovalDto mapToDto(SocietyRegistration reg) {
        return ApprovalDto.builder()
                .id(reg.getId())
                .type("registration")
                .societyName(reg.getSocietyName())
                .applicantName(reg.getApplicantFullName())
                .faculty(reg.getApplicantFaculty())
                .submittedDate(reg.getSubmittedDate())
                .status(reg.getStatus().name())
                .build();
    }

    private ApprovalDto mapToDto(SocietyRenewal ren) {
        return ApprovalDto.builder()
                .id(ren.getId())
                .type("renewal")
                .societyName(ren.getSocietyName())
                .applicantName(ren.getApplicantFullName())
                .faculty(ren.getApplicantFaculty())
                .submittedDate(ren.getSubmittedDate())
                .status(ren.getStatus().name())
                .build();
    }

    private ApprovalDto mapToDto(EventPermission evt) {
        return ApprovalDto.builder()
                .id(evt.getId())
                .type("event")
                .societyName(evt.getSocietyName())
                .eventName(evt.getEventName())
                .applicantName(evt.getApplicantName())
                .submittedDate(evt.getSubmittedDate())
                .status(evt.getStatus().name())
                .build();
    }
}