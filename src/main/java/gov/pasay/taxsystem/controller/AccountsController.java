package gov.pasay.taxsystem.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gov.pasay.taxsystem.dto.AccountResponse;
import gov.pasay.taxsystem.dto.EditRequest;
import gov.pasay.taxsystem.dto.StatusToggleRequest;
import gov.pasay.taxsystem.service.AccountsService;
import io.micrometer.core.ipc.http.HttpSender.Response;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountsController {
    private final AccountsService accountsService;

    

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(accountsService.getAllAccounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getSpecificAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountsService.getSpecificAccount(id));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleAccountStatus(
            @PathVariable Long id,
            @RequestBody StatusToggleRequest request) {
        
        accountsService.toggleAccountStatus(id, request);
        return ResponseEntity.ok().build();
        
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateAccount(@PathVariable Long id, @RequestBody EditRequest request) {
    accountsService.updateAccount(id, request);
    return ResponseEntity.ok().build();
    }
    
}
