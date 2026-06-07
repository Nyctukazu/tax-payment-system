package gov.pasay.taxsystem.repository;

import gov.pasay.taxsystem.model.TaxpayerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaxpayerRepository extends JpaRepository<TaxpayerModel, Long>{
    
}
