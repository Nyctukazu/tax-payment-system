package gov.pasay.taxsystem.model.entity;

import gov.pasay.taxsystem.model.enums.AdminClassification;

import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Admin extends User{

    @Enumerated(EnumType.STRING)
    @Column(name = "ownership_type", nullable = false)
    private AdminClassification adminClass;
}
