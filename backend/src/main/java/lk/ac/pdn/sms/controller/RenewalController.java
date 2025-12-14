package lk.ac.pdn.sms.controller;

import lk.ac.pdn.sms.dto.SocietyRenewalDto;
import lk.ac.pdn.sms.dto.ApprovalDto;
import lk.ac.pdn.sms.entity.SocietyRenewal;
import lk.ac.pdn.sms.service.RenewalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/renewals")
@CrossOrigin(origins = "http://localhost:5173")
public class RenewalController {

    @Autowired
    private RenewalService renewalService;

    @PostMapping("/submit")
    public ResponseEntity<SocietyRenewal> submitRenewal(@Valid @RequestBody SocietyRenewalDto renewalDto) {
        SocietyRenewal renewal = renewalService.submitRenewal(renewalDto);
        return ResponseEntity.ok(renewal);
    }

    // NEW: Pre-fill data endpoint
    @GetMapping("/latest-data")
    public ResponseEntity<SocietyRenewalDto> getLatestSocietyData(@RequestParam String societyName) {
        return ResponseEntity.ok(renewalService.getLatestSocietyData(societyName));
    }

    // NEW: PDF Preview endpoint
    @PostMapping("/preview-pdf")
    public ResponseEntity<byte[]> previewRenewalPDF(@RequestBody SocietyRenewalDto renewalDto) {
        byte[] pdfBytes = renewalService.generateRenewalPreviewPDF(renewalDto);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=renewal_preview.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('DEAN') or hasRole('ASSISTANT_REGISTRAR') or hasRole('VICE_CHANCELLOR')")
    public ResponseEntity<List<SocietyRenewal>> getPendingRenewals(
            @RequestParam(required = false) String faculty,
            @RequestParam(required = false) String status,
            Principal principal) {

        List<SocietyRenewal> renewals = renewalService.getPendingRenewals(faculty, status, principal.getName());
        return ResponseEntity.ok(renewals);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('DEAN') or hasRole('ASSISTANT_REGISTRAR') or hasRole('VICE_CHANCELLOR')")
    public ResponseEntity<Page<SocietyRenewal>> getAllRenewals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String status,
            Pageable pageable) {

        Page<SocietyRenewal> renewals = renewalService.getAllRenewals(year, status, pageable);
        return ResponseEntity.ok(renewals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SocietyRenewal> getRenewalById(@PathVariable Long id) {
        SocietyRenewal renewal = renewalService.getRenewalById(id);
        return ResponseEntity.ok(renewal);
    }

    @PostMapping("/admin/approve/{id}")
    @PreAuthorize("hasRole('DEAN') or hasRole('ASSISTANT_REGISTRAR') or hasRole('VICE_CHANCELLOR')")
    public ResponseEntity<SocietyRenewal> approveRenewal(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalDto approvalDto,
            Principal principal) {

        SocietyRenewal approved = renewalService.approveRenewal(id, approvalDto, principal.getName());
        return ResponseEntity.ok(approved);
    }

    @PostMapping("/admin/reject/{id}")
    @PreAuthorize("hasRole('DEAN') or hasRole('ASSISTANT_REGISTRAR') or hasRole('VICE_CHANCELLOR')")
    public ResponseEntity<SocietyRenewal> rejectRenewal(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalDto approvalDto,
            Principal principal) {

        SocietyRenewal rejected = renewalService.rejectRenewal(id, approvalDto, principal.getName());
        return ResponseEntity.ok(rejected);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadRenewalPDF(@PathVariable Long id) {
        byte[] pdfBytes = renewalService.generateRenewalPDF(id);

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=renewal-application.pdf")
                .body(pdfBytes);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ASSISTANT_REGISTRAR') or hasRole('VICE_CHANCELLOR') or hasRole('STUDENT_SERVICE')")
    public ResponseEntity<Object> getRenewalStatistics() {
        Object stats = renewalService.getRenewalStatistics();
        return ResponseEntity.ok(stats);
    }
}