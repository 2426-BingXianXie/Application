package gov.quincy.ma.permit.controller;

import gov.quincy.ma.permit.dto.PermitTypeDto;
import gov.quincy.ma.permit.service.PermitTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permit-types")
public class PermitTypeController {

    private final PermitTypeService permitTypeService;

    public PermitTypeController(PermitTypeService permitTypeService) {
        this.permitTypeService = permitTypeService;
    }

    @GetMapping
    public ResponseEntity<List<PermitTypeDto>> list() {
        return ResponseEntity.ok(permitTypeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PermitTypeDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(permitTypeService.findById(id));
    }

    @GetMapping("/by-slug/{slug}")
    public ResponseEntity<PermitTypeDto> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(permitTypeService.findBySlug(slug));
    }
}
