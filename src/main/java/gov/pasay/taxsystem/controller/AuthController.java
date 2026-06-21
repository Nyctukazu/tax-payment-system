package gov.pasay.taxsystem.controller;

import org.springframework.web.bind.annotation.RestController;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import gov.pasay.taxsystem.service.AuthService;
import gov.pasay.taxsystem.dto.LoginRequest;
import gov.pasay.taxsystem.dto.RegisterRequest;

@RestController
@RequestMapping("/api/auth")  
@CrossOrigin(origins = {"http://localhost:8080", 
                        "http://127.0.0.1:8080",
                        "https://tax-payment-system-production.up.railway.app"    
                    }) 
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @Value("${google.client.id}")
    private String googleClientId;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return authService.login(request.email(), request.password())
            .<ResponseEntity<?>>map(authResponse -> {
                return ResponseEntity.ok(authResponse);
            })
            .orElseGet(() -> {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            });
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String message = authService.register(request);
            response.put("message", message);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody java.util.Map<String, String> payload) {
        String tokenId = payload.get("token");
        if (tokenId == null) {
            return ResponseEntity.badRequest().body("Missing Google token");
        }
        String activeClientId = (googleClientId != null && !googleClientId.isEmpty()) ? googleClientId : "139040312423-lu1g1apc9b60flr8ii1ia453mkpp5ik8.apps.googleusercontent.com";
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(activeClientId))
                .build();

        try {
            GoogleIdToken idToken = verifier.verify(tokenId);
            if (idToken != null) {
                GoogleIdToken.Payload googlePayload = idToken.getPayload();

                String email = googlePayload.getEmail();
                boolean emailVerified = Boolean.valueOf(googlePayload.getEmailVerified());
                String name = (String) googlePayload.get("name");

                if (!emailVerified) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Google email is not verified.");
                }

                return authService.loginOrRegisterGoogleUser(email, name)
                        .<ResponseEntity<?>>map(ResponseEntity::ok)
                        .orElseGet(() -> {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied: Service entity processing failed.");
                        });
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google ID token.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing Google Authentication.");
        }
    }


    @GetMapping("/user/profile")
    public ResponseEntity<?> getUserProfile() {
        Map<String, String> profileData = new HashMap<>();
        profileData.put("name", "Pasay Taxpayer");
        profileData.put("status", "Active");
        profileData.put("message", "Your security token is working perfectly!");
        
        return ResponseEntity.ok(profileData);
    }

}
