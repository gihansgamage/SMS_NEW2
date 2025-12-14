package lk.ac.pdn.sms.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lk.ac.pdn.sms.dto.LoginRequest;
import lk.ac.pdn.sms.entity.AdminUser;
import lk.ac.pdn.sms.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        System.out.println("Login Request: " + loginRequest); // Debug Log

        // 1. Validate inputs
        if (loginRequest.getEmail() == null || loginRequest.getRole() == null) {
            return ResponseEntity.badRequest().body("Email and Role are required");
        }

        // 2. Check if user exists in admin_users table
        AdminUser user = adminUserRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);

        if (user == null) {
            System.out.println("User not found: " + loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found with this email.");
        }

        // 3. Validate Role (Case Insensitive)
        if (!user.getRole().name().equalsIgnoreCase(loginRequest.getRole())) {
            System.out.println("Role Mismatch. Expected: " + user.getRole() + ", Got: " + loginRequest.getRole());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Role mismatch. You are registered as " + user.getRole());
        }

        // 4. Validate Faculty (Only if role is DEAN) - ROBUST MATCHING
        if (user.getRole() == AdminUser.Role.DEAN) {
            String reqFaculty = loginRequest.getFaculty() != null ? loginRequest.getFaculty().toLowerCase().trim() : "";
            String dbFaculty = user.getFaculty() != null ? user.getFaculty().toLowerCase().trim() : "";

            // Check if one contains the other (e.g., "Engineering" matches "Faculty of Engineering")
            if (reqFaculty.isEmpty() || (!dbFaculty.contains(reqFaculty) && !reqFaculty.contains(dbFaculty))) {
                System.out.println("Faculty Mismatch. DB: " + dbFaculty + ", Request: " + reqFaculty);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Faculty mismatch. Registered: " + user.getFaculty() + ", Selected: " + loginRequest.getFaculty());
            }
        }

        // 5. Create Authentication Token
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, Collections.singletonList(authority));

        // 6. Set Security Context
        SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(auth);

        // 7. Persist to Session
        HttpSession session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }
}