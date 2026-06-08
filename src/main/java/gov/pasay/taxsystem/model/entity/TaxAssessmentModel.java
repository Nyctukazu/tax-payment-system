package gov.pasay.taxsystem.model.entity;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class TaxAssessmentModel {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_database_id", nullable = false)
    private BusinessModel business;
}
