package gov.pasay.taxsystem.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import gov.pasay.taxsystem.model.enums.AdminClassification;

public record EditRequest(
    String firstName,
    String lastName,
    String mobileNumber,
    AdminClassification adminClass
) {
    @JsonCreator
    public EditRequest(
        @JsonProperty("firstName") String firstName,
        @JsonProperty("lastName") String lastName,
        @JsonProperty("mobileNumber") String mobileNumber,
        @JsonProperty("adminClass") AdminClassification adminClass
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.mobileNumber = mobileNumber;
        this.adminClass = adminClass;
    }
}
