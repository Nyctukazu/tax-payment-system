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

        // 1. Safe check first to avoid NoSuchElementException
        if (userOpt.isEmpty()) {
            System.out.println("❌ Login failed: Email not found: " + email);
            return Optional.empty();
        }

        User user = userOpt.get();
        System.out.println("📥 Input Raw Password: " + inputRawPassword);
        System.out.println("💾 Database Password String: " + user.getPassword());

        if (!passwordEncoder.matches(inputRawPassword, user.getPassword())) {
            System.out.println("❌ Login failed: Password match failed!");
            return Optional.empty();
        }

        // 2. Safely unproxy the Hibernate entity
        User matchedUser = (User) org.hibernate.Hibernate.unproxy(user);
        String className = matchedUser.getClass().getSimpleName();
        System.out.println("🔍 Unproxied class target detected: " + className);

        // 3. Robust role identification (Better to check explicit flags or properties if instanceof fails)
        boolean isAdmin = matchedUser instanceof AdminModel || className.contains("AdminModel");
        String userRole = isAdmin ? "ADMIN" : "TAXPAYER";
        String classification = null;
        String token = UUID.randomUUID().toString();

        AuthResponse response;

        // 4. Handle response payloads safely
        if (isAdmin) {
            AdminModel admin = (AdminModel) matchedUser;
            classification = (admin.getAdminClass() != null) ? admin.getAdminClass().name() : "STAFF";
            
            response = new AuthResponse(
                "Welcome Admin!",
                userRole,
                admin.getFirstName(), 
                classification,
                token
            );
        } else if (matchedUser instanceof TaxpayerModel taxpayer || className.contains("TaxpayerModel")) {
            TaxpayerModel taxpayer = (TaxpayerModel) matchedUser;
            response = new AuthResponse(
                "Welcome Client!",
                "TAXPAYER",
                taxpayer.getFirstName(),
                null,
                token
            );
        } else {
            System.out.println("⚠️ Warning: Unproxied class could not be cast. Class name was: " + className);
            return Optional.empty();
        }

        // 5. Build and commit the session data
        UserSession session = new UserSession(token, matchedUser.getEmail(), userRole, classification);
        userSessionRepo.saveAndFlush(session);

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

    /* 
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
    } */
}
