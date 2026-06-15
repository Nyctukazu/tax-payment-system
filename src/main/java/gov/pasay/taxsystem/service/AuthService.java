package gov.pasay.taxsystem.service;

import gov.pasay.taxsystem.repository.UserRepository;
import gov.pasay.taxsystem.model.entity.TaxpayerModel;
import gov.pasay.taxsystem.model.entity.AdminModel;
import gov.pasay.taxsystem.model.entity.User;
import gov.pasay.taxsystem.dto.AuthResponse;
import gov.pasay.taxsystem.dto.RegisterRequest;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepo; 

    public Optional<AuthResponse> login(String email, String inputRawPassword) {
        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isEmpty() || !passwordEncoder.matches(inputRawPassword, userOpt.get().getPassword())) {
            return Optional.empty();
        }

        User matchedUser = userOpt.get();
        AuthResponse response;
        
        if (matchedUser instanceof AdminModel admin) {
            response = new AuthResponse(
                "Welcome Admin!",
                "ADMIN",
                admin.getFirstName(), 
                admin.getAdminClass() != null ? admin.getAdminClass().name() : null
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

        return Optional.of(response);
    }

    @Transactional // Added for database transactional safety
    public String register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.email())) { // Optimized performance check
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
            taxpayer.setOwnerTin("PENDING"); // Safe fallback string so your database doesn't complain about nulls
            
            userRepo.save(taxpayer); 
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

            userRepo.save(admin); 
            return "Admin registered successfully!";
        }
        
        throw new IllegalArgumentException("Invalid role specified. Must be 'TAXPAYER' or 'ADMIN'.");
    }

    @Transactional // Ensures clean rollbacks if database initialization fails
    public Optional<User> loginOrRegisterGoogleUser(String email, String name) {
        Optional<User> existingUser = userRepo.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser;
        }

        try {
            TaxpayerModel newTaxpayer = new TaxpayerModel();
            newTaxpayer.setEmail(email);
            newTaxpayer.setOwnerTin("GOOGLE_AUTH"); // Explicitly setting a fallback to avoid null violations
            newTaxpayer.setMobileNumber(""); // Keep empty string instead of risking database nulls if configured strict
            
            if (name != null && name.contains(" ")) {
                String[] nameParts = name.split(" ", 2);
                newTaxpayer.setFirstName(nameParts[0]);
                newTaxpayer.setLastName(nameParts[1]);
            } else {
                newTaxpayer.setFirstName(name != null ? name : "Citizen");
                newTaxpayer.setLastName("");
            }
            newTaxpayer.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

            User savedUser = userRepo.save(newTaxpayer);
            return Optional.of(savedUser);
            
        } catch (Exception e) {
            // Re-throwing runtime exceptions inside Transactional ensures proper handling
            throw new RuntimeException("Critical failure processing Google auto-registration: " + e.getMessage(), e);
        }
    }
}
