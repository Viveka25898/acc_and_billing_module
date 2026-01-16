// TDS Receivable Ledger Data - Section 194J (Professional Services)
// TDS deducted by customers on our invoices - Asset Account (Debit Balance)

export const tdsReceivableLedgerData = {
    headerInfo: {
        company: "iSmart Solutions Pvt. Ltd.",
        glAccount: "L3102",
        accountName: "TDS Receivable (194J) - Professional Services",
        accountType: "Current Asset",
        financialYear: "2025-26",
        period: "January 2026",
        openingBalance: "₹ 28,500.00 Dr",
        currency: "INR"
    },
    ledgerDetails: {
        entries: [
            {
                date: "05-Jan-2026",
                voucherNo: "INV/2026/0142",
                entryType: "Invoice",
                debit: 15000.00,
                credit: 0,
                balance: "₹ 43,500.00 Dr",
                narration: "TDS receivable u/s 194J @ 10% on professional services invoice to ABC Industries Ltd. Invoice Amount: ₹1,50,000. TDS deducted by customer and deposited to Govt.",
                tdsSection: "194J",
                tdsRate: "10%",
                invoiceAmount: "₹ 1,50,000.00",
                grossAmount: "₹ 1,50,000.00",
                panNumber: "AAACA1234F",
                counterparty: "ABC Industries",
                quarter: "Q4 FY25-26",
                status: "Posted",
                attachments: 2
            },
            {
                date: "12-Jan-2026",
                voucherNo: "INV/2026/0158",
                entryType: "Invoice",
                debit: 9500.00,
                credit: 0,
                balance: "₹ 53,000.00 Dr",
                narration: "TDS receivable u/s 194J @ 10% on consulting services to XYZ Corporation. Invoice Amount: ₹95,000. TDS deducted at source by client.",
                tdsSection: "194J",
                tdsRate: "10%",
                invoiceAmount: "₹ 95,000.00",
                grossAmount: "₹ 95,000.00",
                panNumber: "AABCX5678D",
                counterparty: "XYZ Corporation",
                quarter: "Q4 FY25-26",
                status: "Posted",
                attachments: 1
            },
            {
                date: "18-Jan-2026",
                voucherNo: "TDS-CLM/2026/003",
                entryType: "Refund Claim",
                debit: 0,
                credit: 22000.00,
                balance: "₹ 31,000.00 Dr",
                narration: "TDS refund claimed in Income Tax Return for FY 2024-25. Amount adjusted against TDS receivable after ITR processing and verification.",
                tdsSection: "194J",
                tdsRate: "10%",
                invoiceAmount: "-",
                grossAmount: "₹ 2,20,000.00",
                panNumber: "AABCI9876K",
                counterparty: "Income Tax Dept",
                quarter: "Q4 FY24-25",
                status: "Pending",
                attachments: 3
            }
        ],
        totalDebit: 24500.00,
        totalCredit: 22000.00,
        closingBalance: "₹ 31,000.00 Dr"
    }
};
