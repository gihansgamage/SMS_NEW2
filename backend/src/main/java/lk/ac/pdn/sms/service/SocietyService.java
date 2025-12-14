package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.dto.SocietyRegistrationDto;
import lk.ac.pdn.sms.entity.*;
import lk.ac.pdn.sms.repository.SocietyRegistrationRepository;
import lk.ac.pdn.sms.repository.SocietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class SocietyService {

    @Autowired
    private SocietyRegistrationRepository registrationRepository;

    @Autowired
    private SocietyRepository societyRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ActivityLogService activityLogService;

    // --- Public Data Access ---

    public Page<Society> getAllSocieties(String search, String status, Integer year, Pageable pageable) {
        Society.SocietyStatus statusEnum = null;
        if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("all")) {
            try {
                statusEnum = Society.SocietyStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid status
            }
        }

        // Use the custom search method in repository
        return societyRepository.search(search, statusEnum, year, pageable);
    }

    public Society getSocietyById(Long id) {
        return societyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Society not found"));
    }

    public List<Society> getActiveSocieties() {
        return societyRepository.findByStatus(Society.SocietyStatus.ACTIVE);
    }

    // FIX: Implemented this method to return actual counts
    public Object getSocietyStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // 1. Total Societies
        stats.put("totalSocieties", societyRepository.count());

        // 2. Active Societies (Fixes the home page count issue)
        stats.put("activeSocieties", societyRepository.countByStatus(Society.SocietyStatus.ACTIVE));

        // 3. New Registrations this year
        stats.put("currentYearRegistrations", registrationRepository.countByYear(LocalDate.now().getYear()));

        return stats;
    }

    // --- Registration Process ---

    public SocietyRegistration registerSociety(SocietyRegistrationDto dto) {
        // 1. Validation
        if (societyRepository.existsBySocietyNameAndYear(dto.getSocietyName(), LocalDate.now().getYear())) {
            throw new RuntimeException("Society already registered for this year.");
        }

        // 2. Map DTO to Entity
        SocietyRegistration reg = new SocietyRegistration();

        // Applicant
        reg.setApplicantFullName(dto.getApplicantFullName());
        reg.setApplicantRegNo(dto.getApplicantRegNo());
        reg.setApplicantEmail(dto.getApplicantEmail());
        reg.setApplicantFaculty(dto.getApplicantFaculty());
        reg.setApplicantMobile(dto.getApplicantMobile());

        // Society Info
        reg.setSocietyName(dto.getSocietyName());
        reg.setAims(dto.getAims());
        if (dto.getAgmDate() != null && !dto.getAgmDate().isEmpty()) {
            reg.setAgmDate(LocalDate.parse(dto.getAgmDate()));
        }
        reg.setBankAccount(dto.getBankAccount());
        reg.setBankName(dto.getBankName());

        // Senior Treasurer
        reg.setSeniorTreasurerTitle(dto.getSeniorTreasurerTitle());
        reg.setSeniorTreasurerFullName(dto.getSeniorTreasurerFullName());
        reg.setSeniorTreasurerDesignation(dto.getSeniorTreasurerDesignation());
        reg.setSeniorTreasurerDepartment(dto.getSeniorTreasurerDepartment());
        reg.setSeniorTreasurerEmail(dto.getSeniorTreasurerEmail());
        reg.setSeniorTreasurerAddress(dto.getSeniorTreasurerAddress());
        reg.setSeniorTreasurerMobile(dto.getSeniorTreasurerMobile());

        // Officials - President
        reg.setPresidentRegNo(dto.getPresidentRegNo());
        reg.setPresidentName(dto.getPresidentName());
        reg.setPresidentAddress(dto.getPresidentAddress());
        reg.setPresidentEmail(dto.getPresidentEmail());
        reg.setPresidentMobile(dto.getPresidentMobile());

        // Officials - Vice President
        reg.setVicePresidentRegNo(dto.getVicePresidentRegNo());
        reg.setVicePresidentName(dto.getVicePresidentName());
        reg.setVicePresidentAddress(dto.getVicePresidentAddress());
        reg.setVicePresidentEmail(dto.getVicePresidentEmail());
        reg.setVicePresidentMobile(dto.getVicePresidentMobile());

        // Officials - Secretary
        reg.setSecretaryRegNo(dto.getSecretaryRegNo());
        reg.setSecretaryName(dto.getSecretaryName());
        reg.setSecretaryAddress(dto.getSecretaryAddress());
        reg.setSecretaryEmail(dto.getSecretaryEmail());
        reg.setSecretaryMobile(dto.getSecretaryMobile());

        // Officials - Joint Secretary
        reg.setJointSecretaryRegNo(dto.getJointSecretaryRegNo());
        reg.setJointSecretaryName(dto.getJointSecretaryName());
        reg.setJointSecretaryAddress(dto.getJointSecretaryAddress());
        reg.setJointSecretaryEmail(dto.getJointSecretaryEmail());
        reg.setJointSecretaryMobile(dto.getJointSecretaryMobile());

        // Officials - Junior Treasurer
        reg.setJuniorTreasurerRegNo(dto.getJuniorTreasurerRegNo());
        reg.setJuniorTreasurerName(dto.getJuniorTreasurerName());
        reg.setJuniorTreasurerAddress(dto.getJuniorTreasurerAddress());
        reg.setJuniorTreasurerEmail(dto.getJuniorTreasurerEmail());
        reg.setJuniorTreasurerMobile(dto.getJuniorTreasurerMobile());

        // Officials - Editor
        reg.setEditorRegNo(dto.getEditorRegNo());
        reg.setEditorName(dto.getEditorName());
        reg.setEditorAddress(dto.getEditorAddress());
        reg.setEditorEmail(dto.getEditorEmail());
        reg.setEditorMobile(dto.getEditorMobile());

        // Lists - Advisory Board
        if (dto.getAdvisoryBoard() != null) {
            reg.setAdvisoryBoard(dto.getAdvisoryBoard().stream().map(m -> {
                RegistrationAdvisoryBoardMember member = new RegistrationAdvisoryBoardMember();
                member.setName(m.getName());
                member.setDesignation(m.getDesignation());
                member.setDepartment(m.getDepartment());
                return member;
            }).collect(Collectors.toList()));
        }

        // Lists - Committee Members
        if (dto.getCommitteeMember() != null) {
            reg.setCommitteeMember(dto.getCommitteeMember().stream().map(m -> {
                RegistrationCommitteeMember member = new RegistrationCommitteeMember();
                member.setName(m.getName());
                member.setRegNo(m.getRegNo());
                return member;
            }).collect(Collectors.toList()));
        }

        // Lists - General Members
        if (dto.getMember() != null) {
            reg.setMember(dto.getMember().stream().map(m -> {
                RegistrationGeneralMember member = new RegistrationGeneralMember();
                member.setName(m.getName());
                member.setRegNo(m.getRegNo());
                return member;
            }).collect(Collectors.toList()));
        }

        // Lists - Planning Events
        if (dto.getPlanningEvents() != null) {
            reg.setPlanningEvents(dto.getPlanningEvents().stream().map(e -> {
                RegistrationPlanningEvent event = new RegistrationPlanningEvent();
                event.setMonth(e.getMonth());
                event.setActivity(e.getActivity());
                return event;
            }).collect(Collectors.toList()));
        }

        // Save
        reg = registrationRepository.save(reg);

        // Notify
        emailService.sendRegistrationConfirmation(reg);
        emailService.notifyDeanForApproval(reg);
        activityLogService.logActivity("New Society Registration", reg.getSocietyName(), reg.getApplicantFullName());

        return reg;
    }

    public Society getLatestSocietyData(String societyName) {
        return societyRepository.findBySocietyName(societyName)
                .orElseThrow(() -> new RuntimeException("Society not found with name: " + societyName));
    }

    public SocietyRegistration getRegistrationById(Long id) {
        return registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
    }
}