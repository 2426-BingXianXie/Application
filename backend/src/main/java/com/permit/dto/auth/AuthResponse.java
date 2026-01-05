package com.permit.dto.auth;

import java.util.List;

public class AuthResponse {

  private String token;
  private String type = "Bearer";
  private UserDto user;
  private List<String> permissions;
  private String message;
  private Long expiresIn;

  // Constructors
  public AuthResponse() {}

  public AuthResponse(String token, UserDto user) {
    this.token = token;
    this.user = user;
  }

  public AuthResponse(String token, UserDto user, List<String> permissions) {
    this.token = token;
    this.user = user;
    this.permissions = permissions;
  }

  // Getters and Setters
  public String getToken() { return token; }
  public void setToken(String token) { this.token = token; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public UserDto getUser() { return user; }
  public void setUser(UserDto user) { this.user = user; }

  public List<String> getPermissions() { return permissions; }
  public void setPermissions(List<String> permissions) { this.permissions = permissions; }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }

  public Long getExpiresIn() { return expiresIn; }
  public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
}