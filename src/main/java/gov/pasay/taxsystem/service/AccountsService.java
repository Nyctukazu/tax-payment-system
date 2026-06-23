package gov.pasay.taxsystem.service;

import gov.pasay.taxsystem.dto.AccountResponse;
import gov.pasay.taxsystem.dto.EditRequest;
import gov.pasay.taxsystem.dto.StatusToggleRequest;
import gov.pasay.taxsystem.model.entity.AdminModel;
import gov.pasay.taxsystem.model.entity.TaxpayerModel;
import gov.pasay.taxsystem.model.entity.User;
import gov.pasay.taxsystem.model.enums.AccountStatus;
import gov.pasay.taxsystem.model.enums.AccountType;
import gov.pasay.taxsystem.model.enums.AdminClassification;
import gov.pasay.taxsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountsService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return userRepository.findAll().stream()
                .filter(user -> user.getStatus() != AccountStatus.DELETED)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AccountResponse getSpecificAccount(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
        return convertToResponse(user);
    }

    @Transactional
    public void softDeleteAccount(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
        
        user.setStatus(AccountStatus.DELETED);
        userRepository.save(user);
    }

    @Transactional
    public void toggleAccountStatus(Long id, StatusToggleRequest request) {

        checkAdminPass(request.superadminPassword());

        User targetUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));

        if (targetUser.getStatus() == AccountStatus.ACTIVE) {
            targetUser.setStatus(AccountStatus.INACTIVE);
        } else {
            targetUser.setStatus(AccountStatus.ACTIVE);
        }
        userRepository.save(targetUser);
    }

    private void checkAdminPass(String adminPassword) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Access Denied: Unauthenticated session.");
        }

        String currentSuperAdminEmail = authentication.getName();

        System.out.println(currentSuperAdminEmail);

        User currentSuperadmin = userRepository.findByEmail(currentSuperAdminEmail)
            .orElseThrow(() -> new RuntimeException("Authenticated administrator session not found."));

        if (!passwordEncoder.matches(adminPassword, currentSuperadmin.getPassword())) {
            throw new IllegalArgumentException("Verification failed: Invalid Superadmin Password.");
        }
    }

    private AccountResponse convertToResponse(User user) {
        String fullName = user.getFirstName() + " " + user.getLastName();
        
        AdminClassification adminClass = null;
        AccountType accountType;

        if (user instanceof AdminModel admin) {
            accountType = AccountType.ADMIN;
            adminClass = admin.getAdminClass();
        } else if (user instanceof TaxpayerModel) {
            accountType = AccountType.TAXPAYER;
        } else {
            throw new IllegalStateException("Unknown user subclass type matching: " + user.getClass());
        }

        return new AccountResponse(
            user.getId(),
            fullName,
            user.getEmail(),
            adminClass,
            accountType,
            user.getStatus(),
            user.getMobileNumber()
        );
    }

    @Transactional
    public void updateAccount(Long id, EditRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found."));

        System.out.println("📥 Backend Service Received Request Object: " + request);

        if (request.firstName() != null && !request.firstName().isBlank()) {
            user.setFirstName(request.firstName());
        }
        if (request.lastName() != null && !request.lastName().isBlank()) {
            user.setLastName(request.lastName());
        }
        if (request.mobileNumber() != null && !request.mobileNumber().isBlank()) {
            user.setMobileNumber(request.mobileNumber());
        }

        if (user instanceof AdminModel admin) {
            if (request.adminClass() == null) {
                admin.setAdminClass(request.adminClass());
                throw new IllegalArgumentException("Admin Classification cannot be empty.");
            }
        }

        userRepository.save(user);
        System.out.println("✅ Database updated successfully for user ID: " + id);
    }
}


