package gov.pasay.taxsystem.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "evaluation_document_pages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluatePageModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ElementCollection
    @CollectionTable(name = "page_text_blocks", joinColumns = @JoinColumn(name = "page_id"))
    @Column(name = "text_block", columnDefinition = "TEXT")
    private List<String> blocks = new ArrayList<>();
}
