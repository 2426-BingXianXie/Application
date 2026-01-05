package com.permit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Authentication Exception
 * Thrown when authentication fails (invalid credentials, etc.)
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class AuthenticationException extends RuntimeException {

  private String email;
  private String errorCode;

  /**
   * Constructor with message
   *
   * @param message Error message
   */
  public AuthenticationException(String message) {
    super(message);
  }

  /**
   * Constructor with message and cause
   *
   * @param message Error message
   * @param cause   Root cause
   */
  public AuthenticationException(String message, Throwable cause) {
    super(message, cause);
  }

  /**
   * Constructor with message and email
   *
   * @param message Error message
   * @param email   Email that failed authentication
   */
  public AuthenticationException(String message, String email) {
    super(message);
    this.email = email;
  }

  /**
   * Constructor with message, email, and error code
   *
   * @param message   Error message
   * @param email     Email that failed authentication
   * @param errorCode Specific error code
   */
  public AuthenticationException(String message, String email, String errorCode) {
    super(message);
    this.email = email;
    this.errorCode = errorCode;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getErrorCode() {
    return errorCode;
  }

  public void setErrorCode(String errorCode) {
    this.errorCode = errorCode;
  }
}