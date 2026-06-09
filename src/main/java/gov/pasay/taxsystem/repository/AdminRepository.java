package gov.pasay.taxsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import gov.pasay.taxsystem.model.entity.AdminModel;

@Repository
public interface AdminRepository extends JpaRepository<AdminModel, Long>{
    Optional<AdminModel> findByEmail(String email);
}
