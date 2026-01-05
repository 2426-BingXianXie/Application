package com.permit.service.impl;

import com.permit.dto.auth.RegisterRequest;
import com.permit.dto.auth.UserDto;
import com.permit.entity.User;
import com.permit.entity.UserRole;
import com.permit.exception.EmailAlreadyExistsException;
import com.permit.exception.UserNotFoundException;
import com.permit.repository.UserRepository;
import com.permit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Autowired
  public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public User createUser(RegisterRequest request, UserRole role) {
    // USE CUSTOM EXCEPTION
    if (userRepository.existsByEmail(request.getEmail())) {
      throw EmailAlreadyExistsException.forEmail(request.getEmail());
    }

    User user = new User();
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setEmail(request.getEmail());
    user.setPhone(request.getPhone());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(role != null ? role : UserRole.APPLICANT);
    user.setIsActive(true);
    user.setEmailVerified(false);
    user.setCompanyName(request.getCompanyName());
    user.setLicenseNumber(request.getLicenseNumber());

    return userRepository.save(user);
  }

  @Override
  @Transactional(readOnly = true)
  public User getUserById(Long id) {
    // USE CUSTOM EXCEPTION
    return userRepository.findById(id)
            .orElseThrow(() -> UserNotFoundException.byId(id));
  }

  @Override
  @Transactional(readOnly = true)
  public User getUserByEmail(String email) {
    // USE CUSTOM EXCEPTION
    return userRepository.findByEmail(email)
            .orElseThrow(() -> UserNotFoundException.byEmail(email));
  }

  @Override
  @Transactional(readOnly = true)
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  @Override
  public User updateUser(Long id, UserDto userDto) {
    User user = getUserById(id);

    if (userDto.getFirstName() != null) {
      user.setFirstName(userDto.getFirstName());
    }
    if (userDto.getLastName() != null) {
      user.setLastName(userDto.getLastName());
    }
    if (userDto.getEmail() != null && !userDto.getEmail().equals(user.getEmail())) {
      // USE CUSTOM EXCEPTION
      if (userRepository.existsByEmail(userDto.getEmail())) {
        throw EmailAlreadyExistsException.forEmail(userDto.getEmail());
      }
      user.setEmail(userDto.getEmail());
    }
    if (userDto.getPhone() != null) {
      user.setPhone(userDto.getPhone());
    }
    if (userDto.getRole() != null) {
      user.setRole(userDto.getRole());
    }
    if (userDto.getIsActive() != null) {
      user.setIsActive(userDto.getIsActive());
    }
    if (userDto.getCompanyName() != null) {
      user.setCompanyName(userDto.getCompanyName());
    }
    if (userDto.getLicenseNumber() != null) {
      user.setLicenseNumber(userDto.getLicenseNumber());
    }
    if (userDto.getLicenseExpiration() != null) {
      user.setLicenseExpiration(userDto.getLicenseExpiration());
    }

    return userRepository.save(user);
  }

  @Override
  public void deleteUser(Long id) {
    User user = getUserById(id);
    userRepository.delete(user);
  }

  @Override
  public void createDefaultAdmin() {
    if (userRepository.existsByEmail("admin@municipality.gov")) {
      return;
    }

    User admin = new User();
    admin.setFirstName("System");
    admin.setLastName("Administrator");
    admin.setEmail("admin@municipality.gov");
    admin.setPhone("555-0000");
    admin.setPassword(passwordEncoder.encode("Admin123!"));
    admin.setRole(UserRole.ADMIN);
    admin.setIsActive(true);
    admin.setEmailVerified(true);

    userRepository.save(admin);
  }

  @Override
  public User setUserActive(Long id, boolean active) {
    User user = getUserById(id);
    user.setIsActive(active);
    return userRepository.save(user);
  }

  @Override
  @Transactional(readOnly = true)
  public List<User> getUsersByRole(UserRole role) {
    return userRepository.findByRole(role);
  }
}
