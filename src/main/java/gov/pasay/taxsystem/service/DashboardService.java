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
            "Laurence Ryan Cruz", "June 2026", "SUPERADMIN"
        );

        List<DashboardResponse.NotificationItem> notifications = 
            List.of( new DashboardResponse.NotificationItem("New Submission", "REQ-2026-0047 attached new financials.", "Just now"),
                    new DashboardResponse.NotificationItem("System Alert", "Server maintenance scheduled for the 20th at 12:00 AM", "2 hours ago"),
                    new DashboardResponse.NotificationItem("Policy Update", "New Tax Ordinance released by City Hall.", "Yesterday"),
                    new DashboardResponse.NotificationItem("Approved", "REQ-2026-0042 processed successfully.", "Yesterday")
        );
           /* notificationRepo.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(n -> new DashboardResponse.NotificationItem(
                    n.getTitle(),
                    n.getMessage(),
                    n.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());*/

        List<DashboardResponse.KpiCard> kpis = List.of(
            new DashboardResponse.KpiCard("Total Tax Collected (YTD", "₱145.8M", "+12.5% vs Last Year"),
            new DashboardResponse.KpiCard("New Applications Today", "38", "25 Pending"),
            new DashboardResponse.KpiCard("Processing Avg. Time", "3.2 Days", "-1.5% Faster"),
            new DashboardResponse.KpiCard("Critical Alerts", "7", "5 High Priority")
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
            new DashboardResponse.BulletinItem("High", "URGENT: Tax Engine DB update required.", "2:00 PM"),
            new DashboardResponse.BulletinItem("High", "Server Maintenance scheduled for the 20th of June", "Yesterday"),
            new DashboardResponse.BulletinItem("Medium", "New Tax Ordinance released by City Hall", "Last Week"),
            new DashboardResponse.BulletinItem("Low", "New Update: Ollama 3.2 NLP Chat Model", "12:56 AM")
        );

        List<DashboardResponse.AuditTrailItem> auditTrail = List.of(
            new DashboardResponse.AuditTrailItem("3:30 PM", "Approved Business", "Flora S. (Supervisor"),
            new DashboardResponse.AuditTrailItem("2:15 PM", "Policy Change", "Nikutu Nyan (Super Admin)"),
            new DashboardResponse.AuditTrailItem("12:45 PM", "Database Sync", "System")          
        );

            /*auditLogRepo.findTop10ByOrderByTimestampDesc()
                .stream()
                .map(log -> new DashboardResponse.AuditTrailItem(
                    log.getTimestamp().toString(),
                    log.getAction(),
                    log.getActor()
                ))
                .collect(Collectors.toList());*/

        return new DashboardResponse(
            user, notifications, kpis, charts, bulletin, auditTrail
        );
    }
}
