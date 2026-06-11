package gov.pasay.taxsystem.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import java.io.File;
import java.util.List;

@Service
public class DocumentIngestionService {
    
    private final SimpleVectorStore vectorStore;

    @Value("classpath:pasay_tax_code.txt")
    private Resource taxCodeResource;

    public DocumentIngestionService(SimpleVectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void ingestTaxDocuments() {
        TikaDocumentReader reader = new TikaDocumentReader(taxCodeResource);
        List<Document> rawDocuments = reader.get();

        TokenTextSplitter splitter = new TokenTextSplitter();
        List<Document> splitDocuments = splitter.apply(rawDocuments);

        vectorStore.accept(splitDocuments);

        File vectorFile = new File("vector-store.json");
        vectorStore.save(vectorFile);

    }


}
