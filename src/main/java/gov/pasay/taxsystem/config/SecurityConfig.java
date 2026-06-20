package gov.pasay.taxsystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.CrossOriginOpenerPolicyHeaderWriter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/auth/**"))
            
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/portal", 
                    "/admin-login", 
                    "/client-login", 
                    "/client-forget", 
                    "/error", 
                    "/api/auth/**", 
                    "/css/**", 
                    "/js/**"
                ).permitAll()
                .anyRequest().authenticated()
            )

            .formLogin(form -> form
                .loginPage("/client-login")
                .permitAll()
            )
            
            .headers(headers -> headers
                .crossOriginOpenerPolicy(coop -> coop.policy(CrossOriginOpenerPolicyHeaderWriter.CrossOriginOpenerPolicy.SAME_ORIGIN_ALLOW_POPUPS))
                .frameOptions(frame -> frame.sameOrigin())
                .contentSecurityPolicy(csp -> csp.policyDirectives(
                    "script-src 'self' https://accounts.google.com; " +
                    "frame-src 'self' https://accounts.google.com; " +
                    "style-src 'self' 'unsafe-inline' https://accounts.google.com https://cdnjs.cloudflare.com; " +
                    "font-src 'self' https://cdnjs.cloudflare.com;"
                ))
            );

        return http.build();
    }

    @Bean
    public org.springframework.web.servlet.config.annotation.WebMvcConfigurer corsConfigurer() {
        return new org.springframework.web.servlet.config.annotation.WebMvcConfigurer() {
            @Override
            public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:8080", 
                        "http://127.0.0.1:8080",
                        "https://tax-payment-system-production.up.railway.app"    
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}