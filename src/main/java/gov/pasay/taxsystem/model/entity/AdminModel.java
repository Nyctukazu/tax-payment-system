package gov.pasay.taxsystem.model.entity;

import gov.pasay.taxsystem.model.enums.AdminClassification;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminModel extends User{

    @Enumerated(EnumType.STRING)
    @Column(name = "ownership_type", nullable = false)
    private AdminClassification adminClass;
}
