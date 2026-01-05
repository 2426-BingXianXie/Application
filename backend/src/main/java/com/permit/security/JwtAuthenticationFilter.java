package com.permit.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * Intercepts every HTTP request to validate JWT tokens and set authentication context.
 * This filter runs once per request before Spring Security's authentication process.
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;
  private final CustomUserDetailsService userDetailsService;

  @Autowired
  public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
    this.jwtUtil = jwtUtil;
    this.userDetailsService = userDetailsService;
  }

  /**
   * Filter logic to extract and validate JWT token from request
   *
   * @param request     HTTP request
   * @param response    HTTP response
   * @param filterChain Filter chain to continue processing
   * @throws ServletException if servlet error occurs
   * @throws IOException      if I/O error occurs
   */
  @Override
  protected void doFilterInternal(
          @NonNull HttpServletRequest request,
          @NonNull HttpServletResponse response,
          @NonNull FilterChain filterChain
  ) throws ServletException, IOException {

    try {
      // Extract JWT token from request header
      String jwt = extractJwtFromRequest(request);

      // If token exists and is valid, authenticate the user
      if (StringUtils.hasText(jwt) && jwtUtil.validateToken(jwt)) {
        // Extract username from token
        String username = jwtUtil.extractUsername(jwt);

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // Validate token against user details
        if (jwtUtil.validateToken(jwt, userDetails)) {
          // Create authentication token
          UsernamePasswordAuthenticationToken authentication =
                  new UsernamePasswordAuthenticationToken(
                          userDetails,
                          null,
                          userDetails.getAuthorities()
                  );

          // Set additional details
          authentication.setDetails(
                  new WebAuthenticationDetailsSource().buildDetails(request)
          );

          // Set authentication in SecurityContext
          SecurityContextHolder.getContext().setAuthentication(authentication);

          logger.debug("Set Authentication for user: " + username);
        }
      }
    } catch (Exception ex) {
      logger.error("Could not set user authentication in security context", ex);
      // Continue filter chain even if authentication fails
      // The security configuration will handle unauthorized access
    }

    // Continue filter chain
    filterChain.doFilter(request, response);
  }

  /**
   * Extract JWT token from Authorization header
   *
   * @param request HTTP request
   * @return JWT token string or null if not found
   */
  private String extractJwtFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");

    // Check if Authorization header exists and starts with "Bearer "
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7); // Remove "Bearer " prefix
    }

    return null;
  }

  /**
   * Override to skip filter for certain paths (optional)
   * Can be used to skip authentication for public endpoints
   */
  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();

    // Skip filter for public endpoints
    return path.startsWith("/api/v1/auth/login") ||
            path.startsWith("/api/v1/auth/register") ||
            path.startsWith("/h2-console") ||
            path.startsWith("/actuator") ||
            path.equals("/error");
  }
}