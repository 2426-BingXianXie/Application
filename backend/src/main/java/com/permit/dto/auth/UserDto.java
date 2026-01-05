package com.permit.dto.auth;

import com.permit.entity.UserRole;
import java.time.LocalDateTime;

public class UserDto {

  private Long id;
  private String firstName;
  private String lastName;
  private String email;
  private String phone;
  private UserRole role;
  private Boolean isActive;
  private Boolean emailVerified;
  private LocalDateTime lastLogin;
  private LocalDateTime createdAt;
  private String companyName;
  private String licenseNumber;
  private LocalDateTime licenseExpiration;

  // Constructors
  public UserDto() {}

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }

  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public UserRole getRole() { return role; }
  public void setRole(UserRole role) { this.role = role; }

  public Boolean getIsActive() { return isActive; }
  public void setIsActive(Boolean isActive) { this.isActive = isActive; }

  public Boolean getEmailVerified() { return emailVerified; }
  public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

  public LocalDateTime getLastLogin() { return lastLogin; }
  public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public String getCompanyName() { return companyName; }
  public void setCompanyName(String companyName) { this.companyName = companyName; }

  public String getLicenseNumber() { return licenseNumber; }
  public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

  public LocalDateTime getLicenseExpiration() { return licenseExpiration; }
  public void setLicenseExpiration(LocalDateTime licenseExpiration) {
    this.licenseExpiration = licenseExpiration;
  }

  public String getFullName() {
    return firstName + " " + lastName;
  }
}