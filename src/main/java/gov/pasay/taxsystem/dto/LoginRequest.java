package gov.pasay.taxsystem.dto;

public record LoginRequest(
    String email, 
    String password
) {}
