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
import java.util.Collections;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserSessionRepository userSessionRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;

        // Extract via standard Bearer header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } 
        // Fallback: Extract via browser cookies
        else if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("authToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // Validate and authenticate using the working .getRole() method
        if (token != null) {
            userSessionRepository.findByToken(token).ifPresent(session -> {
                if (session.getExpiryDate() != null && session.getExpiryDate().isAfter(LocalDateTime.now())) {
                    
                    // Reads 'role' string field directly from your entity database mapping
                    String assignedRoleFromDb = session.getRole(); 
                    
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            session.getEmail(),
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + assignedRoleFromDb))
                    );
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            });
        }

        filterChain.doFilter(request, response);
    }
}
