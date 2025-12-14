package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.entity.AdminUser;
import lk.ac.pdn.sms.repository.AdminUserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final AdminUserRepository adminUserRepository;

    public CustomOAuth2UserService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);
        String googleEmail = oAuth2User.getAttribute("email");

        System.out.println("\n\n==========================================");
        System.out.println("🚀 LOGIN ATTEMPT RECEIVED");
        System.out.println("➤ Email from Google: " + googleEmail);

        if (googleEmail == null) {
            throw new OAuth2AuthenticationException("Email not found from Google provider");
        }

        // 1. Try Direct Lookup
        AdminUser adminUser = adminUserRepository.findByEmail(googleEmail).orElse(null);

        // 2. Fallback: Manual Search (Fixes case sensitivity & googlemail.com issues)
        if (adminUser == null) {
            System.out.println("➤ Direct DB lookup failed. Trying fuzzy match...");
            List<AdminUser> allUsers = adminUserRepository.findAll();

            for (AdminUser u : allUsers) {
                if (emailsMatch(u.getEmail(), googleEmail)) {
                    adminUser = u;
                    System.out.println("✅ Match found via fuzzy search: " + u.getEmail());
                    break;
                }
            }
        }

        // 3. Final Validation
        if (adminUser == null) {
            System.out.println("❌ FAILED: No matching user found in DB for: " + googleEmail);
            System.out.println("==========================================\n");
            throw new OAuth2AuthenticationException("Unauthorized: Email not registered.");
        }

        if (!Boolean.TRUE.equals(adminUser.getIsActive())) {
            System.out.println("❌ FAILED: User '" + adminUser.getEmail() + "' is inactive.");
            System.out.println("==========================================\n");
            throw new OAuth2AuthenticationException("Account is inactive.");
        }

        System.out.println("✅ SUCCESS: Logged in as " + adminUser.getRole());
        System.out.println("==========================================\n");

        return createOAuth2User(oAuth2User, adminUser.getRole().name(), adminUser.getId(), adminUser.getName(), adminUser.getFaculty());
    }

    // Helper to match emails robustly
    private boolean emailsMatch(String dbEmail, String googleEmail) {
        if (dbEmail == null || googleEmail == null) return false;

        String cleanDb = dbEmail.trim().toLowerCase();
        String cleanGoogle = googleEmail.trim().toLowerCase();

        if (cleanDb.equals(cleanGoogle)) return true;

        // Handle gmail.com vs googlemail.com alias
        String dbDomain = cleanDb.substring(cleanDb.indexOf("@") + 1);
        String googleDomain = cleanGoogle.substring(cleanGoogle.indexOf("@") + 1);

        String dbUser = cleanDb.substring(0, cleanDb.indexOf("@"));
        String googleUser = cleanGoogle.substring(0, cleanGoogle.indexOf("@"));

        if (dbUser.equals(googleUser)) {
            if ((dbDomain.equals("gmail.com") && googleDomain.equals("googlemail.com")) ||
                    (dbDomain.equals("googlemail.com") && googleDomain.equals("gmail.com"))) {
                return true;
            }
        }
        return false;
    }

    private OAuth2User createOAuth2User(OAuth2User oAuth2User, String role, Long id, String name, String faculty) {
        // Add ROLE_ prefix for Spring Security
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + role)
        );
        Map<String, Object> attributes = oAuth2User.getAttributes().entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        attributes.put("id", id);
        attributes.put("role", role);
        attributes.put("name", name);
        attributes.put("faculty", faculty != null ? faculty : "");

        return new DefaultOAuth2User(authorities, attributes, "email");
    }
}