package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.entity.AdminUser;
import lk.ac.pdn.sms.repository.AdminUserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomOidcUserService extends OidcUserService {

    private final AdminUserRepository adminUserRepository;

    public CustomOidcUserService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. Let default service load user from Google first
        OidcUser oidcUser = super.loadUser(userRequest);
        String googleEmail = oidcUser.getEmail();

        System.out.println("\n\n==========================================");
        System.out.println("🚀 OIDC LOGIN ATTEMPT (Google)");
        System.out.println("➤ Email from Google: " + googleEmail);

        if (googleEmail == null) {
            throw new OAuth2AuthenticationException("Email not found from Google provider");
        }

        // 2. Database Lookup with Fuzzy Matching
        AdminUser adminUser = adminUserRepository.findByEmail(googleEmail).orElse(null);

        if (adminUser == null) {
            System.out.println("➤ Direct DB lookup failed. Trying fuzzy match...");
            // Fallback for case sensitivity or googlemail vs gmail
            List<AdminUser> allUsers = adminUserRepository.findAll();
            for (AdminUser u : allUsers) {
                if (emailsMatch(u.getEmail(), googleEmail)) {
                    adminUser = u;
                    System.out.println("✅ Match found via fuzzy search: " + u.getEmail());
                    break;
                }
            }
        }

        // 3. Validation
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

        // 4. Map Roles correctly
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + adminUser.getRole().name())
        );

        // 5. Return OidcUser with Database Roles
        return new DefaultOidcUser(authorities, oidcUser.getIdToken(), oidcUser.getUserInfo());
    }

    // Robust email matcher
    private boolean emailsMatch(String dbEmail, String googleEmail) {
        if (dbEmail == null || googleEmail == null) return false;
        String cleanDb = dbEmail.trim().toLowerCase();
        String cleanGoogle = googleEmail.trim().toLowerCase();

        if (cleanDb.equals(cleanGoogle)) return true;

        // Check for gmail/googlemail alias
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
}