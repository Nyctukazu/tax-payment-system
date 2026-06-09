package gov.pasay.taxsystem.service;

import gov.pasay.taxsystem.repository.TaxpayerRepository;
import gov.pasay.taxsystem.model.entity.TaxpayerModel;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TaxpayerRepository taxpayerRepo;

    public void registerUser(TaxpayerModel taxpayer){

        String rawPassword = taxpayer.getPassword();
        String hashedPassword = passwordEncoder.encode(rawPassword);
        taxpayer.setPassword(hashedPassword);
        taxpayerRepo.save(taxpayer);
    }
    
}
