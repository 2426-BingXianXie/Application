package com.permit.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

  @NotBlank(message = "First name is required")
  @Size(min = 1, max = 100)
  private String firstName;

  @NotBlank(message = "Last name is required")
  @Size(min = 1, max = 100)
  private String lastName;

  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  private String email;

  @Size(max = 20)
  private String phone;

  @NotBlank(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters")
  private String password;

  private String role; // Defaults to APPLICANT
  private String companyName;
  private String licenseNumber;

  // Constructors
  public RegisterRequest() {}

  // Getters and Setters
  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }

  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }

  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }

  public String getCompanyName() { return companyName; }
  public void setCompanyName(String companyName) { this.companyName = companyName; }

  public String getLicenseNumber() { return licenseNumber; }
  public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
}