package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.dto.SocietyRenewalDto;
import lk.ac.pdn.sms.dto.ApprovalDto;
import lk.ac.pdn.sms.entity.*;
import lk.ac.pdn.sms.repository.SocietyRenewalRepository;
import lk.ac.pdn.sms.repository.SocietyRepository;
import lk.ac.pdn.sms.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class RenewalService {

    @Autowired private SocietyRenewalRepository renewalRepository;
    @Autowired private SocietyRepository societyRepository;
    @Autowired private AdminUserRepository adminUserRepository;
    @Autowired private EmailService emailService;

    // --- Submit Renewal ---
    public SocietyRenewal submitRenewal(SocietyRenewalDto dto) {
        SocietyRenewal renewal = new SocietyRenewal();

        // Mapping
        renewal.setSocietyName(dto.getSocietyName());
        renewal.setRenewalYear(LocalDate.now().getYear());

        renewal.setApplicantFullName(dto.getApplicantFullName());
        renewal.setApplicantRegNo(dto.getApplicantRegNo());
        renewal.setApplicantEmail(dto.getApplicantEmail());
        renewal.setApplicantFaculty(dto.getApplicantFaculty());
        renewal.setApplicantMobile(dto.getApplicantMobile());

        // Officials
        renewal.setPresidentName(dto.getPresidentName());
        renewal.setPresidentRegNo(dto.getPresidentRegNo());
        renewal.setPresidentEmail(dto.getPresidentEmail());
        renewal.setPresidentMobile(dto.getPresidentMobile());
        renewal.setPresidentAddress(dto.getPresidentAddress());

        renewal.setSecretaryName(dto.getSecretaryName());
        renewal.setSecretaryRegNo(dto.getSecretaryRegNo());
        renewal.setSecretaryEmail(dto.getSecretaryEmail());
        renewal.setSecretaryMobile(dto.getSecretaryMobile());
        renewal.setSecretaryAddress(dto.getSecretaryAddress());

        renewal.setJuniorTreasurerName(dto.getJuniorTreasurerName());
        renewal.setJuniorTreasurerRegNo(dto.getJuniorTreasurerRegNo());
        renewal.setJuniorTreasurerEmail(dto.getJuniorTreasurerEmail());
        renewal.setJuniorTreasurerMobile(dto.getJuniorTreasurerMobile());
        renewal.setJuniorTreasurerAddress(dto.getJuniorTreasurerAddress());

        renewal.setVicePresidentName(dto.getVicePresidentName());
        renewal.setVicePresidentRegNo(dto.getVicePresidentRegNo());
        renewal.setVicePresidentEmail(dto.getVicePresidentEmail());
        renewal.setVicePresidentMobile(dto.getVicePresidentMobile());
        renewal.setVicePresidentAddress(dto.getVicePresidentAddress());

        renewal.setJointSecretaryName(dto.getJointSecretaryName());
        renewal.setJointSecretaryRegNo(dto.getJointSecretaryRegNo());
        renewal.setJointSecretaryEmail(dto.getJointSecretaryEmail());
        renewal.setJointSecretaryMobile(dto.getJointSecretaryMobile());
        renewal.setJointSecretaryAddress(dto.getJointSecretaryAddress());

        renewal.setEditorName(dto.getEditorName());
        renewal.setEditorRegNo(dto.getEditorRegNo());
        renewal.setEditorEmail(dto.getEditorEmail());
        renewal.setEditorMobile(dto.getEditorMobile());
        renewal.setEditorAddress(dto.getEditorAddress());

        // Senior Treasurer
        renewal.setSeniorTreasurerName(dto.getSeniorTreasurerFullName());
        renewal.setSeniorTreasurerEmail(dto.getSeniorTreasurerEmail());
        renewal.setSeniorTreasurerMobile(dto.getSeniorTreasurerMobile());
        renewal.setSeniorTreasurerTitle(dto.getSeniorTreasurerTitle());
        renewal.setSeniorTreasurerDesignation(dto.getSeniorTreasurerDesignation());
        renewal.setSeniorTreasurerDepartment(dto.getSeniorTreasurerDepartment());
        renewal.setSeniorTreasurerAddress(dto.getSeniorTreasurerAddress());

        renewal.setBankAccount(dto.getBankAccount());
        renewal.setBankName(dto.getBankName());
        if(dto.getAgmDate() != null) renewal.setAgmDate(LocalDate.parse(dto.getAgmDate()));
        renewal.setDifficulties(dto.getDifficulties());

        renewal.setStatus(SocietyRenewal.RenewalStatus.PENDING_DEAN);
        renewal = renewalRepository.save(renewal);

        try { emailService.sendRenewalConfirmation(renewal); } catch(Exception e) {}

        return renewal;
    }

    // --- Approve Renewal ---
    public SocietyRenewal approveRenewal(Long id, ApprovalDto dto, String userEmail) {
        SocietyRenewal renewal = renewalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Renewal not found"));
        AdminUser admin = adminUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        boolean fullyApproved = false;

        switch (admin.getRole()) {
            case DEAN:
                renewal.setStatus(SocietyRenewal.RenewalStatus.PENDING_AR);
                renewal.setIsDeanApproved(true);
                renewal.setDeanApprovalDate(LocalDateTime.now());
                renewal.setDeanComment(dto.getReason()); // Using reason as comment if any
                break;
            case ASSISTANT_REGISTRAR:
                renewal.setStatus(SocietyRenewal.RenewalStatus.PENDING_VC);
                renewal.setIsArApproved(true);
                renewal.setArApprovalDate(LocalDateTime.now());
                renewal.setArComment(dto.getReason());
                break;
            case VICE_CHANCELLOR:
                renewal.setStatus(SocietyRenewal.RenewalStatus.APPROVED);
                renewal.setIsVcApproved(true);
                renewal.setVcApprovalDate(LocalDateTime.now());
                renewal.setVcComment(dto.getReason());
                renewal.setApprovedDate(LocalDateTime.now());
                fullyApproved = true;
                break;
            default:
                throw new RuntimeException("Unauthorized");
        }

        renewal = renewalRepository.save(renewal);

        // Update Society Table if fully approved
        if (fullyApproved) {
            updateSocietyTable(renewal);
            try { emailService.sendRenewalStatusUpdate(renewal, "APPROVED", "Vice Chancellor"); } catch(Exception e) {}
        }

        return renewal;
    }

    private void updateSocietyTable(SocietyRenewal renewal) {
        int year = LocalDate.now().getYear();
        String name = renewal.getSocietyName();

        // Use Composite Key
        SocietyId societyId = new SocietyId(name, year);
        Society society = societyRepository.findById(societyId).orElse(new Society());

        // Set IDs
        society.setSocietyName(name);
        society.setYear(year);

        society.setStatus(Society.SocietyStatus.ACTIVE);
        society.setFaculty(renewal.getApplicantFaculty());

        // Map Officials
        society.setPresidentName(renewal.getPresidentName());
        society.setPresidentRegNo(renewal.getPresidentRegNo());
        society.setPresidentEmail(renewal.getPresidentEmail());
        society.setPresidentMobile(renewal.getPresidentMobile());

        society.setVicePresidentName(renewal.getVicePresidentName());
        society.setVicePresidentRegNo(renewal.getVicePresidentRegNo());
        society.setVicePresidentEmail(renewal.getVicePresidentEmail());
        society.setVicePresidentMobile(renewal.getVicePresidentMobile());

        society.setSecretaryName(renewal.getSecretaryName());
        society.setSecretaryRegNo(renewal.getSecretaryRegNo());
        society.setSecretaryEmail(renewal.getSecretaryEmail());
        society.setSecretaryMobile(renewal.getSecretaryMobile());

        society.setJointSecretaryName(renewal.getJointSecretaryName());
        society.setJointSecretaryRegNo(renewal.getJointSecretaryRegNo());
        society.setJointSecretaryEmail(renewal.getJointSecretaryEmail());
        society.setJointSecretaryMobile(renewal.getJointSecretaryMobile());

        society.setJuniorTreasurerName(renewal.getJuniorTreasurerName());
        society.setJuniorTreasurerRegNo(renewal.getJuniorTreasurerRegNo());
        society.setJuniorTreasurerEmail(renewal.getJuniorTreasurerEmail());
        society.setJuniorTreasurerMobile(renewal.getJuniorTreasurerMobile());

        society.setEditorName(renewal.getEditorName());
        society.setEditorRegNo(renewal.getEditorRegNo());
        society.setEditorEmail(renewal.getEditorEmail());
        society.setEditorMobile(renewal.getEditorMobile());

        society.setSeniorTreasurerName(renewal.getSeniorTreasurerName());
        society.setSeniorTreasurerEmail(renewal.getSeniorTreasurerEmail());

        society.setBankAccount(renewal.getBankAccount());
        society.setBankName(renewal.getBankName());
        society.setAgmDate(renewal.getAgmDate());

        societyRepository.save(society);
    }

    public SocietyRenewal rejectRenewal(Long id, ApprovalDto dto, String userEmail) {
        SocietyRenewal renewal = renewalRepository.findById(id).orElseThrow();
        renewal.setStatus(SocietyRenewal.RenewalStatus.REJECTED);
        renewal.setRejectionReason(dto.getReason());
        try { emailService.sendRenewalRejection(renewal); } catch(Exception e) {}
        return renewalRepository.save(renewal);
    }

    public List<SocietyRenewal> getPendingRenewals(String faculty, String status, String userEmail) {
        return renewalRepository.findAll();
    }

    public Page<SocietyRenewal> getAllRenewals(Integer year, String status, Pageable pageable) {
        return renewalRepository.findAll(pageable);
    }

    public SocietyRenewal getRenewalById(Long id) { return renewalRepository.findById(id).orElseThrow(); }
    public SocietyRenewalDto getLatestSocietyData(String societyName) { return new SocietyRenewalDto(); }
    public byte[] generateRenewalPreviewPDF(SocietyRenewalDto dto) { return new byte[0]; }
    public byte[] generateRenewalPDF(Long id) { return new byte[0]; }
    public Object getRenewalStatistics() { return null; }
}