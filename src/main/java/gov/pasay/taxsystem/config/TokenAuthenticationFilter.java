package gov.pasay.taxsystem.config;

import gov.pasay.taxsystem.model.entity.UserSession;
import gov.pasay.taxsystem.repository.UserSessionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserSessionRepository userSessionRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;
        String source = "NONE";

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            source = "AUTHORIZATION HEADER";
        } 
        else if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("authToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                    source = "BROWSER COOKIE";
                    break;
                }
            }
        }

        if (token != null) {
            System.out.println("🔍 [FILTER CHECK] Detected token from source: " + source + " | Token: [" + token + "]");
            userSessionRepository.findByToken(token).ifPresent(session -> {
                if (session.getExpiryDate() != null && session.getExpiryDate().isAfter(LocalDateTime.now())) {
                    
                    // 1. Initialize a clean dynamic list for authorities
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();

                    // 2. Read the core role column (Now holds flat "ADMIN" or "TAXPAYER")
                    String rawRole = session.getRole(); 
                    if (rawRole != null) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + rawRole.trim().toUpperCase()));
                    }

                    // 3. Read the separate admin classification column (Holds "SUPERADMIN", "CLERK", etc.)
                    // Ensure session.getAdminClassification() matches your exact field getter name!
                    String classification = session.getAdminClass(); 
                    if (classification != null && !classification.trim().isEmpty()) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + classification.trim().toUpperCase()));
                    }
                    
                    // 🔍 This will print beautiful clean tokens: [ROLE_ADMIN, ROLE_SUPERADMIN]
                    System.out.println("✅ [FILTER CHECK] Authorities successfully mapped: " + authorities);
                    
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            session.getEmail(),
                            null,
                            authorities
                    );
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            });

        
        }

        filterChain.doFilter(request, response);
    }
}
