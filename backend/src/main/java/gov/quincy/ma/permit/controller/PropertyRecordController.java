package gov.quincy.ma.permit.controller;

import gov.quincy.ma.permit.dto.PropertyRecordDto;
import gov.quincy.ma.permit.repository.PropertyRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/property-records")
public class PropertyRecordController {

    private final PropertyRecordRepository propertyRecordRepository;

    public PropertyRecordController(PropertyRecordRepository propertyRecordRepository) {
        this.propertyRecordRepository = propertyRecordRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyRecordDto>> search(@RequestParam(required = false) String q) {
        if (q == null || q.isBlank()) {
            return ResponseEntity.ok(propertyRecordRepository.findAll().stream()
                    .map(PropertyRecordDto::fromEntity)
                    .collect(Collectors.toList()));
        }
        List<PropertyRecordDto> results = propertyRecordRepository.searchByAddressOrParcel(q).stream()
                .map(PropertyRecordDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }
}
