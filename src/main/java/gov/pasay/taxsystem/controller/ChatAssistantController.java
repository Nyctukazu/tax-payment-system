package gov.pasay.taxsystem.controller;

import org.springframework.web.bind.annotation.RestController;

import gov.pasay.taxsystem.service.AiService;
import reactor.core.publisher.Flux;

import gov.pasay.taxsystem.dto.ChatRequest;
import gov.pasay.taxsystem.dto.ChatResponse;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class ChatAssistantController {  

    private final AiService chatService;

    @Autowired
    public ChatAssistantController(AiService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> handleTaxpayerInquiry(@RequestBody ChatRequest request) {
        if (request.message() == null || request.message().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ChatResponse("Message cannot be empty."));
        }

        ChatResponse response = chatService.generateChatResponse(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getAiStatus() {
        boolean available = chatService.isAiAvailable();
        return ResponseEntity.ok(Map.of("Available", available));
    }
}
