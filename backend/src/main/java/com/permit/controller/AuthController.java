package com.permit.controller;

import com.permit.dto.auth.AuthResponse;
import com.permit.dto.auth.LoginRequest;
import com.permit.dto.auth.RegisterRequest;
import com.permit.dto.auth.UserDto;
import com.permit.security.UserPrincipal;
import com.permit.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * REST API endpoints for user authentication (login, register, logout)
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

  private final AuthService authService;

  @Autowired
  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  /**
   * Login endpoint
   * POST /api/v1/auth/login
   *
   * @param loginRequest Login credentials
   * @return JWT token and user information
   */
  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
    AuthResponse response = authService.login(loginRequest);
    return ResponseEntity.ok(response);
  }

  /**
   * Register endpoint
   * POST /api/v1/auth/register
   *
   * @param registerRequest Registration information
   * @return JWT token and user information
   */
  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
    // Don't catch exceptions here - let GlobalExceptionHandler handle them
    AuthResponse response = authService.register(registerRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  /**
   * Get current authenticated user
   * GET /api/v1/auth/me
   *
   * @param userPrincipal Current authenticated user
   * @return User information
   */
  @GetMapping("/me")
  public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
    if (userPrincipal == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    UserDto userDto = authService.getCurrentUser(userPrincipal.getEmail());
    return ResponseEntity.ok(userDto);
  }

  /**
   * Logout endpoint
   * POST /api/v1/auth/logout
   *
   * @param token JWT token to invalidate (optional for future token blacklisting)
   * @return Success message
   */
  @PostMapping("/logout")
  public ResponseEntity<String> logout(
          @RequestHeader(value = "Authorization", required = false) String token
  ) {
    try {
      if (token != null && token.startsWith("Bearer ")) {
        String jwt = token.substring(7);
        authService.logout(jwt);
      }
    } catch (Exception e) {
      // Log error but still return success
      System.err.println("Logout error: " + e.getMessage());
    }
    return ResponseEntity.ok("Logout successful");
  }

  /**
   * Refresh token endpoint
   * POST /api/v1/auth/refresh
   *
   * @param token Current JWT token
   * @return New JWT token
   */
  @PostMapping("/refresh")
  public ResponseEntity<AuthResponse> refreshToken(
          @RequestHeader("Authorization") String token
  ) {
    String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
    AuthResponse response = authService.refreshToken(jwt);
    return ResponseEntity.ok(response);
  }

  /**
   * Health check endpoint
   * GET /api/v1/auth/health
   */
  @GetMapping("/health")
  public ResponseEntity<String> health() {
    return ResponseEntity.ok("Auth service is running");
  }
}