package com.permit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler
 * Centralized exception handling for all REST controllers
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * Error response structure
   */
  public static class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> validationErrors;

    public ErrorResponse() {
      this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(HttpStatus status, String message, String path) {
      this.timestamp = LocalDateTime.now();
      this.status = status.value();
      this.error = status.getReasonPhrase();
      this.message = message;
      this.path = path;
    }

    // Getters and Setters
    public LocalDateTime getTimestamp() {
      return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
      this.timestamp = timestamp;
    }

    public int getStatus() {
      return status;
    }

    public void setStatus(int status) {
      this.status = status;
    }

    public String getError() {
      return error;
    }

    public void setError(String error) {
      this.error = error;
    }

    public String getMessage() {
      return message;
    }

    public void setMessage(String message) {
      this.message = message;
    }

    public String getPath() {
      return path;
    }

    public void setPath(String path) {
      this.path = path;
    }

    public Map<String, String> getValidationErrors() {
      return validationErrors;
    }

    public void setValidationErrors(Map<String, String> validationErrors) {
      this.validationErrors = validationErrors;
    }
  }

  /**
   * Handle Authentication Exception
   */
  @ExceptionHandler(AuthenticationException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public ResponseEntity<ErrorResponse> handleAuthenticationException(
          AuthenticationException ex,
          WebRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.UNAUTHORIZED,
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Handle User Not Found Exception
   */
  @ExceptionHandler(UserNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ResponseEntity<ErrorResponse> handleUserNotFoundException(
          UserNotFoundException ex,
          WebRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND,
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  /**
   * Handle Email Already Exists Exception
   */
  @ExceptionHandler(EmailAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public ResponseEntity<ErrorResponse> handleEmailAlreadyExistsException(
          EmailAlreadyExistsException ex,
          WebRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT,
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  /**
   * Handle Invalid Token Exception
   */
  @ExceptionHandler(InvalidTokenException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public ResponseEntity<ErrorResponse> handleInvalidTokenException(
          InvalidTokenException ex,
          WebRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.UNAUTHORIZED,
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Handle Spring Security BadCredentialsException
   */
  @ExceptionHandler(BadCredentialsException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public ResponseEntity<ErrorResponse> handleBadCredentialsException(
          BadCredentialsException ex,
          WebRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.UNAUTHORIZED,
            "Invalid email or password",
            request.getDescription(false).replace("uri=", "")
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Handle Spring Security UsernameNotFoundException
   */
  @ExceptionHandler(UsernameNotFoundException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public ResponseEntity<ErrorResponse> handleUsernameNotFoundException(
          UsernameNotFoundException ex,
          WebRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.UNAUTHORIZED,
            "Invalid email or password", // Don't reveal if user exists
            request.getDescription(false).replace("uri=", "")
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Handle Validation Exceptions
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(
          MethodArgumentNotValidException ex,
          WebRequest request
  ) {
    Map<String, String> validationErrors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      validationErrors.put(fieldName, errorMessage);
    });

    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST,
            "Validation failed",
            request.getDescription(false).replace("uri=", "")
    );
    errorResponse.setValidationErrors(validationErrors);

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  /**
   * Handle Illegal Argument Exception
   */
  @ExceptionHandler(IllegalArgumentException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
          IllegalArgumentException ex,
          WebRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST,
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  /**
   * Handle Generic Runtime Exception
   */
  @ExceptionHandler(RuntimeException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseEntity<ErrorResponse> handleRuntimeException(
          RuntimeException ex,
          WebRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred",
            request.getDescription(false).replace("uri=", "")
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /**
   * Handle Generic Exception (catch-all)
   */
  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseEntity<ErrorResponse> handleGlobalException(
          Exception ex,
          WebRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred",
            request.getDescription(false).replace("uri=", "")
    );
    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}