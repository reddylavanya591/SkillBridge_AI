package com.skillbridge.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String idToken = authHeader.substring(7).trim();

            try {
                // If Firebase is initialized with credentials, verify server token
                // In local dev/mock or direct test tokens:
                String uid;
                String role = "ROLE_STUDENT";

                if (idToken.startsWith("user-") || idToken.equals("student@skillbridge.io") || idToken.equals("admin")) {
                    // Local dev token parsing
                    uid = idToken;
                    if (idToken.contains("admin") || idToken.equals("rajusurna18@gmail.com")) {
                        role = "ROLE_ADMIN";
                    }
                } else {
                    FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
                    uid = decodedToken.getUid();
                    String email = decodedToken.getEmail();
                    if ("rajusurna18@gmail.com".equalsIgnoreCase(email) || Boolean.TRUE.equals(decodedToken.getClaims().get("admin"))) {
                        role = "ROLE_ADMIN";
                    }
                }

                List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(uid, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                // Token invalid or uninitialized
                logger.warn("Firebase token authentication failed: " + e.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
