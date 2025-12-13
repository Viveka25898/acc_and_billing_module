// Account Information
export const accountInfo = {
    glCode: "X2001001005",
    accountName: "LEAVE PROVISION EXPENSE",
    accountType: "Expense (P&L Account)",
    parentAccount: "BRANCH MANAGEMENT SALARY COST (X2001001)",
    financialStatement: "Profit & Loss Statement",
    natureOfAccount: "Debit Balance (Normal)",
    mappedSalaryHeads: "1 Head (Leave Provision)",
    taxTreatment: "Allowable u/s 43B (on payment)",
    costCenter: "Branch Management",
    accountingStandard: "AS 15 / Ind AS 19",
    provisionMethod: "Actuarial Valuation",
    lastActuarialDate: "31-Mar-2024",
    nextValuationDate: "31-Mar-2025"
};

// Summary Data with Enhanced Metrics
export const summaryData = [
    {
        id: 1,
        title: "Opening Balance",
        value: "₹0.00",
        label: "As on 01-Apr-2024",
        type: "debit",
        trend: "flat",
        tooltip: "No opening balance as new fiscal year"
    },
    {
        id: 2,
        title: "Total Provisions (Debit)",
        value: "₹3,78,450.00",
        label: "Monthly accruals",
        type: "debit",
        trend: "up",
        tooltip: "Cumulative provision for H1 FY 2024-25"
    },
    {
        id: 3,
        title: "Total Reversals (Credit)",
        value: "₹7,975.00",
        label: "Actuarial adjustments",
        type: "credit",
        trend: "down",
        tooltip: "Actuarial gain due to lower utilization"
    },
    {
        id: 4,
        title: "Closing Balance",
        value: "₹3,78,450.00",
        label: "Net provision expense (Dr)",
        type: "debit",
        trend: "up",
        tooltip: "Net expense after actuarial adjustments"
    },
    {
        id: 5,
        title: "Average Monthly",
        value: "₹63,075.00",
        label: "Per month provision",
        type: "neutral",
        trend: "stable",
        tooltip: "Average monthly provision amount"
    },
    {
        id: 6,
        title: "YTD vs Budget",
        value: "+2.5%",
        label: "Variance analysis",
        type: "variance",
        trend: "over",
        tooltip: "2.5% over budget due to salary increments"
    },
    {
        id: 7,
        title: "Leave Liability",
        value: "₹15.85L",
        label: "Total actuarial liability",
        type: "liability",
        trend: "up",
        tooltip: "Total leave encashment liability"
    },
    {
        id: 8,
        title: "Utilization Rate",
        value: "12%",
        label: "Actual vs Provision",
        type: "utilization",
        trend: "under",
        tooltip: "Actual leave utilization against provision"
    }
];

// Enhanced Ledger Data with Additional Accounting Fields
export const ledgerData = [
    {
        id: "apr-2024",
        month: "APRIL 2024",
        isHeader: true,
        periodType: "month",
        financialPeriod: "Q1 FY24-25"
    },
    {
        id: "opening-balance",
        date: "01-Apr-24",
        voucherNo: "OB-001",
        voucherType: "Opening",
        particulars: "Opening Balance B/F (FY 2024-25)",
        employeeCount: "-",
        leaveDays: "-",
        debit: "-",
        credit: "-",
        runningBalance: "0.00",
        journalRef: "-",
        costCenter: "All",
        accountingPeriod: "2024-25",
        status: "posted",
        approvedBy: "System",
        postingDate: "01-Apr-2024"
    },
    {
        id: "apr-provision",
        date: "30-Apr-24",
        voucherNo: "JV-125",
        voucherType: "Journal",
        particulars: "Monthly provision for leave encashment - April 2024",
        details: "Based on actuarial valuation report dated 31-Mar-2024",
        employeeCount: "85",
        leaveDays: "1,785",
        debit: "62,750.00",
        credit: "-",
        runningBalance: "62,750.00",
        journalRef: "JV-125",
        costCenter: "Branch Management",
        accountingPeriod: "2024-25",
        status: "posted",
        approvedBy: "Finance Controller",
        postingDate: "30-Apr-2024",
        actuarialReference: "ACT/2024/MAR",
        provisionRate: "₹35.15 per day",
        calculationBasis: "Actuarial Valuation"
    },
    // Add more months similarly...
    {
        id: "sept-actuarial",
        date: "30-Sep-24",
        voucherNo: "JV-346",
        voucherType: "Journal",
        particulars: "Actuarial adjustment - H1 FY 2024-25",
        details: "Reversal due to lower-than-estimated utilization | Actuarial gain",
        employeeCount: "-",
        leaveDays: "-",
        debit: "-",
        credit: "7,975.00",
        runningBalance: "3,78,450.00",
        journalRef: "JV-346",
        costCenter: "Corporate",
        accountingPeriod: "2024-25",
        status: "posted",
        approvedBy: "CFO",
        postingDate: "30-Sep-2024",
        actuarialReference: "ACT/2024/SEP/H1",
        adjustmentType: "Actuarial Gain",
        reason: "Lower actual utilization than projected"
    }
];

// Actuarial Assumptions (Critical for Leave Provision)
export const actuarialAssumptions = {
    valuationMethod: "Projected Unit Credit Method",
    discountRate: "6.5% p.a.",
    salaryEscalation: "8% p.a.",
    attritionRate: "15% p.a.",
    retirementAge: 60,
    vestingPeriod: "5 years",
    leaveEncashmentPolicy: "On retirement/resignation",
    lastValuationDate: "31-Mar-2024",
    nextValuationDate: "31-Mar-2025",
    valuerName: "ABC Actuarial Services",
    certificateNumber: "ACT/2024/7890"
};

// Compliance & Reporting Requirements
export const complianceRequirements = [
    {
        standard: "AS 15 / Ind AS 19",
        requirement: "Employee Benefits Accounting",
        frequency: "Annual",
        deadline: "Year-end",
        penalty: "Qualified Audit Report"
    },
    {
        standard: "Companies Act 2013",
        requirement: "Disclosure in Financial Statements",
        frequency: "Annual",
        deadline: "AGM Date",
        penalty: "Regulatory fines"
    },
    {
        standard: "Income Tax Act",
        requirement: "Allowable u/s 43B on payment",
        frequency: "Annual",
        deadline: "Tax Filing",
        penalty: "Disallowance of expense"
    },
    {
        standard: "GST",
        requirement: "Not applicable (employee cost)",
        frequency: "N/A",
        deadline: "N/A",
        penalty: "N/A"
    }
];