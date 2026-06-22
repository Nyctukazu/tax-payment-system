package gov.pasay.taxsystem.service;

import gov.pasay.taxsystem.repository.UserRepository;
import gov.pasay.taxsystem.repository.UserSessionRepository;
import gov.pasay.taxsystem.model.entity.TaxpayerModel;
import gov.pasay.taxsystem.model.entity.AdminModel;
import gov.pasay.taxsystem.model.entity.User;
import gov.pasay.taxsystem.model.entity.UserSession;
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

    @Autowired
    private UserSessionRepository userSessionRepo;

    @Transactional
    public Optional<AuthResponse> login(String email, String inputRawPassword) {
        Optional<User> userOpt = userRepo.findByEmail(email);

        System.out.println("🔍 User Found in DB: " + userOpt.get().getEmail());
        System.out.println("📥 Input Raw Password: " + inputRawPassword);
        System.out.println("💾 Database Password String: " + userOpt.get().getPassword());

        if (userOpt.isEmpty() || !passwordEncoder.matches(inputRawPassword, userOpt.get().getPassword())) {
            System.out.println("❌ Password match failed!");
            return Optional.empty();
        }

        User matchedUser = (User) org.hibernate.Hibernate.unproxy(userOpt.get());
        String token = UUID.randomUUID().toString();

        String className = matchedUser.getClass().getSimpleName();
        boolean isAdmin = className.contains("AdminModel");

        String userRole = isAdmin ? "ADMIN" : "TAXPAYER";
        UserSession session = new UserSession(token, matchedUser.getEmail(), userRole);
        userSessionRepo.saveAndFlush(session);
        AuthResponse response;
        
        if (matchedUser instanceof AdminModel admin) {
            response = new AuthResponse(
                "Welcome Admin!",
                "ADMIN",
                admin.getFirstName(), 
                admin.getAdminClass() != null ? admin.getAdminClass().name() : null,
                token
            );
        } else if (matchedUser instanceof TaxpayerModel taxpayer) {
            response = new AuthResponse(
                "Welcome Client!",
                "TAXPAYER",
                taxpayer.getFirstName(),
                null,
                token
            );
        } else {
            System.out.println("⚠️ Warning: Unproxied class name was: " + className);
            return Optional.empty();
        }

        return Optional.of(response);
    }


    @Transactional 
    public String register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.email())) {
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
            taxpayer.setOwnerTin("PENDING"); 
            
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

    @Transactional
    public Optional<AuthResponse> loginOrRegisterGoogleUser(String email, String name) {
        Optional<User> existingUser = userRepo.findByEmail(email);
        User userToAuthenticate;

        if (existingUser.isPresent()) {
            userToAuthenticate = existingUser.get();
        } else {

            try {
                TaxpayerModel newTaxpayer = new TaxpayerModel();
                newTaxpayer.setEmail(email);
                newTaxpayer.setOwnerTin("GOOGLE_AUTH");
                newTaxpayer.setMobileNumber(""); 
                
                if (name != null && name.contains(" ")) {
                    String[] nameParts = name.split(" ", 2);
                    newTaxpayer.setFirstName(nameParts[0]);
                    newTaxpayer.setLastName(nameParts[1]);
                } else {
                    newTaxpayer.setFirstName(name != null ? name : "Citizen");
                    newTaxpayer.setLastName("");
                }
                newTaxpayer.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                userToAuthenticate = userRepo.save(newTaxpayer);
                
            } catch (Exception e) {
                throw new RuntimeException("Critical failure processing Google auto-registration: " + e.getMessage(), e);
            }
        }

        String token = UUID.randomUUID().toString();

        UserSession googleSession = new UserSession(token, userToAuthenticate.getEmail(), "TAXPAYER");
        userSessionRepo.saveAndFlush(googleSession);

        AuthResponse response = new AuthResponse(
            "Google Authentication Successful",
            "TAXPAYER",
            userToAuthenticate.getFirstName(),
            null,
            token
        );

        return Optional.of(response);
    }
}
