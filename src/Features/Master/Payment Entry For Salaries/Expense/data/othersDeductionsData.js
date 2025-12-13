// Account Information
export const accountInfo = {
    glCode: "X2001001007",
    accountName: "OTHER DEDUCTIONS EXPENSE",
    accountType: "Expense (P&L Account)",
    parentAccount: "BRANCH MANAGEMENT SALARY COST (X2001001)",
    financialStatement: "Profit & Loss Statement",
    natureOfAccount: "Debit Balance (Normal)",
    costCenter: "HR Department",
    department: "Payroll",
    mappedSalaryHeads: "Multiple (Professional Tax, Union Dues, etc.)"
};

// Summary Data
export const summaryData = [
    {
        id: 1,
        title: "Total Debit",
        value: "₹2,45,000.00",
        label: "Total expense incurred",
        type: "debit"
    },
    {
        id: 2,
        title: "Total Credit",
        value: "₹1,85,000.00",
        label: "Reversals/Adjustments",
        type: "credit"
    },
    {
        id: 3,
        title: "Net Balance",
        value: "₹60,000.00",
        label: "Net expense (Dr)",
        type: "balance"
    },
    {
        id: 4,
        title: "Total Entries",
        value: "156",
        label: "Transaction count",
        type: "count"
    }
];

// Ledger Data
export const ledgerData = [
    {
        id: 1,
        date: "2024-01-05",
        voucherNo: "PV-2024-001",
        voucherType: "Payment",
        particulars: "Professional Tax",
        costCenter: "HR Department",
        department: "Payroll",
        debit: "12,500.00",
        credit: "-",
        balance: "12,500.00",
        narration: "Professional Tax - January 2024",
        status: "posted"
    },
    {
        id: 2,
        date: "2024-01-05",
        voucherNo: "PV-2024-002",
        voucherType: "Payment",
        particulars: "Union Dues",
        costCenter: "HR Department",
        department: "Payroll",
        debit: "8,750.00",
        credit: "-",
        balance: "21,250.00",
        narration: "Union Membership Dues",
        status: "posted"
    },
    {
        id: 3,
        date: "2024-01-12",
        voucherNo: "JV-2024-015",
        voucherType: "Journal",
        particulars: "Advance Salary Deduction",
        costCenter: "Finance",
        department: "Accounts",
        debit: "25,000.00",
        credit: "-",
        balance: "46,250.00",
        narration: "Recovery of advance salary",
        status: "posted"
    },
    {
        id: 4,
        date: "2024-01-15",
        voucherNo: "PV-2024-023",
        voucherType: "Payment",
        particulars: "Loan Recovery",
        costCenter: "HR Department",
        department: "Payroll",
        debit: "15,000.00",
        credit: "-",
        balance: "61,250.00",
        narration: "Employee loan installment",
        status: "posted"
    },
    {
        id: 5,
        date: "2024-01-20",
        voucherNo: "JV-2024-028",
        voucherType: "Journal",
        particulars: "Canteen Charges",
        costCenter: "Administration",
        department: "Facilities",
        debit: "6,500.00",
        credit: "-",
        balance: "67,750.00",
        narration: "Monthly canteen subscription",
        status: "posted"
    },
    {
        id: 6,
        date: "2024-01-25",
        voucherNo: "PV-2024-034",
        voucherType: "Payment",
        particulars: "Income Tax TDS",
        costCenter: "Finance",
        department: "Accounts",
        debit: "45,000.00",
        credit: "-",
        balance: "112,750.00",
        narration: "TDS on salary - January 2024",
        status: "posted"
    },
    {
        id: 7,
        date: "2024-01-28",
        voucherNo: "JV-2024-041",
        voucherType: "Journal",
        particulars: "Insurance Premium",
        costCenter: "HR Department",
        department: "Payroll",
        debit: "18,250.00",
        credit: "-",
        balance: "131,000.00",
        narration: "Employee insurance deduction",
        status: "posted"
    },
    {
        id: 8,
        date: "2024-02-01",
        voucherNo: "PV-2024-045",
        voucherType: "Payment",
        particulars: "Welfare Fund",
        costCenter: "HR Department",
        department: "Payroll",
        debit: "10,000.00",
        credit: "-",
        balance: "141,000.00",
        narration: "Employee welfare fund contribution",
        status: "posted"
    },
    {
        id: 9,
        date: "2024-02-05",
        voucherNo: "JV-2024-052",
        voucherType: "Journal",
        particulars: "Transport Charges",
        costCenter: "Administration",
        department: "Facilities",
        debit: "7,800.00",
        credit: "-",
        balance: "148,800.00",
        narration: "Monthly transport deduction",
        status: "posted"
    },
    {
        id: 10,
        date: "2024-02-10",
        voucherNo: "PV-2024-058",
        voucherType: "Payment",
        particulars: "Notice Pay Recovery",
        costCenter: "HR Department",
        department: "Payroll",
        debit: "35,000.00",
        credit: "-",
        balance: "183,800.00",
        narration: "Notice period short serving",
        status: "pending"
    }
];

// Filter Options
export const filterOptions = {
    voucherTypes: [
        { value: "all", label: "All Types" },
        { value: "payment", label: "Payment Voucher" },
        { value: "journal", label: "Journal Voucher" },
        { value: "contra", label: "Contra Voucher" }
    ],
    costCenters: [
        { value: "all", label: "All Cost Centers" },
        { value: "hr", label: "HR Department" },
        { value: "admin", label: "Administration" },
        { value: "finance", label: "Finance" },
        { value: "operations", label: "Operations" }
    ],
    statuses: [
        { value: "all", label: "All Status" },
        { value: "posted", label: "Posted" },
        { value: "pending", label: "Pending" }
    ]
};