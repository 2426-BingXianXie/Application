package gov.quincy.ma.permit.repository;

import gov.quincy.ma.permit.entity.PropertyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PropertyRecordRepository extends JpaRepository<PropertyRecord, Long> {

    List<PropertyRecord> findByAddressContainingIgnoreCase(String address);

    List<PropertyRecord> findByParcelId(String parcelId);

    @Query("SELECT p FROM PropertyRecord p WHERE LOWER(p.address) LIKE LOWER(CONCAT('%', :q, '%')) OR p.parcelId = :q")
    List<PropertyRecord> searchByAddressOrParcel(@Param("q") String query);
}
