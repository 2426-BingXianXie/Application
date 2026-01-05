package com.permit.service;

import com.permit.dto.auth.AuthResponse;
import com.permit.dto.auth.LoginRequest;
import com.permit.dto.auth.RegisterRequest;
import com.permit.dto.auth.UserDto;

public interface AuthService {

  /**
   * Authenticate user and generate JWT token
   */
  AuthResponse login(LoginRequest request);

  /**
   * Register new user (APPLICANT role only)
   */
  AuthResponse register(RegisterRequest request);

  /**
   * Get current authenticated user
   */
  UserDto getCurrentUser(String email);

  /**
   * Logout user (optional - for token blacklisting)
   */
  void logout(String token);

  /**
   * Refresh JWT token
   */
  AuthResponse refreshToken(String token);
}