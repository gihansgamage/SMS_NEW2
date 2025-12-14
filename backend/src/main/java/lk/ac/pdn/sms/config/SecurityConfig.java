package lk.ac.pdn.sms.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authz -> authz
                        // --- PUBLIC ACCESS (Crucial for Forms) ---
                        .requestMatchers(HttpMethod.GET, "/api/societies/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/societies/active").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/societies/latest-data").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/societies/register").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/renewals/submit").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/renewals/latest-data").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/events/request").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/events/validate-applicant").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/events/applicant-details").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/events/public/**").permitAll()

                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/validation/**").permitAll()
                        .requestMatchers("/error", "/favicon.ico").permitAll()

                        // --- ADMIN ACCESS ---
                        .requestMatchers("/api/admin/**").authenticated()
                        .requestMatchers("/api/events/admin/**").authenticated()
                        .requestMatchers("/api/renewals/admin/**").authenticated()

                        .anyRequest().authenticated()
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(frontendUrl, "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}