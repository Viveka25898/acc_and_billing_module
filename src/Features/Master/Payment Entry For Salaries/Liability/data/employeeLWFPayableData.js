// Account Information
export const accountInfo = {
    glCode: "L2002008",
    accountName: "LWF PAYABLE - EMPLOYEE SHARE",
    accountType: "Current Liability",
    parentAccount: "LABOUR WELFARE FUND LIABILITY",
    financialStatement: "Balance Sheet",
    natureOfAccount: "Credit Balance (Normal)",
    statutoryAct: "Labour Welfare Fund Act (State-wise)",
    contributionType: "Employee Share",
    paymentFrequency: "Half Yearly/Annual (State-specific)",
    department: "HR & Payroll"
};

// Summary Data
export const summaryData = [
    {
        id: 1,
        title: "Total LWF Liability (Employee)",
        value: "₹ 46,200.00",
        label: "Current financial year",
        type: "liability"
    },
    {
        id: 2,
        title: "Total Paid to Board",
        value: "₹ 23,100.00",
        label: "Remitted to LWF Boards",
        type: "paid"
    },
    {
        id: 3,
        title: "Outstanding Liability",
        value: "₹ 23,100.00",
        label: "Unpaid contributions",
        type: "unpaid"
    },
    {
        id: 4,
        title: "Total Transactions",
        value: "82",
        label: "Journal & Payment entries",
        type: "count"
    }
];

// Ledger Data
export const ledgerData = [
    {
        id: 1,
        date: "2024-06-30",
        voucherNo: "JV-2024-147",
        voucherType: "Journal",
        period: "H1-2024",
        state: "Maharashtra",
        particulars: "Employee LWF - Maharashtra (30 EE @ 20)",
        debit: "-",
        credit: "600.00",
        balance: "600.00",
        dueDate: "2024-07-31",
        paymentDate: "2024-07-25",
        receiptNo: "MH/LWF/24/1523",
        status: "paid"
    },
    {
        id: 2,
        date: "2024-06-30",
        voucherNo: "JV-2024-148",
        voucherType: "Journal",
        period: "H1-2024",
        state: "Karnataka",
        particulars: "Employee LWF - Karnataka (25 EE @ 10)",
        debit: "-",
        credit: "250.00",
        balance: "850.00",
        dueDate: "2024-12-31",
        paymentDate: "2024-12-20",
        receiptNo: "KA/LWF/24/2145",
        status: "paid"
    },
    {
        id: 3,
        date: "2024-06-30",
        voucherNo: "JV-2024-149",
        voucherType: "Journal",
        period: "H1-2024",
        state: "Tamil Nadu",
        particulars: "Employee LWF - Tamil Nadu (40 EE @ 20)",
        debit: "-",
        credit: "800.00",
        balance: "1,650.00",
        dueDate: "2024-12-31",
        paymentDate: "2024-12-22",
        receiptNo: "TN/LWF/24/3421",
        status: "paid"
    },
    {
        id: 4,
        date: "2024-06-30",
        voucherNo: "JV-2024-150",
        voucherType: "Journal",
        period: "H1-2024",
        state: "Gujarat",
        particulars: "Employee LWF - Gujarat Jun (20 EE @ 6)",
        debit: "-",
        credit: "120.00",
        balance: "1,770.00",
        dueDate: "2024-07-31",
        paymentDate: "2024-07-28",
        receiptNo: "GJ/LWF/24/1687",
        status: "paid"
    },
    {
        id: 5,
        date: "2024-07-25",
        voucherNo: "PV-2024-164",
        voucherType: "Payment",
        period: "H1-2024",
        state: "Maharashtra",
        particulars: "Payment to Maharashtra LWF Board",
        debit: "600.00",
        credit: "-",
        balance: "1,635.00",
        dueDate: "-",
        paymentDate: "2024-07-25",
        receiptNo: "MH/LWF/24/1523",
        status: "paid"
    },
    {
        id: 6,
        date: "2024-07-28",
        voucherNo: "PV-2024-168",
        voucherType: "Payment",
        period: "H1-2024",
        state: "Gujarat",
        particulars: "Payment to Gujarat LWF Board - Jun",
        debit: "120.00",
        credit: "-",
        balance: "1,515.00",
        dueDate: "-",
        paymentDate: "2024-07-28",
        receiptNo: "GJ/LWF/24/1687",
        status: "paid"
    },
    {
        id: 7,
        date: "2024-12-31",
        voucherNo: "JV-2024-297",
        voucherType: "Journal",
        period: "H2-2024",
        state: "Maharashtra",
        particulars: "Employee LWF - Maharashtra (32 EE @ 20)",
        debit: "-",
        credit: "640.00",
        balance: "640.00",
        dueDate: "2025-01-31",
        paymentDate: "-",
        receiptNo: "-",
        status: "unpaid"
    },
    {
        id: 8,
        date: "2024-12-31",
        voucherNo: "JV-2024-298",
        voucherType: "Journal",
        period: "H2-2024",
        state: "Karnataka",
        particulars: "Employee LWF - Karnataka (28 EE @ 10)",
        debit: "-",
        credit: "280.00",
        balance: "920.00",
        dueDate: "2025-06-30",
        paymentDate: "-",
        receiptNo: "-",
        status: "unpaid"
    }
];

// Filter Options
export const filterOptions = {
    periods: [
        { value: "all", label: "All Periods" },
        { value: "h1", label: "Half Year 1 - Jun 2024" },
        { value: "h2", label: "Half Year 2 - Dec 2024" },
        { value: "annual", label: "Annual 2024" }
    ],
    states: [
        { value: "all", label: "All States" },
        { value: "maharashtra", label: "Maharashtra" },
        { value: "karnataka", label: "Karnataka" },
        { value: "tamil-nadu", label: "Tamil Nadu" },
        { value: "gujarat", label: "Gujarat" },
        { value: "haryana", label: "Haryana" }
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