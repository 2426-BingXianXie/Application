package gov.quincy.ma.permit.controller;

import gov.quincy.ma.permit.dto.AuthResponse;
import gov.quincy.ma.permit.dto.LoginRequest;
import gov.quincy.ma.permit.dto.RegisterRequest;
import gov.quincy.ma.permit.repository.UserRepository;
import gov.quincy.ma.permit.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal(expression = "principal") Object principal) {
        String email = principal instanceof String ? (String) principal : null;
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(Map.<String, Object>of(
                        "email", user.getEmail(),
                        "name", user.getName(),
                        "role", user.getRole().name()
                )))
                .orElse(ResponseEntity.status(401).build());
    }
}
