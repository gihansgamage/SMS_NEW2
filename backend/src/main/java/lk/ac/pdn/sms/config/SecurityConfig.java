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
                        // --- PUBLIC ENDPOINTS (Allow Unauthenticated Access) ---
                        .requestMatchers(HttpMethod.GET, "/api/societies/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/societies/public/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/societies/active").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/societies/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/societies/renew").permitAll() // Ensure this matches controller

                        .requestMatchers(HttpMethod.GET, "/api/events/public/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/events/request").permitAll()

                        .requestMatchers("/api/validation/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/error", "/favicon.ico").permitAll()

                        // --- ADMIN ENDPOINTS (Require Authentication) ---
                        .requestMatchers("/api/admin/**").authenticated()
                        .requestMatchers("/api/events/admin/**").authenticated() // Protect admin event lists

                        .anyRequest().authenticated()
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200);
                        })
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