package com.permit.config;

import com.permit.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Security Configuration
 * Configures Spring Security for JWT-based authentication with CORS support
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

  private final UserDetailsService userDetailsService;
  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final CorsConfigurationSource corsConfigurationSource;

  @Autowired
  public SecurityConfig(
          UserDetailsService userDetailsService,
          JwtAuthenticationFilter jwtAuthenticationFilter,
          CorsConfigurationSource corsConfigurationSource
  ) {
    this.userDetailsService = userDetailsService;
    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    this.corsConfigurationSource = corsConfigurationSource;
  }

  /**
   * Configure HTTP security
   */
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            // Enable CORS with custom configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // Disable CSRF for stateless JWT authentication
            .csrf(csrf -> csrf.disable())

            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                    // Public endpoints - no authentication required
                    .requestMatchers("/api/v1/auth/login").permitAll()
                    .requestMatchers("/api/v1/auth/register").permitAll()
                    .requestMatchers("/api/v1/auth/health").permitAll()
                    .requestMatchers("/api/v1/users/create-admin").permitAll()

                    // H2 Console (Development only - disable in production)
                    .requestMatchers("/h2-console/**").permitAll()

                    // Actuator endpoints
                    .requestMatchers("/actuator/health").permitAll()
                    .requestMatchers("/actuator/info").permitAll()

                    // Admin-only endpoints
                    .requestMatchers("/api/v1/users/**").hasRole("ADMIN")

                    // All other API endpoints require authentication
                    .requestMatchers("/api/v1/**").authenticated()

                    // Permit all other requests (for static resources, etc.)
                    .anyRequest().permitAll()
            )

            // Configure session management (stateless for JWT)
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Add custom authentication provider
            .authenticationProvider(authenticationProvider())

            // Add JWT authentication filter before Spring Security's filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            // Enable frame options for H2 console (Development only)
            .headers(headers -> headers
                    .frameOptions(frame -> frame.sameOrigin())
            );

    return http.build();
  }

  /**
   * Configure authentication provider
   */
  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  /**
   * Configure password encoder (BCrypt)
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /**
   * Expose AuthenticationManager as a bean
   */
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }
}