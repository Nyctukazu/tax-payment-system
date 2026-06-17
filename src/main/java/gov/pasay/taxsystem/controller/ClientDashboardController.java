package gov.pasay.taxsystem.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gov.pasay.taxsystem.dto.ActiveAssessmentResponse;
import gov.pasay.taxsystem.dto.DashboardResponse;
import gov.pasay.taxsystem.service.AssessmentService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/client/dashboard")
@CrossOrigin(origins = "*")
public class ClientDashboardController {

    private final AssessmentService assessmentService;

    public ClientDashboardController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }
    
    @GetMapping("/active-assessment/{businessId}")
    public ResponseEntity<ActiveAssessmentResponse> getActiveAssessment(@PathVariable Long businessId) {
        return assessmentService.findActive(businessId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.noContent().build());
    }
}
