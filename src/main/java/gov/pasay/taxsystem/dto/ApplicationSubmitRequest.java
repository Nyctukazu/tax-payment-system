package gov.pasay.taxsystem.dto;

import jakarta.validation.constraints.NotBlank;

public record ApplicationSubmitRequest(
    @NotBlank String businessId
) {}