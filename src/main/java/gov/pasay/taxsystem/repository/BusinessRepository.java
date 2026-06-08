package gov.pasay.taxsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.pasay.taxsystem.model.entity.BusinessModel;

@Repository
public interface BusinessRepository extends JpaRepository<BusinessModel, Long> {
    
}
