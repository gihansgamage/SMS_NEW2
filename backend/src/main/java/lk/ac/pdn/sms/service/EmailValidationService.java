package lk.ac.pdn.sms.service;

import org.springframework.stereotype.Service;
import java.util.regex.Pattern;
import java.util.List;
import java.util.ArrayList;

@Service
public class EmailValidationService {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    
    private static final Pattern MOBILE_PATTERN = Pattern.compile(
        "^(\\+94|0)?[7][0-9]{8}$"
    );
    
    // Registration number must contain both letters and numbers
    private static final Pattern REG_NO_PATTERN = Pattern.compile(
        "^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$"
    );

    public boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    public boolean isValidMobile(String mobile) {
        return mobile != null && MOBILE_PATTERN.matcher(mobile.replaceAll("\\s", "")).matches();
    }
    
    public boolean isValidRegistrationNumber(String regNo) {
        return regNo != null && REG_NO_PATTERN.matcher(regNo).matches();
    }
    
    public List<String> validateSocietyOfficials(Object societyData) {
        List<String> errors = new ArrayList<>();
        
        // This method would validate all society officials' email addresses
        // and return a list of validation errors
        
        return errors;
    }
    
    public List<String> getInvalidEmails(List<String> emails) {
        List<String> invalidEmails = new ArrayList<>();
        
        for (String email : emails) {
            if (!isValidEmail(email)) {
                invalidEmails.add(email);
            }
        }
        
        return invalidEmails;
    }
    
    public String validateEmailForPosition(String email, String position) {
        if (!isValidEmail(email)) {
            return "Invalid email format";
        }
        
        return null; // No error
    }
}