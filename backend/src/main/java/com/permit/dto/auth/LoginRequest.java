package com.permit.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Login Request DTO
 * Contains credentials for user authentication
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
public class LoginRequest {

  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  private String email;

  @NotBlank(message = "Password is required")
  private String password;

  // Constructors
  public LoginRequest() {
  }

  public LoginRequest(String email, String password) {
    this.email = email;
    this.password = password;
  }

  // Getters and Setters
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  @Override
  public String toString() {
    return "LoginRequest{" +
            "email='" + email + '\'' +
            ", password='[PROTECTED]'" +
            '}';
  }
}