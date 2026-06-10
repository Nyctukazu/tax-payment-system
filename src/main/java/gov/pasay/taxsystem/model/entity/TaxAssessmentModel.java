package gov.pasay.taxsystem.model.entity;

import gov.pasay.taxsystem.model.enums.TaxStatus;

import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaxAssessmentModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taxpayer_id", nullable = false)
    private TaxpayerModel taxpayer;

    private Integer taxYear;
    private BigDecimal declaredGrossReceipts;
    private BigDecimal calculatedTaxDue;
    private TaxStatus status;

 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_database_id", nullable = false)
    private BusinessModel business;
    
}
