package gov.pasay.taxsystem.dto;

import gov.pasay.taxsystem.model.enums.AdminClassification;

public record RegisterRequest(
    String email,
    String password,
    String firstName,
    String lastName,
    String mobileNumber,
    String accountType,
    AdminClassification adminClass
) {}
