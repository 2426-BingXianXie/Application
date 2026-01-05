package com.permit.entity;

import com.permit.entity.base.BasePermit;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * User Entity
 * Represents a system user with authentication credentials and role-based permissions.
 * Users can be applicants, contractors, reviewers, or administrators.
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_email", columnList = "email", unique = true),
        @Index(name = "idx_user_role", columnList = "role"),
        @Index(name = "idx_user_active", columnList = "is_active")
})
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long id;

  @NotBlank(message = "First name is required")
  @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
  @Column(name = "first_name", nullable = false, length = 100)
  private String firstName;

  @NotBlank(message = "Last name is required")
  @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
  @Column(name = "last_name", nullable = false, length = 100)
  private String lastName;

  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  @Size(max = 255, message = "Email must not exceed 255 characters")
  @Column(name = "email", nullable = false, unique = true, length = 255)
  private String email;

  @Size(max = 20, message = "Phone number must not exceed 20 characters")
  @Column(name = "phone", length = 20)
  private String phone;

  @NotBlank(message = "Password is required")
  @Column(name = "password", nullable = false)
  private String password; // BCrypt encoded

  @Enumerated(EnumType.STRING)
  @Column(name = "role", nullable = false, length = 20)
  private UserRole role;

  @Column(name = "is_active", nullable = false)
  private Boolean isActive = true;

  @Column(name = "email_verified", nullable = false)
  private Boolean emailVerified = false;

  @Column(name = "last_login")
  private LocalDateTime lastLogin;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  // Relationship: User has many Permits (as applicant)
  @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<BasePermit> permits = new ArrayList<>();

  // Optional: Store additional profile information
  @Column(name = "profile_picture_url", length = 500)
  private String profilePictureUrl;

  @Column(name = "company_name", length = 255)
  private String companyName;

  @Column(name = "license_number", length = 50)
  private String licenseNumber;

  @Column(name = "license_expiration")
  private LocalDateTime licenseExpiration;

  // Constructors

  /**
   * Default constructor
   */
  public User() {
  }

  /**
   * Constructor with required fields
   *
   * @param firstName First name
   * @param lastName  Last name
   * @param email     Email address
   * @param password  Encoded password
   * @param role      User role
   */
  public User(String firstName, String lastName, String email, String password, UserRole role) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isActive = true;
    this.emailVerified = false;
  }

  // Business Methods

  /**
   * Get the user's full name
   *
   * @return Full name (firstName + lastName)
   */
  public String getFullName() {
    return firstName + " " + lastName;
  }

  /**
   * Check if user has admin privileges
   *
   * @return true if user is an admin
   */
  public boolean isAdmin() {
    return role == UserRole.ADMIN;
  }

  /**
   * Check if user can review permits
   *
   * @return true if user can review permits
   */
  public boolean canReviewPermits() {
    return role != null && role.canReviewPermits();
  }

  /**
   * Check if user can view all permits
   *
   * @return true if user can view all permits
   */
  public boolean canViewAllPermits() {
    return role != null && role.canViewAllPermits();
  }

  /**
   * Check if license is valid (for contractors)
   *
   * @return true if license is valid
   */
  public boolean hasValidLicense() {
    if (role != UserRole.CONTRACTOR) {
      return false;
    }
    return licenseNumber != null &&
            licenseExpiration != null &&
            licenseExpiration.isAfter(LocalDateTime.now());
  }

  /**
   * Update last login timestamp
   */
  public void updateLastLogin() {
    this.lastLogin = LocalDateTime.now();
  }

  /**
   * Activate user account
   */
  public void activate() {
    this.isActive = true;
  }

  /**
   * Deactivate user account
   */
  public void deactivate() {
    this.isActive = false;
  }

  /**
   * Verify user email
   */
  public void verifyEmail() {
    this.emailVerified = true;
  }

  // Getters and Setters

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public UserRole getRole() {
    return role;
  }

  public void setRole(UserRole role) {
    this.role = role;
  }

  public Boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(Boolean isActive) {
    this.isActive = isActive;
  }

  public Boolean getEmailVerified() {
    return emailVerified;
  }

  public void setEmailVerified(Boolean emailVerified) {
    this.emailVerified = emailVerified;
  }

  public LocalDateTime getLastLogin() {
    return lastLogin;
  }

  public void setLastLogin(LocalDateTime lastLogin) {
    this.lastLogin = lastLogin;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  public List<BasePermit> getPermits() {
    return permits;
  }

  public void setPermits(List<BasePermit> permits) {
    this.permits = permits;
  }

  public String getProfilePictureUrl() {
    return profilePictureUrl;
  }

  public void setProfilePictureUrl(String profilePictureUrl) {
    this.profilePictureUrl = profilePictureUrl;
  }

  public String getCompanyName() {
    return companyName;
  }

  public void setCompanyName(String companyName) {
    this.companyName = companyName;
  }

  public String getLicenseNumber() {
    return licenseNumber;
  }

  public void setLicenseNumber(String licenseNumber) {
    this.licenseNumber = licenseNumber;
  }

  public LocalDateTime getLicenseExpiration() {
    return licenseExpiration;
  }

  public void setLicenseExpiration(LocalDateTime licenseExpiration) {
    this.licenseExpiration = licenseExpiration;
  }

  // equals, hashCode, toString

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return Objects.equals(id, user.id) &&
            Objects.equals(email, user.email);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, email);
  }

  @Override
  public String toString() {
    return "User{" +
            "id=" + id +
            ", fullName='" + getFullName() + '\'' +
            ", email='" + email + '\'' +
            ", role=" + role +
            ", isActive=" + isActive +
            ", emailVerified=" + emailVerified +
            ", createdAt=" + createdAt +
            '}';
  }
}