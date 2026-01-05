package com.permit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Invalid Token Exception
 * Thrown when JWT token is invalid, expired, or malformed
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InvalidTokenException extends RuntimeException {

  private String token;
  private TokenErrorType errorType;

  /**
   * Token error types
   */
  public enum TokenErrorType {
    EXPIRED("Token has expired"),
    MALFORMED("Token is malformed"),
    INVALID_SIGNATURE("Invalid token signature"),
    MISSING("Token is missing"),
    UNSUPPORTED("Token type not supported");

    private final String description;

    TokenErrorType(String description) {
      this.description = description;
    }

    public String getDescription() {
      return description;
    }
  }

  /**
   * Constructor with message
   *
   * @param message Error message
   */
  public InvalidTokenException(String message) {
    super(message);
  }

  /**
   * Constructor with message and cause
   *
   * @param message Error message
   * @param cause   Root cause
   */
  public InvalidTokenException(String message, Throwable cause) {
    super(message, cause);
  }

  /**
   * Constructor with error type
   *
   * @param errorType Type of token error
   */
  public InvalidTokenException(TokenErrorType errorType) {
    super(errorType.getDescription());
    this.errorType = errorType;
  }

  /**
   * Constructor with error type and token
   *
   * @param errorType Type of token error
   * @param token     The invalid token (truncated for security)
   */
  public InvalidTokenException(TokenErrorType errorType, String token) {
    super(errorType.getDescription());
    this.errorType = errorType;
    // Only store first 20 chars for security
    this.token = token != null && token.length() > 20
            ? token.substring(0, 20) + "..."
            : token;
  }

  /**
   * Static factory method for expired token
   *
   * @return InvalidTokenException
   */
  public static InvalidTokenException expired() {
    return new InvalidTokenException(TokenErrorType.EXPIRED);
  }

  /**
   * Static factory method for malformed token
   *
   * @return InvalidTokenException
   */
  public static InvalidTokenException malformed() {
    return new InvalidTokenException(TokenErrorType.MALFORMED);
  }

  /**
   * Static factory method for invalid signature
   *
   * @return InvalidTokenException
   */
  public static InvalidTokenException invalidSignature() {
    return new InvalidTokenException(TokenErrorType.INVALID_SIGNATURE);
  }

  /**
   * Static factory method for missing token
   *
   * @return InvalidTokenException
   */
  public static InvalidTokenException missing() {
    return new InvalidTokenException(TokenErrorType.MISSING);
  }

  /**
   * Static factory method for unsupported token
   *
   * @return InvalidTokenException
   */
  public static InvalidTokenException unsupported() {
    return new InvalidTokenException(TokenErrorType.UNSUPPORTED);
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public TokenErrorType getErrorType() {
    return errorType;
  }

  public void setErrorType(TokenErrorType errorType) {
    this.errorType = errorType;
  }
}