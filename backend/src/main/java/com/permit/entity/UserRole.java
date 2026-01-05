package com.permit.entity;

/**
 * User Role Enumeration
 * Defines the different roles users can have in the permit management system
 * with their respective descriptions and permissions.
 *
 * Role Hierarchy:
 * ADMIN > REVIEWER > CONTRACTOR > APPLICANT
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
public enum UserRole {
  /**
   * Administrator - Full system access
   * - Can manage all permits
   * - Can manage users
   * - Can approve/reject permits
   * - Can view all data and reports
   * - Can configure system settings
   */
  ADMIN("Administrator", "Full system access including user management and system configuration"),

  /**
   * Reviewer - Can review and approve permits
   * - Can view all permits
   * - Can approve/reject permits
   * - Can add notes and conditions
   * - Cannot manage users
   */
  REVIEWER("Reviewer", "Can review and approve/reject permit applications"),

  /**
   * Contractor - Can submit permits for clients
   * - Can submit permits on behalf of clients
   * - Can view permits they submitted
   * - Cannot approve permits
   * - Must maintain valid license
   */
  CONTRACTOR("Contractor", "Can submit permits on behalf of clients"),

  /**
   * Applicant - Standard user (default role)
   * - Can submit own permits
   * - Can view own permits only
   * - Cannot approve permits
   * - Cannot view other users' data
   */
  APPLICANT("Applicant", "Can submit and manage own permit applications");

  private final String displayName;
  private final String description;

  /**
   * Constructor for UserRole enum
   *
   * @param displayName User-friendly display name
   * @param description Detailed description of the role
   */
  UserRole(String displayName, String description) {
    this.displayName = displayName;
    this.description = description;
  }

  /**
   * Get the display name for the role
   *
   * @return Display name
   */
  public String getDisplayName() {
    return displayName;
  }

  /**
   * Get the description for the role
   *
   * @return Description
   */
  public String getDescription() {
    return description;
  }

  /**
   * Get Spring Security authority string
   * Format: ROLE_[ROLE_NAME]
   *
   * @return Authority string for Spring Security
   */
  public String getAuthority() {
    return "ROLE_" + this.name();
  }

  /**
   * Check if this role has admin privileges
   *
   * @return true if role is ADMIN
   */
  public boolean isAdmin() {
    return this == ADMIN;
  }

  /**
   * Check if this role can review permits
   *
   * @return true if role is ADMIN or REVIEWER
   */
  public boolean canReviewPermits() {
    return this == ADMIN || this == REVIEWER;
  }

  /**
   * Check if this role can view all permits
   *
   * @return true if role is ADMIN or REVIEWER
   */
  public boolean canViewAllPermits() {
    return this == ADMIN || this == REVIEWER;
  }

  /**
   * Check if this role can manage users
   *
   * @return true if role is ADMIN
   */
  public boolean canManageUsers() {
    return this == ADMIN;
  }

  /**
   * Get role from string value (case-insensitive)
   *
   * @param value String value of role
   * @return UserRole or null if not found
   */
  public static UserRole fromString(String value) {
    if (value == null || value.trim().isEmpty()) {
      return null;
    }

    try {
      return UserRole.valueOf(value.toUpperCase());
    } catch (IllegalArgumentException e) {
      return null;
    }
  }

  /**
   * Check if a string represents a valid role
   *
   * @param value String to check
   * @return true if valid role
   */
  public static boolean isValidRole(String value) {
    return fromString(value) != null;
  }
}