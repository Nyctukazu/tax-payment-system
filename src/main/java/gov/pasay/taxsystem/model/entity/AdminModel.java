package gov.pasay.taxsystem.model.entity;

import gov.pasay.taxsystem.model.enums.AdminClassification;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("ADMIN")
public class AdminModel extends User{

    @Enumerated(EnumType.STRING)
    @Column(name = "admin_classification")
    private AdminClassification adminClass;
}
