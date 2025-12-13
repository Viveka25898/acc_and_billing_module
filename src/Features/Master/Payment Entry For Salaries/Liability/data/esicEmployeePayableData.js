// Account Information
export const accountInfo = {
    glCode: "L2002007",
    accountName: "ESIC PAYABLE - EMPLOYEE SHARE",
    accountType: "Current Liability",
    parentAccount: "LIABILITY-EMPLOYEES (L2002)",
    financialStatement: "Balance Sheet",
    natureOfAccount: "Credit Balance (Normal)",
    statutoryAct: "Employees' State Insurance Act, 1948",
    contributionRate: "0.75% of salary",
    dueDate: "21st of following month",
    department: "HR & Payroll"
};

// Summary Data
export const summaryData = [
    {
        id: 1,
        title: "Total ESIC Liability",
        value: "₹94,850.00",
        label: "Employee share @ 0.75%",
        type: "liability"
    },
    {
        id: 2,
        title: "Total Paid to ESIC",
        value: "₹80,500.00",
        label: "Remitted to ESIC account",
        type: "paid"
    },
    {
        id: 3,
        title: "Outstanding Liability",
        value: "₹14,350.00",
        label: "Unpaid contributions",
        type: "unpaid"
    },
    {
        id: 4,
        title: "Total Transactions",
        value: "136",
        label: "Journal & Payment entries",
        type: "count"
    }
];

// Ledger Data
export const ledgerData = [
    {
        id: 1,
        date: "2024-01-31",
        voucherNo: "JV-2024-002",
        voucherType: "Journal",
        period: "Jan 2024",
        particulars: "Employee ESIC Contribution @ 0.75%",
        debit: "-",
        credit: "7,125.00",
        balance: "7,125.00",
        dueDate: "2024-02-21",
        paymentDate: "2024-02-19",
        challanNo: "ESIC/24/00145",
        status: "paid"
    },
    {
        id: 2,
        date: "2024-02-19",
        voucherNo: "PV-2024-019",
        voucherType: "Payment",
        period: "Jan 2024",
        particulars: "Payment to ESIC - Jan Contribution",
        debit: "7,125.00",
        credit: "-",
        balance: "0.00",
        dueDate: "-",
        paymentDate: "2024-02-19",
        challanNo: "ESIC/24/00145",
        status: "paid"
    },
    {
        id: 3,
        date: "2024-02-29",
        voucherNo: "JV-2024-026",
        voucherType: "Journal",
        period: "Feb 2024",
        particulars: "Employee ESIC Contribution @ 0.75%",
        debit: "-",
        credit: "7,300.00",
        balance: "7,300.00",
        dueDate: "2024-03-21",
        paymentDate: "2024-03-18",
        challanNo: "ESIC/24/00198",
        status: "paid"
    },
    {
        id: 4,
        date: "2024-03-18",
        voucherNo: "PV-2024-043",
        voucherType: "Payment",
        period: "Feb 2024",
        particulars: "Payment to ESIC - Feb Contribution",
        debit: "7,300.00",
        credit: "-",
        balance: "0.00",
        dueDate: "-",
        paymentDate: "2024-03-18",
        challanNo: "ESIC/24/00198",
        status: "paid"
    },
    {
        id: 5,
        date: "2024-10-31",
        voucherNo: "JV-2024-279",
        voucherType: "Journal",
        period: "Oct 2024",
        particulars: "Employee ESIC Contribution @ 0.75%",
        debit: "-",
        credit: "7,550.00",
        balance: "7,550.00",
        dueDate: "2024-11-21",
        paymentDate: "-",
        challanNo: "-",
        status: "unpaid"
    },
    {
        id: 6,
        date: "2024-11-30",
        voucherNo: "JV-2024-296",
        voucherType: "Journal",
        period: "Nov 2024",
        particulars: "Employee ESIC Contribution @ 0.75%",
        debit: "-",
        credit: "6,800.00",
        balance: "14,350.00",
        dueDate: "2024-12-21",
        paymentDate: "-",
        challanNo: "-",
        status: "unpaid"
    }
];

// Filter Options
export const filterOptions = {
    periods: [
        { value: "all", label: "All Periods" },
        { value: "jan", label: "January 2024" },
        { value: "feb", label: "February 2024" },
        { value: "mar", label: "March 2024" },
        { value: "apr", label: "April 2024" },
        { value: "may", label: "May 2024" }
    ],
    voucherTypes: [
        { value: "all", label: "All Types" },
        { value: "journal", label: "Journal Voucher" },
        { value: "payment", label: "Payment Voucher" }
    ],
    statuses: [
        { value: "all", label: "All Status" },
        { value: "paid", label: "Paid" },
        { value: "unpaid", label: "Unpaid" }
    ]
};