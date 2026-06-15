package gov.pasay.taxsystem.dto;

import java.util.List;

public record DashboardResponse(
    UserSummary user,
    List<NotificationItem> notifications,
    List<KpiCard> kpis,
    ChartBundle charts,
    List<BulletinItem> bulletin,
    List<AuditTrailItem> auditTrail
) {
    public record UserSummary(
        String displayName,
        String dateLabel
    ) {}

    public record NotificationItem(
        String title,
        String message,
        String time
    ) {}

    public record KpiCard(
        String label,
        String value,
        String delta
    ) {}

    public record ChartBundle(
        List<Integer> trend,
        List<VelocityItem> velocity,
        List<SectorItem> sectors
    ) {}

    public record VelocityItem(
        String label,
        Integer value,
        String color
    ) {}

    public record SectorItem(
        String label,
        Integer value,
        String color
    ) {}

    public record BulletinItem(
        String level,
        String message,
        String time
    ) {}

    public record AuditTrailItem(
        String time, 
        String action,
        String actor
    ) {}
}
