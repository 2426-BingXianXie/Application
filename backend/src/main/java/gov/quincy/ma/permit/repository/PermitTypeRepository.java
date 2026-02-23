package gov.quincy.ma.permit.repository;

import gov.quincy.ma.permit.entity.PermitType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermitTypeRepository extends JpaRepository<PermitType, Long> {

    List<PermitType> findAllByOrderByCategoryAscNameAsc();

    Optional<PermitType> findBySlug(String slug);
}
