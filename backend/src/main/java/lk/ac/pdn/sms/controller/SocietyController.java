package lk.ac.pdn.sms.controller;

import lk.ac.pdn.sms.dto.SocietyRegistrationDto;
import lk.ac.pdn.sms.entity.Society;
import lk.ac.pdn.sms.entity.SocietyRegistration;
import lk.ac.pdn.sms.service.SocietyService;
import lk.ac.pdn.sms.service.PDFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/societies")
@CrossOrigin(origins = "http://localhost:5173")
public class SocietyController {

    @Autowired
    private SocietyService societyService;

    @Autowired
    private PDFService pdfService;

    // --- PUBLIC ENDPOINTS ---

    @GetMapping("/public")
    public ResponseEntity<Page<Society>> getAllSocieties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size, // Increased default size to fetch all for dropdowns
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer year,
            Pageable pageable) {

        Page<Society> societies = societyService.getAllSocieties(search, status, year, pageable);
        return ResponseEntity.ok(societies);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Society>> getActiveSocieties() {
        return ResponseEntity.ok(societyService.getActiveSocieties());
    }

    @GetMapping("/latest-data")
    public ResponseEntity<Society> getLatestSocietyData(@RequestParam String societyName) {
        return ResponseEntity.ok(societyService.getLatestSocietyData(societyName));
    }

    @GetMapping("/statistics")
    public ResponseEntity<Object> getSocietyStatistics() {
        return ResponseEntity.ok(societyService.getSocietyStatistics());
    }

    // --- REGISTRATION ---

    @PostMapping("/register")
    public ResponseEntity<SocietyRegistration> registerSociety(@Valid @RequestBody SocietyRegistrationDto registrationDto) {
        return ResponseEntity.ok(societyService.registerSociety(registrationDto));
    }

    // --- DOWNLOADS ---

    @GetMapping("/registration/download/{id}")
    public ResponseEntity<byte[]> downloadRegistrationPDF(@PathVariable Long id) {
        try {
            SocietyRegistration registration = societyService.getRegistrationById(id);
            byte[] pdfBytes = pdfService.generateRegistrationPDF(registration);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=registration_" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}