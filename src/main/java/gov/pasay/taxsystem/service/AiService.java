package gov.pasay.taxsystem.service;

import java.util.List;

import gov.pasay.taxsystem.dto.ChatRequest;
import gov.pasay.taxsystem.dto.ChatResponse;

import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.Message;

import org.springframework.stereotype.Service;



@Service
public class AiService {
    
    private final OllamaChatModel chatModel;

    private final String SYSTEM_PROMPT = """
        You are PasayBiz AI, the official intelligent assistant for Pasay City's local business tax office.
        Your job is to assist business owners, taxpayers, and administrators with clear information regarding:
        1. Business permit registration processes.
        2. Local tax assessments, cycles, and requirements.
        3. Understanding the Pasay City Revenue Code.
        
        Keep your answers polite, concise, professional, and specific to Pasay City guidelines. 
        If you do not know an answer or if it falls outside local tax parameters, politely advise the user 
        to coordinate directly with the Pasay City Business Permits and Licensing Office (BPLO).
        """;



    public AiService(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public ChatResponse generateChatResponse(ChatRequest request) {


        Message systemMessage = new SystemPromptTemplate(SYSTEM_PROMPT).createMessage();
        Message userMessage = new UserMessage(request.message());

        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));

        String aiOutput = chatModel.call(prompt).getResult().getOutput().getText();
        return new ChatResponse(aiOutput);
    }
}
