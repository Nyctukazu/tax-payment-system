package gov.pasay.taxsystem.service;

import gov.pasay.taxsystem.model.entity.EvaluatePageModel;
import gov.pasay.taxsystem.model.entity.EvaluateDocumentModel;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DocumentParsingService {

    public EvaluateDocumentModel parseUploadedPdf(MultipartFile file) throws IOException {
        EvaluateDocumentModel documentModel = new EvaluateDocumentModel();
        documentModel.setFileName(file.getOriginalFilename());
        
        List<EvaluatePageModel> parsedPages = new ArrayList<>();

        try (PDDocument pdfDocument = Loader.loadPDF(file.getBytes())) {
            int totalPages = pdfDocument.getNumberOfPages();
            
            PDFTextStripper textStripper = new PDFTextStripper();

            for (int i = 1; i <= totalPages; i++) {
                textStripper.setStartPage(i);
                textStripper.setEndPage(i);
                
                String rawPageText = textStripper.getText(pdfDocument);
                
                List<String> textBlocks = Arrays.stream(rawPageText.split("\\r?\\n"))
                        .map(String::trim)
                        .filter(line -> !line.isEmpty()) // Drops clean blank whitespaces 
                        .toList();

                EvaluatePageModel pageData = new EvaluatePageModel();
                pageData.setTitle("Page " + i);
                pageData.setBlocks(textBlocks);
                
                parsedPages.add(pageData);
            }
        }

        documentModel.setPages(parsedPages);
        return documentModel;
    }
}
