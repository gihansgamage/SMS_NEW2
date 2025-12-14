package lk.ac.pdn.sms.config;

import lk.ac.pdn.sms.repository.AdminUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class StartupDiagnostic {

    @Bean
    public CommandLineRunner diagnosticRunner(AdminUserRepository repo, Environment env) {
        return args -> {
            System.out.println("\n\n==========================================");
            System.out.println("🔍 STARTUP DIAGNOSTICS (DB CHECK)");
            System.out.println("==========================================");

            // 1. Verify DB Connection
            System.out.println("➤ Connected to URL: " + env.getProperty("spring.datasource.url"));

            // 2. Check User Data
            long count = repo.count();
            System.out.println("➤ Admin User Count: " + count);

            if (count == 0) {
                System.out.println("❌ CRITICAL: admin_users table is EMPTY! Login will fail.");
                System.out.println("   (Hint: Check if ddl-auto=create is wiping your DB)");
            } else {
                System.out.println("✅ Data found! Users currently in DB:");
                repo.findAll().forEach(u -> {
                    System.out.println("   - [" + u.getEmail() + "] Role: " + u.getRole() + " | Active: " + u.getIsActive());
                });
            }
            System.out.println("==========================================\n\n");
        };
    }
}