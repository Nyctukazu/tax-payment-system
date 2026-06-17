package gov.pasay.taxsystem.dto;

import java.time.LocalDate;
import java.math.BigDecimal;

public record LedgerEntryRequest(
    LocalDate date,
    String type,
    BigDecimal amount,
    String status,
    String receiptNo,
    String receiptUrl
) {}