package gov.pasay.taxsystem.dto;

import gov.pasay.taxsystem.model.enums.AccountStatus;
import gov.pasay.taxsystem.model.enums.AccountType;
import gov.pasay.taxsystem.model.enums.AdminClassification;

public record AccountResponse(
    Long id,
    String fullName,
    String email,
    AdminClassification adminClass,
    AccountType accountType,
    AccountStatus status,
    String mobileNumber
) {}
