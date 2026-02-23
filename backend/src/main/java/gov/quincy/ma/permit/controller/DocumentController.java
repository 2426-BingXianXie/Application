package gov.quincy.ma.permit.controller;

import gov.quincy.ma.permit.dto.DocumentDto;
import gov.quincy.ma.permit.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentDto>> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(documentService.searchByName(search));
        }
        return ResponseEntity.ok(documentService.listByCategory(category));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> categories() {
        return ResponseEntity.ok(documentService.listCategories());
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> getFile(@PathVariable Long id) {
        Resource resource = documentService.getFile(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
