package gov.pasay.taxsystem.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import gov.pasay.taxsystem.controller.DashboardController;
import gov.pasay.taxsystem.dto.DashboardResponse;
import gov.pasay.taxsystem.repository.AdminRepository;
import gov.pasay.taxsystem.repository.AuditLogRepository;
import gov.pasay.taxsystem.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final NotificationRepository notificationRepo;
    private final AuditLogRepository auditLogRepo;
    private final AdminRepository adminRepo;

    public DashboardResponse getDashboardData(Long userId) {
        DashboardResponse.UserSummary user = new DashboardResponse.UserSummary(
            "Laurence Ryan Cruz", "June 2026"
        );

        List<DashboardResponse.NotificationItem> notifications = 
            notificationRepo.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(n -> new DashboardResponse.NotificationItem(
                    n.getTitle(),
                    n.getMessage(),
                    n.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());

        List<DashboardResponse.KpiCard> kpis = List.of(
            new DashboardResponse.KpiCard("Total Revenue", "₱1,240,000", "+12%")
        );

        DashboardResponse.ChartBundle charts = new DashboardResponse.ChartBundle(
            List.of( new DashboardResponse.TrendItem("Monday", 90), 
                    new DashboardResponse.TrendItem("Tuesday", 100),
                    new DashboardResponse.TrendItem("Wednesday", 40),
                    new DashboardResponse.TrendItem("Thursday", 120),
                    new DashboardResponse.TrendItem("Friday", 20),
                    new DashboardResponse.TrendItem("Saturday", 70),
                    new DashboardResponse.TrendItem("Sunday", 0)
                
            ), 
            List.of( new DashboardResponse.VelocityItem("Approved", 500, "#1d4ed8"),
                    new DashboardResponse.VelocityItem("Pending", 250, "#f59e0b"),
                    new DashboardResponse.VelocityItem("For Review", 95, "#22c55e"),
                    new DashboardResponse.VelocityItem("Rejected", 90, "#ef4444")


            ), 
            List.of( new DashboardResponse.SectorItem("Retail", 34, "#1d4ed8"),
                    new DashboardResponse.SectorItem("Real Estate", 21, "#22c55e"),
                    new DashboardResponse.SectorItem("Manufactoring", 18, "#f59e0b"),
                    new DashboardResponse.SectorItem("Services", 115, "#06b6d4"),
                    new DashboardResponse.SectorItem("Tech", 12, "#7c3aed")

            )
        );

        List<DashboardResponse.BulletinItem> bulletin = List.of(
            new DashboardResponse.BulletinItem("High", "URGENT: Tax Engine DB update required.", "2:00 PM")
        );

        List<DashboardResponse.AuditTrailItem> auditTrail = 
            auditLogRepo.findTop10ByOrderByTimestampDesc()
                .stream()
                .map(log -> new DashboardResponse.AuditTrailItem(
                    log.getTimestamp().toString(),
                    log.getAction(),
                    log.getActor()
                ))
                .collect(Collectors.toList());

        return new DashboardResponse(
            user, notifications, kpis, charts, bulletin, auditTrail
        );
    }
}
