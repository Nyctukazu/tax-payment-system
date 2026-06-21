export const userAccessMockData = {
    summary: {
        totalSystemUsers: 4,
        totalUsersNote: "2 Supervisors, 3 Clerks",
        activeSessionsToday: 3,
        activeSessionsNote: "Logged in securely",
        securityAlerts: 0,
        securityAlertsNote: "No anomalies detected"
    },
    users: [
        {
            employeeId: "USR-001",
            fullName: "Maria R. Reyes",
            corporateEmail: "maria.reyes@pasay.gov.ph",
            assignedRoles: ["CLERK", "SUPERVISOR"],
            status: "Active",
            actions: ["Edit", "Reset Pass", "Deactivate"]
        },
        {
            employeeId: "USR-022",
            fullName: "Serafin A. Leon",
            corporateEmail: "serafin.leon@pasay.gov.ph",
            assignedRoles: ["CLERK"],
            status: "Active",
            actions: ["Edit", "Reset Pass", "Deactivate"]
        },
        {
            employeeId: "USR-024",
            fullName: "Janice C. Darita",
            corporateEmail: "janice.darita@pasay.gov.ph",
            assignedRoles: ["CLERK"],
            status: "Inactive",
            actions: ["Edit", "Reset Pass", "Activate"]
        },
        {
            employeeId: "USR-025",
            fullName: "Serafin A. De Leon",
            corporateEmail: "serafin.deleon@pasay.gov.ph",
            assignedRoles: ["SUPERVISOR"],
            status: "Active",
            actions: ["Edit", "Reset Pass", "Deactivate"]
        }
    ]
};
