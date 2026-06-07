package gov.pasay.taxsystem.model;

import jakarta.persistence.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaxpayerModel extends User {
    private String ownerTin;
}
