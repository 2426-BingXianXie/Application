package gov.quincy.ma.permit.controller;

import gov.quincy.ma.permit.dto.ApplicationDto;
import gov.quincy.ma.permit.dto.CreateApplicationRequest;
import gov.quincy.ma.permit.dto.DocumentDto;
import gov.quincy.ma.permit.dto.UpdateApplicationRequest;
import gov.quincy.ma.permit.service.ApplicationService;
import gov.quincy.ma.permit.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final DocumentService documentService;

    public ApplicationController(ApplicationService applicationService, DocumentService documentService) {
        this.applicationService = applicationService;
        this.documentService = documentService;
    }

    @PostMapping
    public ResponseEntity<ApplicationDto> create(@Valid @RequestBody CreateApplicationRequest request) {
        return ResponseEntity.ok(applicationService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ApplicationDto>> list() {
        return ResponseEntity.ok(applicationService.listMyApplications());
    }

    @GetMapping("/staff")
    public ResponseEntity<List<ApplicationDto>> listAllForStaff() {
        return ResponseEntity.ok(applicationService.listAllForStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApplicationDto> update(@PathVariable Long id, @RequestBody UpdateApplicationRequest request) {
        return ResponseEntity.ok(applicationService.update(id, request));
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<DocumentDto>> listDocuments(@PathVariable Long id) {
        applicationService.getById(id); // permission check
        return ResponseEntity.ok(documentService.findByApplicationId(id));
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<DocumentDto> uploadDocument(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        applicationService.getById(id); // permission check
        return ResponseEntity.ok(documentService.attachToApplication(id, file));
    }
}
