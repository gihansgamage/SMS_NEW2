package lk.ac.pdn.sms.controller;

import lk.ac.pdn.sms.dto.EventPermissionDto;
import lk.ac.pdn.sms.entity.EventPermission;
import lk.ac.pdn.sms.service.EventPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EventPermissionController {

    @Autowired
    private EventPermissionService eventService;

    // Public: Request an event
    @PostMapping("/request")
    public ResponseEntity<EventPermission> requestEvent(@RequestBody EventPermissionDto dto) {
        return ResponseEntity.ok(eventService.createEventRequest(dto));
    }

    // Public: Validate Applicant
    @PostMapping("/validate-applicant")
    public ResponseEntity<Boolean> validateApplicant(@RequestBody Map<String, String> payload) {
        // Implementation delegated to service
        boolean isValid = eventService.validateApplicant(
                payload.get("societyName"),
                payload.get("position"),
                payload.get("regNo"),
                payload.get("email")
        );
        return ResponseEntity.ok(isValid);
    }

    // Public: Get Upcoming Events
    @GetMapping("/public/upcoming")
    public ResponseEntity<List<EventPermission>> getUpcomingEvents(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(eventService.getUpcomingEvents(limit));
    }

    // --- Admin Endpoints ---

    // Fix for Admin Events Tab
    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyRole('DEAN', 'ASSISTANT_REGISTRAR', 'VICE_CHANCELLOR', 'STUDENT_SERVICE', 'PREMISES_OFFICER')")
    public ResponseEntity<List<EventPermission>> getAllEventsForAdmin(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(eventService.getAllEvents(status));
    }

    @GetMapping("/admin/pending")
    @PreAuthorize("hasAnyRole('DEAN', 'ASSISTANT_REGISTRAR', 'VICE_CHANCELLOR')")
    public ResponseEntity<List<EventPermission>> getPendingEvents() {
        return ResponseEntity.ok(eventService.getPendingEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventPermission> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }
}