package com.permit.service.impl;

import com.permit.dto.auth.AuthResponse;
import com.permit.dto.auth.LoginRequest;
import com.permit.dto.auth.RegisterRequest;
import com.permit.dto.auth.UserDto;
import com.permit.entity.User;
import com.permit.entity.UserRole;
import com.permit.exception.EmailAlreadyExistsException;
import com.permit.exception.UserNotFoundException;
import com.permit.repository.UserRepository;
import com.permit.security.JwtUtil;
import com.permit.security.UserPrincipal;
import com.permit.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final AuthenticationManager authenticationManager;

  @Autowired
  public AuthServiceImpl(
          UserRepository userRepository,
          PasswordEncoder passwordEncoder,
          JwtUtil jwtUtil,
          AuthenticationManager authenticationManager
  ) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
    this.authenticationManager = authenticationManager;
  }

  @Override
  public AuthResponse login(LoginRequest request) {
    // Authenticate user
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            )
    );

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
    User user = userPrincipal.getUser();

    user.updateLastLogin();
    userRepository.save(user);

    String token = jwtUtil.generateToken(userPrincipal);
    UserDto userDto = convertToDto(user);
    List<String> permissions = getPermissionsForRole(user.getRole());

    AuthResponse response = new AuthResponse(token, userDto, permissions);
    response.setMessage("Login successful");
    response.setExpiresIn(jwtUtil.getExpirationTime());

    return response;
  }

  @Override
  public AuthResponse register(RegisterRequest request) {
    // Check if email already exists - USE CUSTOM EXCEPTION
    if (userRepository.existsByEmail(request.getEmail())) {
      throw EmailAlreadyExistsException.forEmail(request.getEmail());
    }

    User user = new User();
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setEmail(request.getEmail());
    user.setPhone(request.getPhone());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(UserRole.APPLICANT);
    user.setIsActive(true);
    user.setEmailVerified(false);
    user.setCompanyName(request.getCompanyName());
    user.setLicenseNumber(request.getLicenseNumber());

    user = userRepository.save(user);

    UserPrincipal userPrincipal = new UserPrincipal(user);
    String token = jwtUtil.generateToken(userPrincipal);
    UserDto userDto = convertToDto(user);
    List<String> permissions = getPermissionsForRole(user.getRole());

    AuthResponse response = new AuthResponse(token, userDto, permissions);
    response.setMessage("Registration successful");
    response.setExpiresIn(jwtUtil.getExpirationTime());

    return response;
  }

  @Override
  @Transactional(readOnly = true)
  public UserDto getCurrentUser(String email) {
    // USE CUSTOM EXCEPTION
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> UserNotFoundException.byEmail(email));

    return convertToDto(user);
  }

  @Override
  public void logout(String token) {
    SecurityContextHolder.clearContext();
  }

  @Override
  public AuthResponse refreshToken(String token) {
    String email = jwtUtil.extractUsername(token);

    // USE CUSTOM EXCEPTION
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> UserNotFoundException.byEmail(email));

    UserPrincipal userPrincipal = new UserPrincipal(user);
    String newToken = jwtUtil.generateToken(userPrincipal);
    UserDto userDto = convertToDto(user);
    List<String> permissions = getPermissionsForRole(user.getRole());

    AuthResponse response = new AuthResponse(newToken, userDto, permissions);
    response.setMessage("Token refreshed");
    response.setExpiresIn(jwtUtil.getExpirationTime());

    return response;
  }

  private UserDto convertToDto(User user) {
    UserDto dto = new UserDto();
    dto.setId(user.getId());
    dto.setFirstName(user.getFirstName());
    dto.setLastName(user.getLastName());
    dto.setEmail(user.getEmail());
    dto.setPhone(user.getPhone());
    dto.setRole(user.getRole());
    dto.setIsActive(user.getIsActive());
    dto.setEmailVerified(user.getEmailVerified());
    dto.setLastLogin(user.getLastLogin());
    dto.setCreatedAt(user.getCreatedAt());
    dto.setCompanyName(user.getCompanyName());
    dto.setLicenseNumber(user.getLicenseNumber());
    dto.setLicenseExpiration(user.getLicenseExpiration());
    return dto;
  }

  private List<String> getPermissionsForRole(UserRole role) {
    List<String> permissions = new ArrayList<>();

    switch (role) {
      case ADMIN:
        permissions.add("read:permits");
        permissions.add("create:permits");
        permissions.add("update:permits");
        permissions.add("delete:permits");
        permissions.add("approve:permits");
        permissions.add("reject:permits");
        permissions.add("read:users");
        permissions.add("create:users");
        permissions.add("update:users");
        permissions.add("delete:users");
        permissions.add("read:reports");
        permissions.add("manage:system");
        break;

      case REVIEWER:
        permissions.add("read:permits");
        permissions.add("approve:permits");
        permissions.add("reject:permits");
        permissions.add("read:reports");
        break;

      case CONTRACTOR:
        permissions.add("read:permits");
        permissions.add("create:permits");
        permissions.add("update:permits");
        permissions.add("submit:permits");
        break;

      case APPLICANT:
        permissions.add("read:permits");
        permissions.add("create:permits");
        permissions.add("update:permits");
        permissions.add("submit:permits");
        break;
    }

    return permissions;
  }
}