package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.dto.SocietyRenewalDto;
import lk.ac.pdn.sms.dto.ApprovalDto;
import lk.ac.pdn.sms.entity.*;
import lk.ac.pdn.sms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RenewalService {

    @Autowired
    private SocietyRenewalRepository renewalRepository;

    @Autowired
    private SocietyRegistrationRepository registrationRepository;

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

    public SocietyRenewal submitRenewal(SocietyRenewalDto dto) {
        Society existingSociety = societyRepository.findBySocietyName(dto.getSocietyName())
                .orElseThrow(() -> new RuntimeException("Society not found with name: " + dto.getSocietyName()));

        if (renewalRepository.existsBySocietyNameAndYear(dto.getSocietyName(), LocalDate.now().getYear())) {
            throw new RuntimeException("Renewal already submitted for this society in current year");
        }

        SocietyRenewal renewal = convertToEntity(dto);
        renewal.setYear(LocalDate.now().getYear());
        renewal.setStatus(SocietyRenewal.RenewalStatus.PENDING_DEAN);
        renewal.setSubmittedDate(LocalDateTime.now());

        renewal = renewalRepository.save(renewal);

        // Notifications
        emailService.sendRenewalConfirmation(renewal);
        emailService.notifyDeanForRenewalApproval(renewal);

        activityLogService.logActivity("Society Renewal Submitted", renewal.getSocietyName(), renewal.getApplicantFullName());

        return renewal;
    }

    // NEW: Fetch latest data for pre-filling the form
    public SocietyRenewalDto getLatestSocietyData(String societyName) {
        // 1. Try to find latest approved renewal
        Optional<SocietyRenewal> lastRenewal = renewalRepository.findTopBySocietyNameAndStatusOrderByApprovedDateDesc(
                societyName, SocietyRenewal.RenewalStatus.APPROVED);

        // 2. Try to find approved registration
        Optional<SocietyRegistration> registration = registrationRepository.findTopBySocietyNameAndStatusOrderByApprovedDateDesc(
                societyName, SocietyRegistration.ApprovalStage.APPROVED);

        if (lastRenewal.isPresent()) {
            // If registration is newer than renewal (rare, but possible if re-registered), use registration
            if (registration.isPresent() && registration.get().getApprovedDate().isAfter(lastRenewal.get().getApprovedDate())) {
                return mapRegistrationToRenewalDto(registration.get());
            }
            return mapRenewalToDto(lastRenewal.get());
        } else if (registration.isPresent()) {
            return mapRegistrationToRenewalDto(registration.get());
        }

        return new SocietyRenewalDto(); // Return empty if no history found
    }

    public List<SocietyRenewal> getPendingRenewals(String faculty, String status, String userEmail) {
        AdminUser admin = adminUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        if (admin.getRole() == AdminUser.Role.DEAN) {
            return renewalRepository.findByStatusAndApplicantFaculty(
                    SocietyRenewal.RenewalStatus.PENDING_DEAN, admin.getFaculty());
        }

        if (status != null && !status.isEmpty()) {
            SocietyRenewal.RenewalStatus renewalStatus = SocietyRenewal.RenewalStatus.valueOf(status.toUpperCase());
            return renewalRepository.findByStatus(renewalStatus);
        }

        return renewalRepository.findAll();
    }

    public Page<SocietyRenewal> getAllRenewals(Integer year, String status, Pageable pageable) {
        if (year != null) {
            return renewalRepository.findByYear(year, pageable);
        }
        return renewalRepository.findAll(pageable);
    }

    public SocietyRenewal getRenewalById(Long id) {
        return renewalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Renewal not found with id: " + id));
    }

    public SocietyRenewal approveRenewal(Long id, ApprovalDto approvalDto, String userEmail) {
        SocietyRenewal renewal = getRenewalById(id);
        AdminUser admin = adminUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        switch (admin.getRole()) {
            case DEAN:
                if (renewal.getStatus() == SocietyRenewal.RenewalStatus.PENDING_DEAN) {
                    renewal.setIsDeanApproved(true);
                    renewal.setStatus(SocietyRenewal.RenewalStatus.PENDING_AR);
                    emailService.sendRenewalStatusUpdate(renewal, "APPROVED_BY_DEAN", "Faculty Dean");
                    emailService.notifyAssistantRegistrarForRenewalApproval(renewal);
                }
                break;

            case ASSISTANT_REGISTRAR:
                if (renewal.getStatus() == SocietyRenewal.RenewalStatus.PENDING_AR) {
                    renewal.setIsArApproved(true);
                    renewal.setStatus(SocietyRenewal.RenewalStatus.PENDING_VC);
                    emailService.sendRenewalStatusUpdate(renewal, "APPROVED_BY_AR", "Assistant Registrar");
                    emailService.notifyViceChancellorForRenewalApproval(renewal);
                }
                break;

            case VICE_CHANCELLOR:
                if (renewal.getStatus() == SocietyRenewal.RenewalStatus.PENDING_VC) {
                    renewal.setIsVcApproved(true);
                    renewal.setStatus(SocietyRenewal.RenewalStatus.APPROVED);
                    renewal.setApprovedDate(LocalDateTime.now());
                    updateSocietyFromRenewal(renewal);
                    emailService.sendRenewalApprovalNotification(renewal);
                }
                break;
            default:
                throw new RuntimeException("Invalid role");
        }

        renewal = renewalRepository.save(renewal);
        activityLogService.logActivity("Renewal Approved", renewal.getSocietyName(), admin.getName());

        return renewal;
    }

    public SocietyRenewal rejectRenewal(Long id, ApprovalDto approvalDto, String userEmail) {
        SocietyRenewal renewal = getRenewalById(id);
        AdminUser admin = adminUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        renewal.setStatus(SocietyRenewal.RenewalStatus.REJECTED);
        renewal.setRejectionReason(approvalDto.getReason());
        renewal = renewalRepository.save(renewal);

        emailService.sendRenewalRejectionNotification(renewal);
        activityLogService.logActivity("Renewal Rejected", renewal.getSocietyName(), admin.getName());

        return renewal;
    }

    public byte[] generateRenewalPDF(Long id) {
        try {
            SocietyRenewal renewal = getRenewalById(id);
            return pdfService.generateRenewalPDF(renewal);
        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed");
        }
    }

    // NEW: Generate PDF Preview from DTO
    public byte[] generateRenewalPreviewPDF(SocietyRenewalDto dto) {
        // Mock implementation relying on PDFService capability
        try {
            SocietyRenewal temp = convertToEntity(dto);
            return pdfService.generateRenewalPDF(temp);
        } catch (Exception e) {
            throw new RuntimeException("PDF Preview failed");
        }
    }

    public Map<String, Object> getRenewalStatistics() {
        Map<String, Object> stats = new HashMap<>();
        int currentYear = LocalDate.now().getYear();

        stats.put("totalRenewals", renewalRepository.count());
        stats.put("currentYearRenewals", renewalRepository.countByYear(currentYear));
        stats.put("approvedRenewals", renewalRepository.countByStatus(SocietyRenewal.RenewalStatus.APPROVED));

        return stats;
    }

    // --- Mapping Helpers ---

    private SocietyRenewalDto mapRenewalToDto(SocietyRenewal entity) {
        SocietyRenewalDto dto = new SocietyRenewalDto();
        dto.setSocietyName(entity.getSocietyName());
        dto.setBankAccount(entity.getBankAccount());
        dto.setBankName(entity.getBankName());
        dto.setWebsite(entity.getWebsite());
        // Map other fields as needed...
        return dto;
    }

    private SocietyRenewalDto mapRegistrationToRenewalDto(SocietyRegistration entity) {
        SocietyRenewalDto dto = new SocietyRenewalDto();
        dto.setSocietyName(entity.getSocietyName());
        dto.setBankAccount(entity.getBankAccount());
        dto.setBankName(entity.getBankName());
        dto.setApplicantFullName(entity.getApplicantFullName());
        dto.setApplicantEmail(entity.getApplicantEmail());
        dto.setApplicantFaculty(entity.getApplicantFaculty());
        dto.setApplicantMobile(entity.getApplicantMobile());
        dto.setApplicantRegNo(entity.getApplicantRegNo());

        dto.setSeniorTreasurerTitle(entity.getSeniorTreasurerTitle());
        dto.setSeniorTreasurerFullName(entity.getSeniorTreasurerFullName());
        dto.setSeniorTreasurerEmail(entity.getSeniorTreasurerEmail());
        dto.setSeniorTreasurerMobile(entity.getSeniorTreasurerMobile());
        dto.setSeniorTreasurerDesignation(entity.getSeniorTreasurerDesignation());
        dto.setSeniorTreasurerDepartment(entity.getSeniorTreasurerDepartment());
        dto.setSeniorTreasurerAddress(entity.getSeniorTreasurerAddress());

        dto.setPresidentName(entity.getPresidentName());
        dto.setPresidentEmail(entity.getPresidentEmail());
        dto.setPresidentMobile(entity.getPresidentMobile());
        dto.setPresidentRegNo(entity.getPresidentRegNo());
        dto.setPresidentAddress(entity.getPresidentAddress());

        dto.setSecretaryName(entity.getSecretaryName());
        dto.setSecretaryEmail(entity.getSecretaryEmail());
        dto.setSecretaryMobile(entity.getSecretaryMobile());
        dto.setSecretaryRegNo(entity.getSecretaryRegNo());
        dto.setSecretaryAddress(entity.getSecretaryAddress());

        // ... map remaining officials ...
        return dto;
    }

    private SocietyRenewal convertToEntity(SocietyRenewalDto dto) {
        SocietyRenewal renewal = new SocietyRenewal();
        renewal.setApplicantFullName(dto.getApplicantFullName());
        renewal.setApplicantRegNo(dto.getApplicantRegNo());
        renewal.setApplicantEmail(dto.getApplicantEmail());
        renewal.setApplicantFaculty(dto.getApplicantFaculty());
        renewal.setApplicantMobile(dto.getApplicantMobile());
        renewal.setSocietyName(dto.getSocietyName());
        renewal.setBankAccount(dto.getBankAccount());
        renewal.setBankName(dto.getBankName());

        renewal.setAgmDate(dto.getAgmDate());
        renewal.setDifficulties(dto.getDifficulties());
        renewal.setWebsite(dto.getWebsite());

        renewal.setSeniorTreasurerTitle(dto.getSeniorTreasurerTitle());
        renewal.setSeniorTreasurerFullName(dto.getSeniorTreasurerFullName());
        renewal.setSeniorTreasurerDesignation(dto.getSeniorTreasurerDesignation());
        renewal.setSeniorTreasurerDepartment(dto.getSeniorTreasurerDepartment());
        renewal.setSeniorTreasurerEmail(dto.getSeniorTreasurerEmail());
        renewal.setSeniorTreasurerAddress(dto.getSeniorTreasurerAddress());
        renewal.setSeniorTreasurerMobile(dto.getSeniorTreasurerMobile());

        // Flatten officials mapping would go here (similar to Registration)

        return renewal;
    }

    private void updateSocietyFromRenewal(SocietyRenewal renewal) {
        Society society = societyRepository.findBySocietyName(renewal.getSocietyName())
                .orElseThrow(() -> new RuntimeException("Society not found"));
        society.setWebsite(renewal.getWebsite());
        society.setYear(renewal.getRenewalYear());
        societyRepository.save(society);
    }
}