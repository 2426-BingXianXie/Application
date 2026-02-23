package gov.quincy.ma.permit.repository;

import gov.quincy.ma.permit.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByApplicationIdIsNullAndCategoryOrderByNameAsc(String category);

    List<Document> findByApplicationIdIsNullAndNameContainingIgnoreCaseOrderByNameAsc(String name);

    List<Document> findByApplicationIdIsNullOrderByNameAsc();

    List<Document> findByApplicationId(Long applicationId);
}
