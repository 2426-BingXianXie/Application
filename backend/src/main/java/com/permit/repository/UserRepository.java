package com.permit.repository;

import com.permit.entity.User;
import com.permit.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * User Repository
 * Data access layer for User entity operations.
 * Provides custom query methods for user management and authentication.
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  /**
   * Find user by email address (used for login)
   *
   * @param email Email address
   * @return Optional containing User if found
   */
  Optional<User> findByEmail(String email);

  /**
   * Check if email already exists in the system
   *
   * @param email Email address to check
   * @return true if email exists
   */
  Boolean existsByEmail(String email);

  /**
   * Find all users with a specific role
   *
   * @param role User role to filter by
   * @return List of users with the specified role
   */
  List<User> findByRole(UserRole role);

  /**
   * Find all active users
   *
   * @param isActive Active status
   * @return List of active/inactive users
   */
  List<User> findByIsActive(Boolean isActive);

  /**
   * Find all users by role and active status
   *
   * @param role     User role
   * @param isActive Active status
   * @return List of users matching criteria
   */
  List<User> findByRoleAndIsActive(UserRole role, Boolean isActive);

  /**
   * Find users with expired contractor licenses
   *
   * @param currentDate Current date/time
   * @return List of users with expired licenses
   */
  @Query("SELECT u FROM User u WHERE u.role = 'CONTRACTOR' AND u.licenseExpiration < :currentDate")
  List<User> findContractorsWithExpiredLicenses(@Param("currentDate") LocalDateTime currentDate);

  /**
   * Find users who haven't logged in since a specific date
   *
   * @param date Date threshold
   * @return List of inactive users
   */
  @Query("SELECT u FROM User u WHERE u.lastLogin < :date OR u.lastLogin IS NULL")
  List<User> findUsersInactiveSince(@Param("date") LocalDateTime date);

  /**
   * Count users by role
   *
   * @param role User role
   * @return Count of users with the specified role
   */
  Long countByRole(UserRole role);

  /**
   * Count active users
   *
   * @param isActive Active status
   * @return Count of active/inactive users
   */
  Long countByIsActive(Boolean isActive);

  /**
   * Find users by name (first or last name contains search term)
   *
   * @param searchTerm Search term
   * @return List of users matching the search
   */
  @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
          "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
  List<User> searchByName(@Param("searchTerm") String searchTerm);

  /**
   * Find users by company name
   *
   * @param companyName Company name
   * @return List of users from the specified company
   */
  List<User> findByCompanyNameContainingIgnoreCase(String companyName);

  /**
   * Find contractor by license number
   *
   * @param licenseNumber License number
   * @return Optional containing contractor if found
   */
  @Query("SELECT u FROM User u WHERE u.role = 'CONTRACTOR' AND u.licenseNumber = :licenseNumber")
  Optional<User> findContractorByLicenseNumber(@Param("licenseNumber") String licenseNumber);

  /**
   * Find users created between dates
   *
   * @param startDate Start date
   * @param endDate   End date
   * @return List of users created in date range
   */
  @Query("SELECT u FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate")
  List<User> findUsersCreatedBetween(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);

  /**
   * Check if user exists with given ID and is active
   *
   * @param id       User ID
   * @param isActive Active status
   * @return true if user exists and matches active status
   */
  Boolean existsByIdAndIsActive(Long id, Boolean isActive);

  /**
   * Find all verified users
   *
   * @param emailVerified Email verification status
   * @return List of users with specified verification status
   */
  List<User> findByEmailVerified(Boolean emailVerified);

  /**
   * Get user statistics by role
   *
   * @return List of role counts
   */
  @Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
  List<Object[]> getUserStatisticsByRole();

  /**
   * Find users who need license renewal reminder
   * (License expires within specified days)
   *
   * @param expirationThreshold Date threshold for expiration
   * @return List of users needing renewal
   */
  @Query("SELECT u FROM User u WHERE u.role = 'CONTRACTOR' " +
          "AND u.licenseExpiration BETWEEN CURRENT_TIMESTAMP AND :expirationThreshold " +
          "AND u.isActive = true")
  List<User> findUsersNeedingLicenseRenewal(@Param("expirationThreshold") LocalDateTime expirationThreshold);
}