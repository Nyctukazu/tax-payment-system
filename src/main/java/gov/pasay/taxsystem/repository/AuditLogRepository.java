package gov.pasay.taxsystem.repository;

import gov.pasay.taxsystem.model.entity.AuditLogModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLogModel, Long> {
    List<AuditLogModel> findTop10ByOrderByTimestampDesc();
    
}
