// Service Tax Payable Ledger Data
// Service Tax @ 15% (pre-GST regime or specific cases) - Liability Account (Credit Balance)

export const serviceTaxLedgerData = {
    headerInfo: {
        company: "iSmart Solutions Pvt. Ltd.",
        glAccount: "L3004",
        accountName: "Service Tax Payable",
        accountType: "Current Liability",
        financialYear: "2025-26",
        period: "January 2026",
        openingBalance: "₹ 18,750.00 Cr",
        currency: "INR"
    },
    ledgerDetails: {
        entries: [
            {
                date: "08-Jan-2026",
                voucherNo: "ST-INV/2026/0034",
                entryType: "Invoice",
                debit: 0,
                credit: 12500.00,
                balance: "₹ 31,250.00 Cr",
                narration: "Service Tax @ 15% collected on manpower supply services to Special Economic Zone (SEZ) unit. Invoice for contract labor supply - December 2025.",
                taxRate: "15%",
                taxableAmount: "₹ 83,333.33",
                serviceCategory: "Manpower Supply",
                sacCode: "998519",
                counterparty: "Tech Park SEZ Ltd",
                location: "Bangalore SEZ",
                status: "Posted",
                attachments: 1
            },
            {
                date: "14-Jan-2026",
                voucherNo: "ST-INV/2026/0041",
                entryType: "Invoice",
                debit: 0,
                credit: 8750.00,
                balance: "₹ 40,000.00 Cr",
                narration: "Service Tax @ 15% on security services provided to government project. Invoice amount includes service tax on contracted security personnel deployment.",
                taxRate: "15%",
                taxableAmount: "₹ 58,333.33",
                serviceCategory: "Security Services",
                sacCode: "998522",
                counterparty: "Govt Infrastructure",
                location: "Delhi NCR",
                status: "Posted",
                attachments: 2
            },
            {
                date: "22-Jan-2026",
                voucherNo: "ST-PMT/2026/008",
                entryType: "Payment",
                debit: 15000.00,
                credit: 0,
                balance: "₹ 25,000.00 Cr",
                narration: "Service Tax payment to Government via Challan GAR-7. Payment for service tax liability for December 2025. Challan No: ST/2026/00892.",
                taxRate: "15%",
                taxableAmount: "₹ 1,00,000.00",
                serviceCategory: "Various Services",
                sacCode: "Multiple",
                counterparty: "Service Tax Dept",
                location: "Online Payment",
                status: "Posted",
                attachments: 1
            },
            {
                date: "28-Jan-2026",
                voucherNo: "ST-INV/2026/0052",
                entryType: "Invoice",
                debit: 0,
                credit: 6250.00,
                balance: "₹ 31,250.00 Cr",
                narration: "Service Tax @ 15% on facility management services. Invoice for housekeeping and maintenance services provided to export-oriented unit (EOU).",
                taxRate: "15%",
                taxableAmount: "₹ 41,666.67",
                serviceCategory: "Facility Management",
                sacCode: "998591",
                counterparty: "Export Unit Pvt Ltd",
                location: "Mumbai EOU",
                status: "Draft",
                attachments: 0
            }
        ],
        totalDebit: 15000.00,
        totalCredit: 27500.00,
        closingBalance: "₹ 31,250.00 Cr"
    }
};
