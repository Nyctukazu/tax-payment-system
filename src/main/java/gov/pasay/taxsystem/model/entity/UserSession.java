package gov.pasay.taxsystem.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_sessions")
@Data
@NoArgsConstructor
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String role;

    @Column(name = "admin_classification")
    private String adminClass;

    private LocalDateTime expiryDate;

    public UserSession(String token, String email, String role, String adminClass) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.adminClass = adminClass;
        this.expiryDate = LocalDateTime.now().plusHours(8); // Valid for 8 hours
    }
}
