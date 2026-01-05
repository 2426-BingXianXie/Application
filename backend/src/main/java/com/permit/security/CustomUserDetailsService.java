package com.permit.security;

import com.permit.entity.User;
import com.permit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Custom UserDetailsService Implementation
 * Loads user-specific data for Spring Security authentication.
 * Used by Spring Security to authenticate users during login.
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  @Autowired
  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Load user by username (email in our system)
   * This method is called by Spring Security during authentication
   *
   * @param email User's email address (used as username)
   * @return UserDetails object containing user information
   * @throws UsernameNotFoundException if user is not found
   */
  @Override
  @Transactional(readOnly = true)
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    // Find user by email
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException(
                    "User not found with email: " + email
            ));

    // Check if user account is active
    if (!user.getIsActive()) {
      throw new UsernameNotFoundException(
              "User account is inactive: " + email
      );
    }

    // Wrap User entity in UserPrincipal (UserDetails implementation)
    return new UserPrincipal(user);
  }

  /**
   * Load user by ID
   * Useful for token-based authentication where we have user ID
   *
   * @param userId User ID
   * @return UserDetails object
   * @throws UsernameNotFoundException if user is not found
   */
  @Transactional(readOnly = true)
  public UserDetails loadUserById(Long userId) throws UsernameNotFoundException {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException(
                    "User not found with ID: " + userId
            ));

    if (!user.getIsActive()) {
      throw new UsernameNotFoundException(
              "User account is inactive, ID: " + userId
      );
    }

    return new UserPrincipal(user);
  }
}