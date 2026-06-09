package gov.pasay.taxsystem.service;

import gov.pasay.taxsystem.repository.TaxpayerRepository;
import gov.pasay.taxsystem.repository.AdminRepository;
import gov.pasay.taxsystem.model.entity.TaxpayerModel;
import gov.pasay.taxsystem.model.entity.AdminModel;
import gov.pasay.taxsystem.model.entity.User;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TaxpayerRepository taxpayerRepo;

    @Autowired
    private AdminRepository adminRepo;

    public Optional<User> login(String email, String inputRawPassword) {
        User matchedUser = null;

        Optional<TaxpayerModel> taxpayerOpt = taxpayerRepo.findByEmail(email);
        if (taxpayerOpt.isPresent()) {
            matchedUser = taxpayerOpt.get();
        } else {
            Optional<AdminModel> adminOpt = adminRepo.findByEmail(email);
            if (adminOpt.isPresent()) {
                matchedUser = adminOpt.get();
            }
        }

        if (matchedUser == null) {
            return Optional.empty();
        }

        if (passwordEncoder.matches(inputRawPassword, matchedUser.getPassword())) {
            return Optional.of(matchedUser); 
        }
        return Optional.empty();
    }

}
