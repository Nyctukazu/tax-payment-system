package gov.pasay.taxsystem.service;

import java.util.List;

import org.springframework.stereotype.Service;
import gov.pasay.taxsystem.dto.DashboardResponse;

@Service
public class DashboardService {
    public DashboardResponse getDashboardData(Long userId) {
        DashboardResponse.UserSummary user = new DashboardResponse.UserSummary(
            "Juan Dela Cruz", "June 2026"
        );

        List<DashboardResponse.NotificationItem> notifications = List.of(
            new DashboardResponse.NotificationItem("New Assessment", "Tax filing submitted", "5m ago")
        );

        List<DashboardResponse.KpiCard> kpis = List.of(
            new DashboardResponse.KpiCard("Total Revenue", "₱1,240,000", "+12%")
        );

        DashboardResponse.ChartBundle charts = new DashboardResponse.ChartBundle(
            List.of(10, 20, 30), List.of(), List.of()
        );

        return new DashboardResponse(
            user, notifications, kpis, charts, List.of(), List.of()
        );
    }
}
