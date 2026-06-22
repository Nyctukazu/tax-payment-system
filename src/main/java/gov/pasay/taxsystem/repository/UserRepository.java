package gov.pasay.taxsystem.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import gov.pasay.taxsystem.model.entity.User;
import gov.pasay.taxsystem.model.enums.AccountStatus;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByStatusNot(AccountStatus status);

}
