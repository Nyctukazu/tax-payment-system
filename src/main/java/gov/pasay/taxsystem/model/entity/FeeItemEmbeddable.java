package gov.pasay.taxsystem.model.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class FeeItemEmbeddable {
    private String feeKey;
    private String label;
    private Double amount;
    private String note;
}