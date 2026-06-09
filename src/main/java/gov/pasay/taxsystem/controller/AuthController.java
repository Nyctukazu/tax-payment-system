package gov.pasay.taxsystem.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import gov.pasay.taxsystem.model.entity.User;
import gov.pasay.taxsystem.model.entity.AdminModel;
import gov.pasay.taxsystem.model.entity.TaxpayerModel;
import gov.pasay.taxsystem.service.AuthService;
import gov.pasay.taxsystem.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")   
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> authenticatedUserOpt = authService.login(request.email(), request.password());

        if (authenticatedUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        User user = authenticatedUserOpt.get();

        if (user instanceof AdminModel) {
            AdminModel admin = (AdminModel) user;
            return ResponseEntity.ok("Welcome Admin! Type: " + admin.getAdminClass());

        } else if (user instanceof TaxpayerModel) {
            return ResponseEntity.ok("Welcome Client! " + user.getFirstName());
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
