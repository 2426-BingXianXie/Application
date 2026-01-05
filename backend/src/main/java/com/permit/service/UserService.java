package com.permit.service;

import com.permit.dto.auth.RegisterRequest;
import com.permit.dto.auth.UserDto;
import com.permit.entity.User;
import com.permit.entity.UserRole;

import java.util.List;

public interface UserService {

  /**
   * Create user with any role (admin function)
   */
  User createUser(RegisterRequest request, UserRole role);

  /**
   * Get user by ID
   */
  User getUserById(Long id);

  /**
   * Get user by email
   */
  User getUserByEmail(String email);

  /**
   * Get all users
   */
  List<User> getAllUsers();

  /**
   * Update user
   */
  User updateUser(Long id, UserDto userDto);

  /**
   * Delete user
   */
  void deleteUser(Long id);

  /**
   * Create default admin user
   */
  void createDefaultAdmin();

  /**
   * Activate/Deactivate user
   */
  User setUserActive(Long id, boolean active);

  /**
   * Get users by role
   */
  List<User> getUsersByRole(UserRole role);
}