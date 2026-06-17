package gov.pasay.taxsystem.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "business_evaluations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluateModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private BusinessModel business;

    private Integer taxYear;
    private LocalDateTime submittedAt = LocalDateTime.now();
    private Double declaredGrossReceipts;
    private String taxCode;
    private String verificationStatus;
    private Double baseBusinessTaxDue;

    @ElementCollection
    @CollectionTable(name = "evaluation_fees", joinColumns = @JoinColumn(name = "evaluation_id"))
    private List<FeeItemEmbeddable> fees = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private EvaluateDocumentModel document;

}
