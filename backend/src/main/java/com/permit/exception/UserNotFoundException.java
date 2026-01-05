package com.permit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException {

  private Long userId;
  private String email;

  public UserNotFoundException(String message) {
    super(message);
  }

  public UserNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public UserNotFoundException(Long userId) {
    super("User not found with ID: " + userId);
    this.userId = userId;
  }

  public UserNotFoundException(String email, boolean isEmail) {
    super("User not found with email: " + email);
    this.email = email;
  }

  public static UserNotFoundException byId(Long userId) {
    return new UserNotFoundException(userId);
  }

  public static UserNotFoundException byEmail(String email) {
    return new UserNotFoundException(email, true);
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}