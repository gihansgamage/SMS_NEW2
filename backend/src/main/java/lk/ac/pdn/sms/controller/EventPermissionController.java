package lk.ac.pdn.sms.controller;

import lk.ac.pdn.sms.dto.EventPermissionDto;
import lk.ac.pdn.sms.dto.ApprovalDto;
import lk.ac.pdn.sms.dto.ApplicantDetailsDto;
import lk.ac.pdn.sms.entity.EventPermission;
import lk.ac.pdn.sms.service.EventPermissionService;
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
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventPermissionController {

    @Autowired
    private EventPermissionService eventService;

    @PostMapping("/request")
    public ResponseEntity<EventPermission> requestPermission(@Valid @RequestBody EventPermissionDto dto) {
        return ResponseEntity.ok(eventService.createEventRequest(dto));
    }

    // --- NEW: Auto-Fill Endpoint ---
    @GetMapping("/applicant-details")
    public ResponseEntity<ApplicantDetailsDto> getApplicantDetails(
            @RequestParam String societyName,
            @RequestParam String position) {
        return ResponseEntity.ok(eventService.getApplicantDetails(societyName, position));
    }

    @PostMapping("/validate-applicant")
    public ResponseEntity<Boolean> validateApplicant(@RequestBody Map<String, String> request) {
        String societyName = request.get("societyName");
        String position = request.get("position");
        String regNo = request.get("regNo");
        String email = request.get("email");

        boolean isValid = eventService.validateApplicantPosition(societyName, position, regNo, email);
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/preview-pdf")
    public ResponseEntity<byte[]> previewPDF(@RequestBody EventPermissionDto dto) {
        byte[] pdfBytes = eventService.generatePreviewPDF(dto);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=event_preview.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadPDF(@PathVariable Long id) {
        byte[] pdfBytes = eventService.generateEventPDF(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=event_permission.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/admin/pending")
    @PreAuthorize("hasAnyRole('DEAN', 'PREMISES_OFFICER', 'ASSISTANT_REGISTRAR', 'VICE_CHANCELLOR')")
    public ResponseEntity<List<EventPermission>> getPendingRequests(Principal principal) {
        return ResponseEntity.ok(eventService.getPendingRequests(null, principal.getName()));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyRole('DEAN', 'ASSISTANT_REGISTRAR', 'VICE_CHANCELLOR', 'STUDENT_SERVICE', 'PREMISES_OFFICER')")
    public ResponseEntity<List<EventPermission>> getAllEventsForAdmin(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(eventService.getAllEvents(status));
    }

    @PostMapping("/admin/approve/{id}")
    @PreAuthorize("hasAnyRole('DEAN', 'PREMISES_OFFICER', 'ASSISTANT_REGISTRAR', 'VICE_CHANCELLOR')")
    public ResponseEntity<EventPermission> approveRequest(
            @PathVariable Long id,
            @RequestBody ApprovalDto dto,
            Principal principal) {
        return ResponseEntity.ok(eventService.approveRequest(id, dto, principal.getName()));
    }

    @PostMapping("/admin/reject/{id}")
    @PreAuthorize("hasAnyRole('DEAN', 'PREMISES_OFFICER', 'ASSISTANT_REGISTRAR', 'VICE_CHANCELLOR')")
    public ResponseEntity<EventPermission> rejectRequest(
            @PathVariable Long id,
            @RequestBody ApprovalDto dto,
            Principal principal) {
        return ResponseEntity.ok(eventService.rejectRequest(id, dto, principal.getName()));
    }

    @GetMapping("/public/upcoming")
    public ResponseEntity<List<EventPermission>> getUpcomingEvents(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(eventService.getUpcomingEvents(limit));
    }
}