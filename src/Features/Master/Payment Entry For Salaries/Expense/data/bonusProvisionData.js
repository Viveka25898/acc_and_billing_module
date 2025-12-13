// Account Information
export const accountInfo = {
    glCode: "X2001001006",
    accountName: "BONUS PROVISION EXPENSE",
    accountType: "Expense (P&L Account)",
    parentAccount: "BRANCH MANAGEMENT SALARY COST (X2001001)",
    financialStatement: "Profit & Loss Statement",
    natureOfAccount: "Debit Balance (Normal)",
    statutoryAct: "Payment of Bonus Act, 1965"
};

// Summary Data
export const summaryData = [
    {
        id: 1,
        title: "Opening Balance",
        value: "₹0.00",
        label: "As on 01-Apr-2024",
        type: "debit"
    },
    {
        id: 2,
        title: "Total Provisions (Debit)",
        value: "₹3,18,500.00",
        label: "Monthly accruals (6 months)",
        type: "debit"
    },
    {
        id: 3,
        title: "Total Adjustments",
        value: "₹0.00",
        label: "Reversals/corrections",
        type: "neutral"
    },
    {
        id: 4,
        title: "Closing Balance",
        value: "₹3,18,500.00",
        label: "As on 30-Sep-2024 (Dr)",
        type: "debit"
    },
    {
        id: 5,
        title: "Average Monthly",
        value: "₹53,083.33",
        label: "Per month provision",
        type: "neutral"
    },
    {
        id: 6,
        title: "Bonus Rate",
        value: "8.33%",
        label: "Statutory minimum",
        type: "rate"
    }
];

// Ledger Data
export const ledgerData = [
    {
        id: 1,
        date: "01-Apr-24",
        voucherNo: "OB-001",
        type: "Opening",
        costCenter: "All Centers",
        particulars: "Opening Balance B/F (FY 2024-25)",
        employeeCount: "-",
        wageBase: "-",
        debit: "-",
        credit: "-",
        balance: "0.00",
        journalRef: "-"
    },
    {
        id: 2,
        date: "30-Apr-24",
        voucherNo: "JV-125",
        type: "Journal",
        costCenter: "Branch Mgmt",
        particulars: "Monthly bonus provision - April 2024",
        details: "85 employees @ 8.33% of wage ceiling ₹7,000 | Cr: Provision for Bonus Payable (Liability)",
        employeeCount: "85",
        wageBase: "5,95,000.00",
        debit: "49,563.50",
        credit: "-",
        balance: "49,563.50",
        journalRef: "JV-125"
    },
    {
        id: 3,
        date: "31-May-24",
        voucherNo: "JV-168",
        type: "Journal",
        costCenter: "Branch Mgmt",
        particulars: "Monthly bonus provision - May 2024",
        details: "86 employees @ 8.33% | Wage base: ₹6,02,000",
        employeeCount: "86",
        wageBase: "6,02,000.00",
        debit: "50,146.60",
        credit: "-",
        balance: "99,710.10",
        journalRef: "JV-168"
    },
    {
        id: 4,
        date: "30-Jun-24",
        voucherNo: "JV-210",
        type: "Journal",
        costCenter: "Branch Mgmt",
        particulars: "Monthly bonus provision - June 2024",
        details: "87 employees @ 8.33% | Q1 closing provision",
        employeeCount: "87",
        wageBase: "6,09,000.00",
        debit: "50,729.70",
        credit: "-",
        balance: "1,50,439.80",
        journalRef: "JV-210"
    },
    {
        id: 5,
        date: "31-Jul-24",
        voucherNo: "JV-254",
        type: "Journal",
        costCenter: "Branch Mgmt",
        particulars: "Monthly bonus provision - July 2024",
        details: "87 employees @ 8.33% | Wage base: ₹6,09,000",
        employeeCount: "87",
        wageBase: "6,09,000.00",
        debit: "50,729.70",
        credit: "-",
        balance: "2,01,169.50",
        journalRef: "JV-254"
    },
    {
        id: 6,
        date: "31-Aug-24",
        voucherNo: "JV-298",
        type: "Journal",
        costCenter: "Branch Mgmt",
        particulars: "Monthly bonus provision - August 2024",
        details: "88 employees @ 8.33% | Wage base: ₹6,16,000 | Includes salary increment effect from Jul-24",
        employeeCount: "88",
        wageBase: "6,16,000.00",
        debit: "51,312.80",
        credit: "-",
        balance: "2,52,482.30",
        journalRef: "JV-298"
    },
    {
        id: 7,
        date: "30-Sep-24",
        voucherNo: "JV-345",
        type: "Journal",
        costCenter: "Branch Mgmt",
        particulars: "Monthly bonus provision - September 2024",
        details: "90 employees @ 8.33% | Wage base: ₹6,30,000 | H1 closing provision",
        employeeCount: "90",
        wageBase: "6,30,000.00",
        debit: "52,479.00",
        credit: "-",
        balance: "3,04,961.30",
        journalRef: "JV-345"
    },
    {
        id: 8,
        date: "30-Sep-24",
        voucherNo: "JV-346",
        type: "Allocation",
        costCenter: "Operations",
        particulars: "Cost center allocation adjustment - H1 FY 2024-25",
        details: "Portion allocated to Operations cost center | 15% of total provision",
        employeeCount: "15",
        wageBase: "1,05,000.00",
        debit: "13,538.70",
        credit: "-",
        balance: "3,18,500.00",
        journalRef: "JV-346"
    }
];

// Footer Data
export const footerData = [
    {
        title: "Bonus Act Compliance",
        items: [
            "Payment of Bonus Act, 1965 applicable",
            "8.33% statutory minimum (20% maximum)",
            "Eligibility: Employees earning ≤ ₹21,000 per month",
            "Payment deadline: Within 8 months of accounting year end"
        ]
    },
    {
        title: "Tax Treatment",
        items: [
            "Deductible business expense under Section 37(1)",
            "Tax deductible on accrual basis",
            "No TDS on accrual, only on payment",
            "Form 3 - Bonus Return filing required"
        ]
    }
];