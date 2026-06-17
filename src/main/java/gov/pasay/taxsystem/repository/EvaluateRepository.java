package gov.pasay.taxsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import gov.pasay.taxsystem.model.entity.EvaluateModel;

public interface EvaluateRepository extends JpaRepository<EvaluateModel, String> {
    @Query("SELECT e FROM EvaluateModel e JOIN FETCH e.business b JOIN FETCH b.taxpayer")
    List<EvaluateModel> findAllWithDetails();
    
}
