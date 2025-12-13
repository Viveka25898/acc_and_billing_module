// Account Information
export const accountInfo = {
    glCode: "L2002006",
    accountName: "EMPLOYEE CONTRIBUTION TOWARDS PF PAYABLE",
    accountType: "Current Liability",
    parentAccount: "LIABILITY-EMPLOYEES (L2002)",
    financialStatement: "Balance Sheet",
    natureOfAccount: "Credit Balance (Normal)",
    statutoryAct: "Employees' Provident Funds Act, 1952",
    department: "HR & Payroll"
};

// Summary Data
export const summaryData = [
    {
        id: 1,
        title: "Total PF Liability (Employee)",
        value: "₹3,85,400.00",
        label: "Total employee contributions",
        type: "liability"
    },
    {
        id: 2,
        title: "Total Paid to EPFO",
        value: "₹3,25,000.00",
        label: "Remitted to EPFO account",
        type: "paid"
    },
    {
        id: 3,
        title: "Outstanding Liability",
        value: "₹60,400.00",
        label: "Unpaid contributions",
        type: "unpaid"
    },
    {
        id: 4,
        title: "Total Transactions",
        value: "148",
        label: "Journal & Payment entries",
        type: "count"
    }
];

// Ledger Data
export const ledgerData = [
    {
        id: 1,
        date: "2024-01-31",
        voucherNo: "JV-2024-001",
        voucherType: "Journal",
        month: "January 2024",
        particulars: "Employee PF Contribution",
        debit: "-",
        credit: "28,500.00",
        balance: "28,500.00",
        dueDate: "2024-02-15",
        paymentDate: "2024-02-10",
        challanNo: "EPFO/24/00125",
        status: "paid"
    },
    {
        id: 2,
        date: "2024-02-10",
        voucherNo: "PV-2024-018",
        voucherType: "Payment",
        month: "January 2024",
        particulars: "Payment to EPFO - Jan PF",
        debit: "28,500.00",
        credit: "-",
        balance: "0.00",
        dueDate: "-",
        paymentDate: "2024-02-10",
        challanNo: "EPFO/24/00125",
        status: "paid"
    },
    {
        id: 3,
        date: "2024-02-28",
        voucherNo: "JV-2024-025",
        voucherType: "Journal",
        month: "February 2024",
        particulars: "Employee PF Contribution",
        debit: "-",
        credit: "29,200.00",
        balance: "29,200.00",
        dueDate: "2024-03-15",
        paymentDate: "2024-03-12",
        challanNo: "EPFO/24/00186",
        status: "paid"
    },
    {
        id: 4,
        date: "2024-03-12",
        voucherNo: "PV-2024-042",
        voucherType: "Payment",
        month: "February 2024",
        particulars: "Payment to EPFO - Feb PF",
        debit: "29,200.00",
        credit: "-",
        balance: "0.00",
        dueDate: "-",
        paymentDate: "2024-03-12",
        challanNo: "EPFO/24/00186",
        status: "paid"
    },
    {
        id: 5,
        date: "2024-10-31",
        voucherNo: "JV-2024-278",
        voucherType: "Journal",
        month: "October 2024",
        particulars: "Employee PF Contribution",
        debit: "-",
        credit: "30,200.00",
        balance: "30,200.00",
        dueDate: "2024-11-15",
        paymentDate: "-",
        challanNo: "-",
        status: "unpaid"
    },
    {
        id: 6,
        date: "2024-11-30",
        voucherNo: "JV-2024-295",
        voucherType: "Journal",
        month: "November 2024",
        particulars: "Employee PF Contribution",
        debit: "-",
        credit: "30,200.00",
        balance: "60,400.00",
        dueDate: "2024-12-15",
        paymentDate: "-",
        challanNo: "-",
        status: "unpaid"
    }
];

// Filter Options
export const filterOptions = {
    months: [
        { value: "all", label: "All Months" },
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