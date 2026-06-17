package gov.pasay.taxsystem.dto;

import java.util.List;

public record EvaluationResponse(
    String requestId,
    String businessName,
    String businessTin,
    String businessClass,
    Integer taxYear,
    String submittedAt,
    String ownershipType,
    String ownerName,
    Double declaredGrossReceipts,
    String taxCode,
    String verificationStatus,
    Double baseBusinessTaxDue,
    List<FeeItem> fees,
    DocumentDto document
) {
    public record FeeItem(
        String key,
        String label,
        Double amount,
        String note
    ) {}

    public record DocumentDto(
        String fileName,
        List<DocumentPageDto> pages
    ) {}

    public record DocumentPageDto(
        String title,
        List<String> blocks
    ) {}
}
