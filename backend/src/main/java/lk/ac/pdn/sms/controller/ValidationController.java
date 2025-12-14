package lk.ac.pdn.sms.controller;

import lk.ac.pdn.sms.service.EmailValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/validation")
@CrossOrigin(origins = "http://localhost:5173")
public class ValidationController {

    @Autowired
    private EmailValidationService emailValidationService;

    @PostMapping("/email")
    public ResponseEntity<Map<String, Object>> validateEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String position = request.get("position");
        
        Map<String, Object> response = new HashMap<>();
        
        String error = emailValidationService.validateEmailForPosition(email, position);
        response.put("isValid", error == null);
        response.put("error", error);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/mobile")
    public ResponseEntity<Map<String, Object>> validateMobile(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        
        Map<String, Object> response = new HashMap<>();
        response.put("isValid", emailValidationService.isValidMobile(mobile));
        
        if (!emailValidationService.isValidMobile(mobile)) {
            response.put("error", "Invalid Sri Lankan mobile number format (e.g., 0771234567)");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/registration-number")
    public ResponseEntity<Map<String, Object>> validateRegistrationNumber(@RequestBody Map<String, String> request) {
        String regNo = request.get("regNo");
        
        Map<String, Object> response = new HashMap<>();
        response.put("isValid", emailValidationService.isValidRegistrationNumber(regNo));
        
        if (!emailValidationService.isValidRegistrationNumber(regNo)) {
            response.put("error", "Registration number must contain both letters and numbers");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/bulk-emails")
    public ResponseEntity<Map<String, Object>> validateBulkEmails(@RequestBody Map<String, List<String>> request) {
        List<String> emails = request.get("emails");
        
        Map<String, Object> response = new HashMap<>();
        List<String> invalidEmails = emailValidationService.getInvalidEmails(emails);
        
        response.put("totalEmails", emails.size());
        response.put("validEmails", emails.size() - invalidEmails.size());
        response.put("invalidEmails", invalidEmails);
        response.put("isAllValid", invalidEmails.isEmpty());
        
        return ResponseEntity.ok(response);
    }
}