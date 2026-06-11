package gov.pasay.taxsystem.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.pasay.taxsystem.service.DocumentIngestionService;

@Configuration
public class RAGInitializerConfig {

    private static final Logger logger = LoggerFactory.getLogger(RAGInitializerConfig.class);

    @Bean
    CommandLineRunner initializeVectors(DocumentIngestionService ingestionService) {
        return args -> {
            try {
                logger.info("Starting local RAG text vector ingestion...");
                ingestionService.ingestTaxDocuments();
                logger.info("RAG vector ingestion completed successfully!");
            } catch (Exception e) {
               logger.error("============= AI SYSTEM ALERT =============");
                logger.error("Local Ollama engine (Llama 3.2/Nomic) was not found.");
                logger.error("AI Chat features will be unavailable, but the main system is running.");
                logger.error("Reason: " + e.getMessage());
                logger.error("===========================================");

            }
        };
    }
    
}
