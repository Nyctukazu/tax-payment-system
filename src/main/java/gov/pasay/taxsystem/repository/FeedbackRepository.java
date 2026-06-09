package gov.pasay.taxsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.pasay.taxsystem.model.entity.FeedbackModel;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedbackModel, Long>{
    
}
