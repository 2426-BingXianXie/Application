// backend/src/main/java/com/permit/config/DataInitializer.java
package com.permit.config;

import com.permit.entity.User;
import com.permit.entity.UserRole;
import com.permit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

  @Bean
  CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    return args -> {
      if (!userRepository.existsByEmail("admin@municipality.gov")) {
        User admin = new User();
        admin.setFirstName("System");
        admin.setLastName("Administrator");
        admin.setEmail("admin@municipality.gov");
        admin.setPassword(passwordEncoder.encode("Admin123!"));
        admin.setRole(UserRole.ADMIN);
        admin.setIsActive(true);
        admin.setEmailVerified(true);

        userRepository.save(admin);
        System.out.println("Default admin user created: admin@municipality.gov / Admin123!");
      }
    };
  }
}