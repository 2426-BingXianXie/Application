package gov.quincy.ma.permit.service;

import gov.quincy.ma.permit.dto.AuthResponse;
import gov.quincy.ma.permit.dto.LoginRequest;
import gov.quincy.ma.permit.dto.RegisterRequest;
import gov.quincy.ma.permit.entity.User;
import gov.quincy.ma.permit.repository.UserRepository;
import gov.quincy.ma.permit.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(User.Role.APPLICANT);
        user = userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().name());
    }
}
