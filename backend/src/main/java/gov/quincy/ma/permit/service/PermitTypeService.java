package gov.quincy.ma.permit.service;

import gov.quincy.ma.permit.dto.PermitTypeDto;
import gov.quincy.ma.permit.entity.PermitType;
import gov.quincy.ma.permit.repository.PermitTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PermitTypeService {

    private final PermitTypeRepository permitTypeRepository;

    public PermitTypeService(PermitTypeRepository permitTypeRepository) {
        this.permitTypeRepository = permitTypeRepository;
    }

    public List<PermitTypeDto> findAll() {
        return permitTypeRepository.findAllByOrderByCategoryAscNameAsc().stream()
                .map(PermitTypeDto::fromEntity)
                .collect(Collectors.toList());
    }

    public PermitTypeDto findBySlug(String slug) {
        return permitTypeRepository.findBySlug(slug)
                .map(PermitTypeDto::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException("Permit type not found: " + slug));
    }

    public PermitTypeDto findById(Long id) {
        return permitTypeRepository.findById(id)
                .map(PermitTypeDto::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException("Permit type not found: " + id));
    }
}
