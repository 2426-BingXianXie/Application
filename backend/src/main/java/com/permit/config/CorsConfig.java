package com.permit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * CORS Configuration
 * Allows frontend to communicate with backend
 * Hardcoded origins for simplicity
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@Configuration
public class CorsConfig {

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // Allowed origins
    configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:4200",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:4200"
    ));

    // Allowed methods
    configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
    ));

    // Allowed headers
    configuration.setAllowedHeaders(Arrays.asList("*"));

    // Allow credentials (cookies, auth headers)
    configuration.setAllowCredentials(true);

    // Max age for preflight requests
    configuration.setMaxAge(3600L);

    // Exposed headers
    configuration.setExposedHeaders(Arrays.asList("Authorization"));

    // Register CORS configuration for all endpoints
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
  }
}