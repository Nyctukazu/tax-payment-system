export const queueMockData = {
    summary: {
        totalPending: 2,
        approvedToday: 0,
        rejectedToday: 0
    },
    pendingEvaluations: [
        {
            requestId: "REF-2026-0105",
            businessName: "Seaside Logistics",
            businessType: "Logistics / Freight",
            taxYear: 2026,
            status: "Pending Approval",
            actionLabel: "View",
            viewRequestId: "REF-2026-0105"
        }
    ],
    history: {
        recentlyApproved: [
            {
                requestId: "REF-2026-0099",
                businessName: "Tech Haven",
                businessType: "Retail",
                dateProcessed: "Today, 10:15 AM",
                status: "Approved",
                actionLabel: "View",
                viewRequestId: "REF-2026-0099"
            }
        ],
        recentlyRejected: [
            {
                requestId: "REF-2026-0102",
                businessName: "SteelWorks Inc.",
                businessType: "Manufacturing",
                dateProcessed: "Today, 11:30 AM",
                status: "Rejected",
                actionLabel: "View",
                viewRequestId: "REF-2026-0102"
            }
        ]
    }
};
