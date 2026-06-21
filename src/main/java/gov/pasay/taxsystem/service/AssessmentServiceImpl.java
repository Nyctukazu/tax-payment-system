package gov.pasay.taxsystem.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import gov.pasay.taxsystem.dto.ActiveAssessmentResponse;
import gov.pasay.taxsystem.service.AssessmentService;

@Service
public class AssessmentServiceImpl implements AssessmentService {

    @Override
    public Optional<ActiveAssessmentResponse> findActive(Long businessId) {
        return Optional.empty();
    }
}
