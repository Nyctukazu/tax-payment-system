package gov.pasay.taxsystem.dto;

import java.time.LocalDate;
import java.math.BigDecimal;

public record BusinessRequest(
    String id,
    String name,
    String icon,      
    String type,
    LocalDate lastFiled,
    BigDecimal taxRatePercent
) {}