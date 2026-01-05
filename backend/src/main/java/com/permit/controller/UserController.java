package com.permit.controller;

import com.permit.dto.auth.RegisterRequest;
import com.permit.dto.auth.UserDto;
import com.permit.entity.User;
import com.permit.entity.UserRole;
import com.permit.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User Management Controller
 * REST API endpoints for user CRUD operations (Admin only)
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

  private final UserService userService;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  /**
   * Get all users (Admin only)
   * GET /api/v1/users
   */
  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userService.getAllUsers();
    return ResponseEntity.ok(users);
  }

  /**
   * Get user by ID (Admin only)
   * GET /api/v1/users/{id}
   */
  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<User> getUserById(@PathVariable Long id) {
    try {
      User user = userService.getUserById(id);
      return ResponseEntity.ok(user);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Create user with any role (Admin only)
   * POST /api/v1/users
   */
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<User> createUser(@Valid @RequestBody RegisterRequest request) {
    try {
      // Parse role from request or default to APPLICANT
      UserRole role = UserRole.APPLICANT;
      if (request.getRole() != null && !request.getRole().isEmpty()) {
        try {
          role = UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
          return ResponseEntity.badRequest().build();
        }
      }

      User user = userService.createUser(request, role);
      return ResponseEntity.status(HttpStatus.CREATED).body(user);
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  /**
   * Update user (Admin only)
   * PUT /api/v1/users/{id}
   */
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDto) {
    try {
      User user = userService.updateUser(id, userDto);
      return ResponseEntity.ok(user);
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  /**
   * Delete user (Admin only)
   * DELETE /api/v1/users/{id}
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    try {
      userService.deleteUser(id);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Activate/Deactivate user (Admin only)
   * PUT /api/v1/users/{id}/active
   */
  @PutMapping("/{id}/active")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<User> setUserActive(
          @PathVariable Long id,
          @RequestParam boolean active
  ) {
    try {
      User user = userService.setUserActive(id, active);
      return ResponseEntity.ok(user);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Get users by role (Admin only)
   * GET /api/v1/users/role/{role}
   */
  @GetMapping("/role/{role}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
    try {
      UserRole userRole = UserRole.valueOf(role.toUpperCase());
      List<User> users = userService.getUsersByRole(userRole);
      return ResponseEntity.ok(users);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  /**
   * Create default admin user (Development only - remove in production)
   * POST /api/v1/users/create-admin
   */
  @PostMapping("/create-admin")
  public ResponseEntity<String> createDefaultAdmin() {
    try {
      userService.createDefaultAdmin();
      return ResponseEntity.ok("Default admin created successfully");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Admin already exists");
    }
  }
}