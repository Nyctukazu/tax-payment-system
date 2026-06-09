package gov.pasay.taxsystem.service;

import gov.pasay.taxsystem.model.entity.FeedbackModel;
import gov.pasay.taxsystem.repository.FeedbackRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepo;

    @Transactional
    public FeedbackModel saveFeedback(FeedbackModel feedback) {
        return feedbackRepo.save(feedback);
    }

    @Transactional(readOnly = true)
    public List<FeedbackModel> getAllFeedback() {
        return feedbackRepo.findAll();
    }
}
