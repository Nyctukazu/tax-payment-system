package gov.pasay.taxsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.pasay.taxsystem.model.entity.TaxpayerModel;

@Repository
public interface TaxpayerRepository extends JpaRepository<TaxpayerModel, Long>{
    
}
