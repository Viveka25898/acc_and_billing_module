export const accountInfo = {
    glCode: "L2002004",
    accountName: "LWF PAYABLE - EMPLOYER SHARE",
    accountType: "Current Liability",
    parentAccount: "LIABILITY-EMPLOYEES (L2001)",
    financialStatement: "Balance Sheet",
    natureOfAccount: "Credit Balance (Normal)",
    mappedSalaryHeads: "1 Head (LWF - Employer)",

};
export const periods = [
    { value: 'fy-2025-26', label: 'FY 2025-25' },
    { value: 'fy-2025-25', label: 'FY 2023-25' },
    { value: 'q1-2025', label: 'Q1 (Apr-Jun)' },
    { value: 'q2-2025', label: 'Q2 (Jul-Sep)' },
    { value: 'q3-2025', label: 'Q3 (Oct-Dec)' },
    { value: 'q4-2025', label: 'Q4 (Jan-Mar)' }
];

export const states = [
    { value: 'all', label: 'All States' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'west-bengal', label: 'West Bengal' }
];

export const statuses = [
    { value: 'all', label: 'All Transactions' },
    { value: 'pending', label: 'Pending Payments' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' }
];
export const summaryData = [
    {
        title: "Opening Balance",
        value: "₹25,480.00",
        label: "As on 01-Apr-2025",
        type: "credit"
    },
    {
        title: "Total Credits (Accrued)",
        value: "₹1,69,455.00",
        label: "Employer contributions added",
        type: "credit"
    },
    {
        title: "Total Debits (Paid)",
        value: "₹1,39,880.00",
        label: "Payments made to authorities",
        type: "debit"
    },
    {
        title: "Current Balance",
        value: "₹29,575.00",
        label: "Outstanding liability (Cr)",
        type: "balance"
    },
    {
        title: "Pending Payments",
        value: "₹29,575.00",
        label: "Awaiting remittance",
        type: "pending"
    },
    {
        title: "Aging (0-30 days)",
        value: "₹29,575.00",
        label: "Within due date",
        type: "aging"
    }
];

export const ledgerData = [
    {
        month: "APRIL 2025",
        isHeader: true
    },
    {
        date: "01-Apr-25",
        voucherNo: "OB-001",
        type: "Opening",
        state: "Multi-State",
        particulars: "Opening Balance B/F (March 2025 liability)",
        empCount: "-",
        debit: "-",
        credit: "-",
        balance: "25,480.00",
        balType: "Cr",
        status: "pending",
        dueDate: "05-Apr-25"
    },
    {
        date: "05-Apr-25",
        voucherNo: "PAY-001",
        type: "Payment",
        state: "Maharashtra",
        particulars: "Payment to Maharashtra LWF Board - March 2025",
        details: "Challan: MLWFB/2025/001120",
        empCount: "85",
        debit: "25,480.00",
        credit: "-",
        balance: "0.00",
        balType: "-",
        status: "paid",
        dueDate: "-"
    },
    {
        date: "30-Apr-25",
        voucherNo: "JV-125",
        type: "Journal",
        state: "Maharashtra",
        particulars: "Accrual - Employer LWF Contribution April 2025",
        details: "85 employees @ ₹75 per half-year",
        empCount: "85",
        debit: "-",
        credit: "6,375.00",
        balance: "6,375.00",
        balType: "Cr",
        status: "pending",
        dueDate: "15-Jun-25"
    },
    {
        date: "30-Apr-25",
        voucherNo: "JV-126",
        type: "Journal",
        state: "Karnataka",
        particulars: "Accrual - Employer LWF Contribution April 2025",
        details: "42 employees @ ₹40 annual (provision)",
        empCount: "42",
        debit: "-",
        credit: "1,680.00",
        balance: "8,055.00",
        balType: "Cr",
        status: "pending",
        dueDate: "31-Dec-25"
    },
    {
        month: "MAY 2025",
        isHeader: true
    },
    // Add more months data as needed...
    {
        month: "AGING ANALYSIS (As on 30-Sep-2025)",
        isHeader: true
    },
    {
        isAging: true,
        category: "0-30 Days (Current)",
        balance: "30,600.00",
        balType: "Cr",
        status: "pending",
        dueDate: "Within Due"
    },
    {
        isTotal: true,
        label: "PERIOD TOTAL (Apr-Sep 2025)",
        debit: "43,686.00",
        credit: "48,806.00",
        balance: "30,600.00",
        balType: "Cr",
        status: "Outstanding Liability"
    }
];

export const footerSections = [
    {
        title: "📊 Liability Account Treatment",
        items: [
            "Credit Entry: When employer LWF contribution is accrued from payroll (increases liability)",
            "Debit Entry: When payment is made to LWF authorities (decreases liability)",
            "Normal Balance: Credit (represents amount owed to government)",
            "Financial Statement: Balance Sheet under Current Liabilities",
            "Classification: Short-term liability (payable within operating cycle)",
            "Contra Account: Linked to Employer LWF Contribution expense (X2001001004)"
        ]
    },
    {
        title: "📝 Standard Journal Entries",
        items: [
            "Accrual Entry (Monthly): Dr. Employer LWF Contribution (Expense) Cr. LWF Payable - Employer Share (THIS A/C)",
            "Payment Entry: Dr. LWF Payable - Employer Share (THIS A/C) Cr. Bank Account",
            "Adjustment (if any): Dr/Cr. LWF Payable - Employer Share Cr/Dr. Employer LWF Contribution",
            "Interest on Late Payment: Dr. Penal Interest Expense Cr. LWF Payable - Employer Share"
        ]
    },
    {
        title: "⚖️ Statutory Compliance Checklist",
        items: [
            "Payment must be made within statutory timeline (15-30 days post month-end)",
            "Separate tracking required for each state jurisdiction",
            "Maintain payment challans and receipts for audit trail",
            "Reconcile liability account with payment records monthly",
            "File returns as per state-specific schedules",
            "Late payment attracts penalties @ 5-15% per annum (varies by state)",
            "Include in year-end audit confirmation with authorities",
            "Ensure proper authorization for payment processing"
        ]
    },
    {
        title: "🎯 Reconciliation Best Practices",
        items: [
            "Monthly reconciliation of liability balance with expense account",
            "Match accrued amounts with payroll register for employee count",
            "Verify payment amounts against state-specific contribution rates",
            "Track aging analysis to identify overdue payments",
            "Maintain sub-ledgers for multi-state operations",
            "Cross-verify payment challans with bank statements",
            "Document rate changes and effective dates",
            "Year-end: Ensure all accruals match actual obligations"
        ]
    },
    {
        title: "💡 Software Integration Features",
        items: [
            "Tally ERP: Auto-posting from payroll vouchers, statutory reports",
            "QuickBooks: Liability tracking, payment reminders, aging reports",
            "SAP/Oracle: Multi-entity consolidation, workflow approvals",
            "Zoho Books: Automated accrual entries, payment scheduling",
            "Common Features: Sub-ledger management, state-wise tracking, compliance alerts",
            "Reporting: Aging analysis, payment forecasting, variance reports",
            "Automation: Auto-reverse on payment, recurring journal entries"
        ]
    },
    {
        title: "📌 Critical Reminders",
        items: [
            "This is a LIABILITY account, not an expense account",
            "Credit balance = Amount owed to government authorities",
            "Zero or debit balance indicates overpayment or error",
            "Must be settled within statutory payment timeline",
            "Aging analysis critical for compliance management",
            "State-wise segregation mandatory for multi-state entities",
            "Payment evidence must be retained for 7+ years",
            "Include in quarterly board reports as statutory liability"
        ]
    }
];