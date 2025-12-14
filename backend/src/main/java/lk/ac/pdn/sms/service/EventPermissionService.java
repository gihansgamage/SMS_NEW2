package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.dto.EventPermissionDto;
import lk.ac.pdn.sms.dto.ApprovalDto;
import lk.ac.pdn.sms.entity.EventPermission;
import lk.ac.pdn.sms.entity.AdminUser;
import lk.ac.pdn.sms.entity.Society;
import lk.ac.pdn.sms.repository.EventPermissionRepository;
import lk.ac.pdn.sms.repository.SocietyRepository;
import lk.ac.pdn.sms.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventPermissionService {

    @Autowired
    private EventPermissionRepository eventRepository;

    @Autowired
    private SocietyRepository societyRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private PDFService pdfService;

    // --- 1. Fixed Method Name (was submitRequest) ---
    public EventPermission createEventRequest(EventPermissionDto dto) {
        Society society = societyRepository.findBySocietyName(dto.getSocietyName())
                .orElseThrow(() -> new RuntimeException("Society not found: " + dto.getSocietyName()));

        EventPermission event = new EventPermission();

        event.setApplicantName(dto.getApplicantName());
        event.setApplicantRegNo(dto.getApplicantRegNo());
        event.setApplicantEmail(dto.getApplicantEmail());
        event.setApplicantMobile(dto.getApplicantMobile());
        event.setApplicantPosition(dto.getApplicantPosition());

        event.setApplicantFaculty(society.getFaculty());

        event.setSocietyName(dto.getSocietyName());
        event.setEventName(dto.getEventName());
        event.setPlace(dto.getPlace());

        if (dto.getEventDate() != null) {
            event.setEventDate(LocalDate.parse(dto.getEventDate()));
        }
        if (dto.getTimeFrom() != null) event.setTimeFrom(LocalTime.parse(dto.getTimeFrom()));
        if (dto.getTimeTo() != null) event.setTimeTo(LocalTime.parse(dto.getTimeTo()));
        if (dto.getPaymentDate() != null && !dto.getPaymentDate().isEmpty()) {
            event.setPaymentDate(LocalDate.parse(dto.getPaymentDate()));
        }

        event.setIsInsideUniversity(dto.getIsInsideUniversity());
        event.setLatePassRequired(dto.getLatePassRequired());
        event.setOutsidersInvited(dto.getOutsidersInvited());
        event.setOutsidersList(dto.getOutsidersList());
        event.setFirstYearParticipation(dto.getFirstYearParticipation());

        event.setBudgetEstimate(dto.getBudgetEstimate());
        event.setFundCollectionMethods(dto.getFundCollectionMethods());
        event.setStudentFeeAmount(dto.getStudentFeeAmount());
        event.setReceiptNumber(dto.getReceiptNumber());

        event.setSeniorTreasurerName(dto.getSeniorTreasurerName());
        event.setSeniorTreasurerDepartment(dto.getSeniorTreasurerDepartment());
        event.setSeniorTreasurerMobile(dto.getSeniorTreasurerMobile());

        event.setPremisesOfficerName(dto.getPremisesOfficerName());
        event.setPremisesOfficerDesignation(dto.getPremisesOfficerDesignation());
        event.setPremisesOfficerDivision(dto.getPremisesOfficerDivision());

        event.setStatus(EventPermission.EventStatus.PENDING_DEAN);

        event = eventRepository.save(event);

        emailService.sendEventPermissionConfirmation(event);
        emailService.notifyDeanForEventApproval(event);
        activityLogService.logActivity("Event Permission Requested", event.getEventName(), event.getApplicantName());

        return event;
    }

    // --- 2. Added Missing Method: getEventById ---
    public EventPermission getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    // --- 3. Added Missing Method: getAllEvents (Filtered) ---
    public List<EventPermission> getAllEvents(String status) {
        if (status == null || status.equalsIgnoreCase("all") || status.isEmpty()) {
            return eventRepository.findAll();
        }
        try {
            EventPermission.EventStatus eventStatus = EventPermission.EventStatus.valueOf(status.toUpperCase());
            return eventRepository.findByStatus(eventStatus);
        } catch (IllegalArgumentException e) {
            // If invalid status, return empty list or all (returning empty for safety)
            return List.of();
        }
    }

    // --- 4. Added Missing Method: getPendingEvents (General) ---
    public List<EventPermission> getPendingEvents() {
        return eventRepository.findAll().stream()
                .filter(e -> e.getStatus().name().startsWith("PENDING"))
                .collect(Collectors.toList());
    }

    // --- 5. Fixed Method Name (was validateApplicantPosition) ---
    public boolean validateApplicant(String societyName, String position, String regNo, String email) {
        Society society = societyRepository.findBySocietyName(societyName)
                .orElseThrow(() -> new RuntimeException("Society not found"));

        String normalizedRegNo = normalizeRegistrationNumber(regNo);

        String officialRegNo = "";
        String officialEmail = "";

        switch (position.toLowerCase()) {
            case "president":
                officialRegNo = society.getPresidentRegNo();
                officialEmail = society.getPresidentEmail();
                break;
            case "vice president":
            case "vice-president":
                officialRegNo = society.getVicePresidentRegNo();
                officialEmail = society.getVicePresidentEmail();
                break;
            case "secretary":
                officialRegNo = society.getSecretaryRegNo();
                officialEmail = society.getSecretaryEmail();
                break;
            case "joint secretary":
            case "joint-secretary":
                officialRegNo = society.getJointSecretaryRegNo();
                officialEmail = society.getJointSecretaryEmail();
                break;
            case "junior treasurer":
            case "junior-treasurer":
            case "treasurer":
                officialRegNo = society.getTreasurerRegNo();
                officialEmail = society.getTreasurerEmail();
                break;
            case "editor":
                officialRegNo = society.getEditorRegNo();
                officialEmail = society.getEditorEmail();
                break;
            default:
                return false;
        }

        return normalizeRegistrationNumber(officialRegNo).equals(normalizedRegNo) &&
                officialEmail.equalsIgnoreCase(email);
    }

    // --- Existing Helper Methods ---

    public EventPermission approveRequest(Long id, ApprovalDto dto, String userEmail) {
        EventPermission event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event request not found"));

        AdminUser admin = adminUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        switch (admin.getRole()) {
            case DEAN:
                if (event.getStatus() == EventPermission.EventStatus.PENDING_DEAN) {
                    event.setIsDeanApproved(true);
                    event.setDeanApprovalDate(LocalDateTime.now());
                    event.setStatus(EventPermission.EventStatus.PENDING_PREMISES);
                    emailService.sendEventStatusUpdate(event, "APPROVED_BY_DEAN", "Faculty Dean");
                    emailService.notifyPremisesOfficerForApproval(event);
                }
                break;

            case PREMISES_OFFICER:
                if (event.getStatus() == EventPermission.EventStatus.PENDING_PREMISES) {
                    event.setIsPremisesApproved(true);
                    event.setPremisesApprovalDate(LocalDateTime.now());
                    event.setStatus(EventPermission.EventStatus.PENDING_AR);
                    emailService.sendEventStatusUpdate(event, "VENUE_APPROVED", "Premises Officer");
                    emailService.notifyAssistantRegistrarForEventApproval(event);
                }
                break;

            case ASSISTANT_REGISTRAR:
                if (event.getStatus() == EventPermission.EventStatus.PENDING_AR) {
                    event.setIsArApproved(true);
                    event.setArApprovalDate(LocalDateTime.now());
                    event.setStatus(EventPermission.EventStatus.PENDING_VC);
                    emailService.sendEventStatusUpdate(event, "APPROVED_BY_AR", "Assistant Registrar");
                    emailService.notifyViceChancellorForEventApproval(event);
                }
                break;

            case VICE_CHANCELLOR:
                if (event.getStatus() == EventPermission.EventStatus.PENDING_VC) {
                    event.setIsVcApproved(true);
                    event.setVcApprovalDate(LocalDateTime.now());
                    event.setStatus(EventPermission.EventStatus.APPROVED);
                    event.setApprovedDate(LocalDateTime.now());
                    emailService.sendEventStatusUpdate(event, "FULLY_APPROVED", "Vice Chancellor");
                }
                break;

            default:
                throw new RuntimeException("Unauthorized approval attempt");
        }

        event = eventRepository.save(event);
        activityLogService.logActivity("Event Approved", event.getEventName(), admin.getName());
        return event;
    }

    public EventPermission rejectRequest(Long id, ApprovalDto dto, String userEmail) {
        EventPermission event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event request not found"));

        AdminUser admin = adminUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        event.setStatus(EventPermission.EventStatus.REJECTED);
        event.setRejectionReason(dto.getReason());

        event = eventRepository.save(event);

        emailService.sendEventRejectionNotification(event);
        activityLogService.logActivity("Event Rejected", event.getEventName(), admin.getName());
        return event;
    }

    public List<EventPermission> getPendingRequests(String faculty, String userEmail) {
        AdminUser admin = adminUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        switch (admin.getRole()) {
            case DEAN:
                return eventRepository.findByStatusAndApplicantFaculty(EventPermission.EventStatus.PENDING_DEAN, admin.getFaculty());
            case PREMISES_OFFICER:
                return eventRepository.findByStatus(EventPermission.EventStatus.PENDING_PREMISES);
            case ASSISTANT_REGISTRAR:
                return eventRepository.findByStatus(EventPermission.EventStatus.PENDING_AR);
            case VICE_CHANCELLOR:
                return eventRepository.findByStatus(EventPermission.EventStatus.PENDING_VC);
            default:
                return List.of();
        }
    }

    public Page<EventPermission> getAllRequests(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }

    public byte[] generateEventPDF(Long id) {
        try {
            EventPermission event = eventRepository.findById(id).orElseThrow();
            return pdfService.generateEventPermissionPDF(event);
        } catch (Exception e) {
            throw new RuntimeException("PDF Generation Failed");
        }
    }

    public byte[] generatePreviewPDF(EventPermissionDto dto) {
        try {
            EventPermission temp = new EventPermission();
            temp.setEventName(dto.getEventName());
            temp.setSocietyName(dto.getSocietyName());
            temp.setApplicantName(dto.getApplicantName());
            temp.setPlace(dto.getPlace());
            if(dto.getEventDate() != null) temp.setEventDate(LocalDate.parse(dto.getEventDate()));
            if(dto.getTimeFrom() != null) temp.setTimeFrom(LocalTime.parse(dto.getTimeFrom()));
            if(dto.getTimeTo() != null) temp.setTimeTo(LocalTime.parse(dto.getTimeTo()));

            return pdfService.generateEventPermissionPDF(temp);
        } catch (Exception e) {
            throw new RuntimeException("Preview Generation Failed");
        }
    }

    private String normalizeRegistrationNumber(String regNo) {
        if (regNo == null) return "";
        return regNo.toUpperCase().replaceAll("[\\s/]", "");
    }

    public List<EventPermission> getUpcomingEvents(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<EventPermission> page = eventRepository.findUpcomingApprovedEvents(LocalDate.now(), pageable);
        return page.getContent();
    }
}