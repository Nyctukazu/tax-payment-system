package gov.pasay.taxsystem.dto;

public record AuthResponse (
    String message,
    String role,
    String displayName,
    String adminClass
) {}
