package main.java.com.permit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main application class for the Permit Management System.
 * Entry point for the Spring Boot application.
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@SpringBootApplication
@EnableJpaRepositories
@EnableTransactionManagement
public class PermitManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(PermitManagementApplication.class, args);
	}
}