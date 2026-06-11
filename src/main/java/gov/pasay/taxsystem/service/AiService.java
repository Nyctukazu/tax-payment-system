package gov.pasay.taxsystem.service;

import gov.pasay.taxsystem.dto.ChatRequest;
import gov.pasay.taxsystem.dto.ChatResponse;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AiService {
    
    private final ChatClient chatClient;

    @Autowired
    public AiService(OllamaChatModel chatModel, SimpleVectorStore vectorStore) {
        this.chatClient = ChatClient.builder(chatModel)
                .defaultSystem("""
                    You are PasayBiz AI, the official intelligent assistant for Pasay City's local business tax office.
                    Your job is to assist business owners, taxpayers, and administrators with clear information regarding:

                    CRITICAL INSTRUCTION:
                    You must answer the user's question using ONLY the factual context provided by the vector store. Do NOT look at your own external knowledge or make assumptions.

                    1. Business permit registration processes.
                    2. Local tax assessments, cycles, and requirements.
                    3. Understanding the Pasay City Revenue Code.
                    
                    Keep your answers polite, concise, professional, and specific to Pasay City guidelines. 
                    If the retrieved text context does not contain the answer, say exactly this: "I apologize, but I do not have that specific regulatory data on file. Please coordinate directly with the Pasay City BPLO."
                    """)
                .defaultAdvisors(new QuestionAnswerAdvisor(vectorStore))
                .build();
    }

    public ChatResponse generateChatResponse(ChatRequest request) {

        String aiOutput = chatClient.prompt()
                .user(request.message())
                .call()
                .content();
        
        return new ChatResponse(aiOutput);
    }
}
