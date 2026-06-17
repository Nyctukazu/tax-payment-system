package gov.pasay.taxsystem.dto;

import java.util.List;

public record AssessmentCalculationRequest (
    String taxCode,
    String verificationStatus,
    List<FeeAdjustmentDto> fees

) {
    public record FeeAdjustmentDto(
        String key,
        Double amount
    ) {}
}
