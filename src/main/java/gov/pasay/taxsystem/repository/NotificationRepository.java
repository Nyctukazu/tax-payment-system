package gov.pasay.taxsystem.repository;

import gov.pasay.taxsystem.model.entity.NotificationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationModel, Long> {
    List<NotificationModel> findTop5ByOrderByCreatedAtDesc();
}
