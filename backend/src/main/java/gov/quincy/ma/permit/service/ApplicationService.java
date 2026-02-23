package gov.quincy.ma.permit.service;

import gov.quincy.ma.permit.dto.ApplicationDto;
import gov.quincy.ma.permit.dto.CreateApplicationRequest;
import gov.quincy.ma.permit.dto.UpdateApplicationRequest;
import gov.quincy.ma.permit.entity.Application;
import gov.quincy.ma.permit.entity.User;
import gov.quincy.ma.permit.repository.ApplicationRepository;
import gov.quincy.ma.permit.repository.PermitTypeRepository;
import gov.quincy.ma.permit.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final PermitTypeRepository permitTypeRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              UserRepository userRepository,
                              PermitTypeRepository permitTypeRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.permitTypeRepository = permitTypeRepository;
    }

    private String currentUserEmail() {
        Object p = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return p instanceof String ? (String) p : null;
    }

    private boolean isStaff() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> "ROLE_STAFF".equals(a.getAuthority()));
    }

    @Transactional
    public ApplicationDto create(CreateApplicationRequest request) {
        String email = currentUserEmail();
        if (email == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User applicant = userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        var permitType = permitTypeRepository.findById(request.getPermitTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid permit type"));

        Application app = new Application();
        app.setApplicant(applicant);
        app.setPermitType(permitType);
        app.setFormData(request.getFormData());
        app.setStatus(request.isSubmit() ? Application.Status.SUBMITTED : Application.Status.DRAFT);
        if (request.isSubmit()) app.setSubmittedAt(Instant.now());
        app = applicationRepository.save(app);
        return ApplicationDto.fromEntity(app);
    }

    public List<ApplicationDto> listMyApplications() {
        String email = currentUserEmail();
        if (email == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return applicationRepository.findByApplicantIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(ApplicationDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> listAllForStaff() {
        if (!isStaff()) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return applicationRepository.findAllWithDetails().stream()
                .map(ApplicationDto::fromEntity)
                .collect(Collectors.toList());
    }

    public ApplicationDto getById(Long id) {
        Application app = applicationRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        String email = currentUserEmail();
        if (email == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        if (!isStaff() && !app.getApplicant().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return ApplicationDto.fromEntity(app);
    }

    @Transactional
    public ApplicationDto update(Long id, UpdateApplicationRequest request) {
        Application app = applicationRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        String email = currentUserEmail();
        if (email == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        if (isStaff()) {
            if (request.getStatus() != null) {
                app.setStatus(Application.Status.valueOf(request.getStatus()));
                app.setReviewedAt(Instant.now());
                app.setReviewer(userRepository.findByEmail(email).orElse(null));
            }
            if (request.getStaffNotes() != null) app.setStaffNotes(request.getStaffNotes());
        } else {
            if (!app.getApplicant().getEmail().equals(email)) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            if (app.getStatus() != Application.Status.DRAFT) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot edit submitted application");
            if (request.getFormData() != null) app.setFormData(request.getFormData());
            if (Boolean.TRUE.equals(request.getSubmit())) {
                app.setStatus(Application.Status.SUBMITTED);
                app.setSubmittedAt(Instant.now());
            }
        }
        app.setUpdatedAt(Instant.now());
        app = applicationRepository.save(app);
        return ApplicationDto.fromEntity(app);
    }
}
