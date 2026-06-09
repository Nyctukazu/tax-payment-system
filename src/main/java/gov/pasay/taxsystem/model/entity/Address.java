package gov.pasay.taxsystem.model.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Address {

    private String houseNumber;
    private String buildingName;
    private String unitNumber;
    private String street;
    private String barangay;
    private String subdivision;
    
}
