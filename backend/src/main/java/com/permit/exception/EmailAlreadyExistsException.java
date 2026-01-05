package com.permit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class EmailAlreadyExistsException extends RuntimeException {

  private String email;

  public EmailAlreadyExistsException(String message) {
    super(message);
  }

  public EmailAlreadyExistsException(String message, Throwable cause) {
    super(message, cause);
  }

  public EmailAlreadyExistsException(String email, boolean includeEmail) {
    super("Email already exists: " + email);
    this.email = email;
  }

  public static EmailAlreadyExistsException forEmail(String email) {
    return new EmailAlreadyExistsException(email, true);
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}