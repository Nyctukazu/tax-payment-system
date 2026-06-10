package gov.pasay.taxsystem.service;

import gov.pasay.taxsystem.repository.TaxpayerRepository;
import gov.pasay.taxsystem.repository.AdminRepository;
import gov.pasay.taxsystem.model.entity.TaxpayerModel;
import gov.pasay.taxsystem.model.entity.AdminModel;
import gov.pasay.taxsystem.model.entity.User;
import gov.pasay.taxsystem.dto.AuthResponse;
import gov.pasay.taxsystem.dto.RegisterRequest;

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

        if (matchedUser == null || !passwordEncoder.matches(inputRawPassword, matchedUser.getPassword())) {
            return Optional.empty();
        }

        AuthResponse response;
        if (matchedUser instanceof AdminModel admin) {
            response = new AuthResponse(
                "Welcome Admin!",
                "ADMIN",
                admin.getFirstName().toString(),
                admin.getAdminClass().name()
            );
        } else if (matchedUser instanceof TaxpayerModel taxpayer) {
            response = new AuthResponse(
                "Welcome Client!",
                "TAXPAYER",
                taxpayer.getFirstName(),
                null           
            );
        } else {
            return Optional.empty();
        }

        return Optional.empty();
    }

    public String register(RegisterRequest request) {
        
        if (taxpayerRepo.findByEmail(request.email()).isPresent() ||
            adminRepo.findByEmail(request.email()).isPresent()) {
                throw new IllegalArgumentException("Email is already registered");
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        if ("TAXPAYER".equalsIgnoreCase(request.accountType())) {
            TaxpayerModel taxpayer = new TaxpayerModel();

            taxpayer.setEmail(request.email());
            taxpayer.setPassword(encodedPassword);
            taxpayer.setFirstName(request.firstName());
            taxpayer.setLastName(request.lastName());
            taxpayer.setMobileNumber(request.mobileNumber());
            taxpayerRepo.save(taxpayer);
            
            return "Taxpayer registered successfully!";
        }

        else if ("ADMIN".equalsIgnoreCase(request.accountType())) {
            AdminModel admin = new AdminModel();

            admin.setEmail(request.email());
            admin.setPassword(encodedPassword);
            admin.setFirstName(request.firstName());
            admin.setLastName(request.lastName());
            admin.setMobileNumber(request.mobileNumber());

            if (request.adminClass() == null) {
                throw new IllegalArgumentException("Admin classification is required for Admin registration.");
            }
            admin.setAdminClass(request.adminClass());

            adminRepo.save(admin);
            return "Admin registered successfully!";
        }
        throw new IllegalArgumentException("Invalid role specified.  Must be 'TAXPAYER' or 'ADMIN'.");
    }
}
