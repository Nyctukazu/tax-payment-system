package gov.pasay.taxsystem.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("TAXPAYER")
public class TaxpayerModel extends User {

    private String ownerTin;

    @OneToMany(mappedBy = "taxpayer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BusinessModel> businesses = new ArrayList<>();

    @OneToMany(mappedBy = "taxpayer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FeedbackModel> feedback = new ArrayList<>();


}
