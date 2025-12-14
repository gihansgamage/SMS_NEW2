package lk.ac.pdn.sms.config;

import lk.ac.pdn.sms.repository.AdminUserRepository;
import lk.ac.pdn.sms.repository.SocietyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(AdminUserRepository repo, SocietyRepository societyRepo) {
        return args -> {
            // Sample data generation has been removed as requested.
            // Data will only be fetched from the persistent MySQL database.
            // Initial Admin Users are handled by database_setup.sql
            System.out.println("Application started. Using existing database data.");
        };
    }
}