package com.permit.security;

import com.permit.entity.User;
import com.permit.entity.UserRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * UserPrincipal - Spring Security UserDetails Implementation
 * Wraps the User entity and provides Spring Security with authentication
 * and authorization information.
 *
 * NO LOMBOK - All getters/setters manually written
 */
public class UserPrincipal implements UserDetails {

  private final User user;

  public UserPrincipal(User user) {
    this.user = user;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singletonList(
            new SimpleGrantedAuthority(user.getRole().getAuthority())
    );
  }

  @Override
  public String getPassword() {
    return user.getPassword();
  }

  @Override
  public String getUsername() {
    return user.getEmail();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return user.getIsActive();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return user.getIsActive();
  }

  public User getUser() {
    return user;
  }

  public Long getId() {
    return user.getId();
  }

  public String getFirstName() {
    return user.getFirstName();
  }

  public String getLastName() {
    return user.getLastName();
  }

  public String getFullName() {
    return user.getFullName();
  }

  public String getEmail() {
    return user.getEmail();
  }

  public UserRole getRole() {
    return user.getRole();
  }

  public boolean isAdmin() {
    return user.isAdmin();
  }

  public boolean canReviewPermits() {
    return user.canReviewPermits();
  }

  public boolean canViewAllPermits() {
    return user.canViewAllPermits();
  }

  public String getPhone() {
    return user.getPhone();
  }

  public boolean isEmailVerified() {
    return user.getEmailVerified();
  }

  @Override
  public String toString() {
    return "UserPrincipal{" +
            "id=" + user.getId() +
            ", email='" + user.getEmail() + '\'' +
            ", role=" + user.getRole() +
            ", isActive=" + user.getIsActive() +
            '}';
  }
}