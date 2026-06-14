export const evaluationMockData = {
    inbox: [
        {
            requestId: "REF-2026-0421",
            businessName: "Pasay Central Cafe",
            businessTin: "BIN: BIN-000145",
            businessType: "Restaurant / Retailer",
            taxYear: 2026,
            submittedAt: "Today, 08:15 AM",
            ownershipType: "SOLE PROPRIETORSHIP",
            ownerName: "Juan Dela Cruz",
            declaredGrossReceipts: 1250000,
            taxCode: "100-B: Retailer-Food/Beverages (Matches)",
            verificationStatus: "VERIFIED: Declared matches attached proof.",
            baseBusinessTaxDue: 25000,
            fees: [
                { key: "garbageFee", label: "Garbage Fee", amount: 4500, note: "Based on 120 sq.m area" },
                { key: "sanitaryFee", label: "Sanitary Fee", amount: 3100, note: "Standard food service rate" },
                { key: "signboardFee", label: "Signboard Fee", amount: 950, note: "Dimensions verified" }
            ],
            document: {
                fileName: "BIR Form 1701Q - BIR Proof.pdf",
                pages: [
                    {
                        title: "INCOME STATEMENT",
                        blocks: [
                            "Company: Pasay Central Cafe",
                            "Period: Jan 1, 2025 - Dec 31, 2025",
                            "Gross Receipts: ............. ₱ 1,250,000.00",
                            "Cost of Goods Sold: ......... ₱ 450,000.00",
                            "Gross Profit: ............... ₱ 800,000.00",
                            "[End of Page 1]"
                        ]
                    },
                    {
                        title: "BIR FORM 1701Q (Cont.)",
                        blocks: [
                            "Tax Base: ₱ 1,250,000.00",
                            "[End of Document]"
                        ]
                    }
                ]
            }
        },
        {
            requestId: "REF-2026-0422",
            businessName: "Manila Bay Hotel",
            businessTin: "BIN: BIN-000146",
            businessType: "Hotel / Accommodation",
            taxYear: 2026,
            submittedAt: "Today, 09:30 AM",
            ownershipType: "CORPORATION",
            ownerName: "Harborfront Hospitality Inc.",
            declaredGrossReceipts: 4200000,
            taxCode: "220-H: Hotel / Accommodation",
            verificationStatus: "PENDING: Awaiting final invoice bundle confirmation.",
            baseBusinessTaxDue: 84000,
            fees: [
                { key: "garbageFee", label: "Garbage Fee", amount: 7200, note: "Based on 300 sq.m area" },
                { key: "sanitaryFee", label: "Sanitary Fee", amount: 4200, note: "Accommodation rate card" },
                { key: "signboardFee", label: "Signboard Fee", amount: 1500, note: "Facade signage verified" }
            ],
            document: {
                fileName: "Hotel Revenue Statement.pdf",
                pages: [
                    {
                        title: "REVENUE SUMMARY",
                        blocks: [
                            "Entity: Manila Bay Hotel",
                            "Gross Receipts: ₱ 4,200,000.00",
                            "Net Room Revenue: ₱ 2,950,000.00",
                            "Ancillary Revenue: ₱ 1,250,000.00",
                            "[Page 1]"
                        ]
                    }
                ]
            }
        }
    ]
};
