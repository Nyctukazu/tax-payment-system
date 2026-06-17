package gov.pasay.taxsystem.service;

import java.util.Optional;
import gov.pasay.taxsystem.dto.ActiveAssessmentResponse;

public interface AssessmentService {
    Optional<ActiveAssessmentResponse> findActive(Long businessId);
}
