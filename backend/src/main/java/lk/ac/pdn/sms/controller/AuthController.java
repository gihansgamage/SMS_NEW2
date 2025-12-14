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
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        System.out.println("--- LOGIN ATTEMPT ---");
        System.out.println("Email: " + loginRequest.getEmail());
        System.out.println("Role Request: " + loginRequest.getRole());

        // 1. Validate Input
        if (loginRequest.getEmail() == null || loginRequest.getRole() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and Role are required"));
        }

        // 2. Find User in DB
        AdminUser user = adminUserRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);

        if (user == null) {
            System.out.println("Error: User not found in 'admin_users' table.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Access Denied: User email not found in admin records."));
        }

        // 3. Validate Role
        if (!user.getRole().name().equalsIgnoreCase(loginRequest.getRole())) {
            System.out.println("Error: Role Mismatch. DB: " + user.getRole() + ", Req: " + loginRequest.getRole());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Access Denied: Your registered role is " + user.getRole()));
        }

        // 4. Validate Faculty (If Dean)
        if (user.getRole() == AdminUser.Role.DEAN) {
            String reqFaculty = loginRequest.getFaculty() != null ? loginRequest.getFaculty().toLowerCase().trim() : "";
            String dbFaculty = user.getFaculty() != null ? user.getFaculty().toLowerCase().trim() : "";

            System.out.println("Checking Faculty. DB: " + dbFaculty + ", Req: " + reqFaculty);

            // Flexible matching: check if strings contain each other
            if (reqFaculty.isEmpty() || (!dbFaculty.contains(reqFaculty) && !reqFaculty.contains(dbFaculty))) {
                System.out.println("Error: Faculty Mismatch");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Access Denied: Faculty mismatch. Registered to: " + user.getFaculty()));
            }
        }

        // 5. Success - Set Session Manually (Most Reliable Method)
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, Collections.singletonList(authority));

        SecurityContext sc = SecurityContextHolder.createEmptyContext();
        sc.setAuthentication(auth);
        SecurityContextHolder.setContext(sc);

        // Explicitly save to session
        HttpSession session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);

        System.out.println("--- LOGIN SUCCESSFUL: " + user.getName() + " ---");
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        System.out.println("User Logged Out");
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}