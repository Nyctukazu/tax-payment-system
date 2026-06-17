package gov.pasay.taxsystem.dto;

import java.time.LocalDate;
import java.math.BigDecimal;

public record ActiveAssessmentResponse(
    String businessId,
    String businessName,
    String icon,
    String status,
    LocalDate deadlineDate,
    BigDecimal amountDue
) {}