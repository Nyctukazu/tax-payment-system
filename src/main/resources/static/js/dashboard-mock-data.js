export const dashboardMockData = {
    user: {
        displayName: "Juan Dela Cruz",
        dateLabel: "Thursday, June 11, 2026"
    },
    notifications: [
        { title: "New Submission", message: "REQ-2026-0047 attached new financials.", time: "Just now"},
        { title: "System Alert", message: "Server maintenance scheduled for the 20th at 12:00 AM.", time: "2 hours ago" },
        { title: "Policy Update", message: "New Tax Ordinance released by City Hall.", time: "yesterday" },
        { title: "Approved", message: "REQ-2026-0042 processed successfully.", time: "yesterday" }
    ],
    kpis: [
        { label: "Total Tax Collected (YTD)", value: "₱145.8M", delta: "+12.5% vs Last Year" },
        { label: "New Applications Today", value: "38", delta: "25 Pending" },
        { label: "Processing Avg. Time", value: "3.2 Days", delta: "↓ 1.5% Faster" },
        { label: "Critical Alerts", value: "7", delta: "4 High Priority" }
    ],
    charts: {
        trend: [30, 45, 41, 49, 68, 57, 71],
        velocity: [
            { label: "Approved", value: 500, color: "#1d4ed8" },
            { label: "Pending", value: 250, color: "#f59e0b" },
            { label: "For Review", value: 95, color: "#22c55e" },
            { label: "Rejected", value: 90, color: "#ef4444"}
        ],
        sectors: [
            { label: "Retail", value: 34, color: "#1d4ed8"},
            { label: "Real Estate", value: 18, color: "#22c55e"},
            { label: "Manufactoring", value: 18, color: "#f59e0b"},
            { label: "Services", value: 15, color: "#06b6d4"},
            { label: "Tech", value: 12, color: "#7c3aed" }
        ]
    },
    bulletin: [
        { level: "High", message: "URGENT: Tax Engine DB update required.", time: "2:00 PM" },
        { level: "System", message: "Server maintenance scheduled for the 20th.", time: "Yesterday" },
        { level: "Info", message: "New Tax Ordinance released by City Hall.", time: "Oct 23" }
    ],
    auditTrail: [
        { time: "15:30", action: "Appv'd Business", actor: "Maria S. (Supervisor)" },
        { time: "14:15", action: "Policy Change", actor: "Admin User" },
        { time: "12:45", action: "DB Sync", actor: "System"}
    ]
};