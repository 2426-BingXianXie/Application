package gov.quincy.ma.permit.repository;

import gov.quincy.ma.permit.entity.Application;
import gov.quincy.ma.permit.entity.Application.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);

    List<Application> findByApplicantIdAndStatusOrderByCreatedAtDesc(Long applicantId, Status status);

    @Query("SELECT a FROM Application a JOIN FETCH a.permitType JOIN FETCH a.applicant ORDER BY a.createdAt DESC")
    List<Application> findAllWithDetails();
}
