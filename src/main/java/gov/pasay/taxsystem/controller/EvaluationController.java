package gov.pasay.taxsystem.controller;

import gov.pasay.taxsystem.dto.AssessmentCalculationRequest;
import gov.pasay.taxsystem.dto.EvaluationResponse;
import gov.pasay.taxsystem.dto.RoutingRequest;
import gov.pasay.taxsystem.model.entity.BusinessModel;
import gov.pasay.taxsystem.model.entity.EvaluateDocumentModel;
import gov.pasay.taxsystem.model.entity.EvaluateModel;
import gov.pasay.taxsystem.repository.BusinessRepository;
import gov.pasay.taxsystem.repository.EvaluateRepository;
import gov.pasay.taxsystem.service.DocumentParsingService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/evaluate-inbox")
public class EvaluationController {

    private final DocumentParsingService parsingService;
    private final EvaluateRepository evaluationRepository;
    private final BusinessRepository businessRepository;

    public EvaluationController(DocumentParsingService parsingService, 
                                      EvaluateRepository evaluationRepository, 
                                      BusinessRepository businessRepository) {
        this.parsingService = parsingService;
        this.evaluationRepository = evaluationRepository;
        this.businessRepository = businessRepository;
    }

    @GetMapping
    public ResponseEntity<List<EvaluationResponse>> getEvaluationInboxBase() {
       
        List<EvaluateModel> evaluations = evaluationRepository.findAllWithDetails();


        List<EvaluationResponse> responseList = evaluations.stream().map(eval -> {
            var biz = eval.getBusiness();
            var owner = biz.getTaxpayer();
            String fullOwnerName = owner.getFirstName() + " " + owner.getLastName();

            List<EvaluationResponse.FeeItem> mappedFees = eval.getFees().stream()
                .map(f -> new EvaluationResponse.FeeItem(f.getFeeKey(), f.getLabel(), f.getAmount(), f.getNote()))
                .collect(Collectors.toList());

            EvaluationResponse.DocumentDto docDto = null;
            if (eval.getDocument() != null) {
                docDto = new EvaluationResponse.DocumentDto(
                    eval.getDocument().getFileName(),
                    eval.getDocument().getPages().stream()
                        .map(p -> new EvaluationResponse.DocumentPageDto(p.getTitle(), p.getBlocks()))
                        .collect(Collectors.toList())
                );
            }

            return new EvaluationResponse(
                eval.getRequestId(),                                                       
                biz.getBusinessName(),   
                biz.getBusinessTin(),                                                  
                biz.getBusinessClass() != null ? biz.getBusinessClass().name() : "RETAILER",
                eval.getTaxYear(),                                                          
                eval.getSubmittedAt().toString(),                                           
                biz.getOwnershipType() != null ? biz.getOwnershipType().name() : "SOLE PROPRIETORSHIP",
                fullOwnerName,
                eval.getDeclaredGrossReceipts(),
                eval.getTaxCode(),
                eval.getVerificationStatus(),
                eval.getBaseBusinessTaxDue(),
                mappedFees,
                docDto
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    @PostMapping("/upload-application")
    public ResponseEntity<?> submitTaxpayerApplication(
            @RequestParam("businessId") Long businessId,
            @RequestParam("taxYear") Integer taxYear,
            @RequestParam("grossReceipts") Double grossReceipts,
            @RequestParam("document") MultipartFile uploadedFile) {
        
        try {
            BusinessModel business = businessRepository.findById(businessId)
                    .orElseThrow(() -> new IllegalArgumentException("Business Record not found."));

            EvaluateDocumentModel parsedDoc = parsingService.parseUploadedPdf(uploadedFile);
 
            EvaluateModel evaluation = new EvaluateModel();
            evaluation.setBusiness(business);
            evaluation.setTaxYear(taxYear);
            evaluation.setDeclaredGrossReceipts(grossReceipts);
            evaluation.setVerificationStatus("PENDING");
            evaluation.setTaxCode("BIZ-TAX-DEFAULT");
            evaluation.setBaseBusinessTaxDue(grossReceipts * 0.02); 

            evaluation.setDocument(parsedDoc);

            EvaluateModel savedRecord = evaluationRepository.save(evaluation);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                java.util.Map.of("message", "Application uploaded and parsed successfully!", "requestId", savedRecord.getRequestId())
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Failed to compile uploaded document structure: " + e.getMessage()));
        }
    }


    @GetMapping("/{requestId}")
    public ResponseEntity<EvaluationResponse> getEvaluationById(@PathVariable("requestId") String requestId) {
        EvaluateModel eval = evaluationRepository.findById(requestId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evaluation sheet record missing."));

        var biz = eval.getBusiness();
        var owner = biz.getTaxpayer();
        String fullOwnerName = owner.getFirstName() + " " + owner.getLastName();

        List<EvaluationResponse.FeeItem> mappedFees = eval.getFees().stream()
            .map(f -> new EvaluationResponse.FeeItem(f.getFeeKey(), f.getLabel(), f.getAmount(), f.getNote()))
            .collect(Collectors.toList());

        EvaluationResponse.DocumentDto docDto = null;
        if (eval.getDocument() != null) {
            docDto = new EvaluationResponse.DocumentDto(
                eval.getDocument().getFileName(),
                eval.getDocument().getPages().stream()
                    .map(p -> new EvaluationResponse.DocumentPageDto(p.getTitle(), p.getBlocks()))
                    .collect(Collectors.toList())
            );
        }

        return ResponseEntity.ok(new EvaluationResponse(
            eval.getRequestId(),
            biz.getBusinessName(),
            biz.getBusinessTin() ,
            biz.getBusinessClass() != null ? biz.getBusinessClass().name() : "RETAILER",
            eval.getTaxYear(),
            eval.getSubmittedAt().toString(),
            biz.getOwnershipType() != null ? biz.getOwnershipType().name() : "SOLE_PROPRIETORSHIP",
            fullOwnerName,
            eval.getDeclaredGrossReceipts(),
            eval.getTaxCode(),
            eval.getVerificationStatus(),
            eval.getBaseBusinessTaxDue(),
            mappedFees,
            docDto
        ));
    }

    @PostMapping("/{requestId}/calculate")
    public ResponseEntity<?> calculateAssessment(
            @PathVariable("requestId") String requestId,
            @RequestBody AssessmentCalculationRequest payload) {
        
        EvaluateModel eval = evaluationRepository.findById(requestId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Record missing."));

        Double regulatoryFeesTotal = payload.fees().stream()
            .mapToDouble(AssessmentCalculationRequest.FeeAdjustmentDto::amount)
            .sum();

        Double totalAssessmentDue = eval.getBaseBusinessTaxDue() + regulatoryFeesTotal;

        Map<String, Object> response = new HashMap<>();
        response.put("baseBusinessTaxDue", eval.getBaseBusinessTaxDue());
        response.put("regulatoryFeesTotal", regulatoryFeesTotal);
        response.put("totalAssessmentDue", totalAssessmentDue);
        response.put("message", "Assessment calculated successfully by Pasay City tax engine.");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{requestId}/route")
    public ResponseEntity<?> routeToSupervisor(
            @PathVariable("requestId") String requestId,
            @RequestBody RoutingRequest payload) {
        
        EvaluateModel eval = evaluationRepository.findById(requestId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Record missing."));

        if (payload.totalAssessmentDue() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Assessment must be computed first."));
        }

        eval.setVerificationStatus("ROUTED_TO_SUPERVISOR");
        evaluationRepository.save(eval);

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Done! Assessment workbook routed safely to the Supervisor pool.");

        return ResponseEntity.ok(response);
    }
}
