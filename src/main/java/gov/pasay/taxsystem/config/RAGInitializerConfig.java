package gov.pasay.taxsystem.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import gov.pasay.taxsystem.service.DocumentIngestionService;

@Configuration
public class RAGInitializerConfig {

    @Bean
    CommandLineRunner initializeVectors(DocumentIngestionService ingestionService) {
        return args -> {
            try {
                ingestionService.ingestTaxDocuments();

            } catch (Exception e) {
                System.out.println("Vector ingestion skipped or file already processed: " + e.getMessage());
            }
        };
    }
    
}
