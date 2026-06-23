package gov.pasay.taxsystem.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record StatusToggleRequest(
    @JsonProperty("superadminPassword") String superadminPassword
) {}