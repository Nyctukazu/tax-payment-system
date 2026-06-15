package gov.pasay.taxsystem.service;

import gov.pasay.taxsystem.repository.TaxpayerRepository;
import gov.pasay.taxsystem.repository.UserRepository;
import gov.pasay.taxsystem.model.entity.AdminModel;
import gov.pasay.taxsystem.model.entity.TaxpayerModel;
import gov.pasay.taxsystem.model.entity.User;
import gov.pasay.taxsystem.model.enums.AdminClassification;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public void processUser(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user instanceof TaxpayerModel taxpayer) {
                String tin = taxpayer.getOwnerTin();
            } else if (user instanceof AdminModel admin) {
                AdminClassification classification = admin.getAdminClass();
            }
        }
    }
}

