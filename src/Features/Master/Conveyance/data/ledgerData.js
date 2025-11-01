// src/data/ledgerData.js
export const employeeInfo = {
  name: "John Doe",
  code: "JD001",
  glAccount: "L2002-EMP-001",
  department: "Sales & Marketing",
  designation: "Sales Manager",
  accountType: "Current Liability",
  financialYear: "2024-25",
  period: "Apr-2024 to Jul-2024",
  openingBalance: "₹0.00 (No Outstanding)"
};

export const transactions = [
  {
    id: 1,
    date: "01-Apr-24",
    voucherNo: "OB-2024",
    entryType: "opening",
    debit: null,
    credit: null,
    balance: 0.00,
    balanceType: "zero",
    narration: "Opening Balance B/F FY 2024-25",
    claimId: "-",
    visits: "-",
    period: "-",
    counterparty: "-",
    approvedBy: "-",
    hasAttachment: false,
    status: "posted",
    rowClass: "opening-row"
  },
  {
    id: 2,
    date: "15-Apr-24",
    voucherNo: "EXP-2024-0078",
    entryType: "expense",
    debit: null,
    credit: 850.00,
    balance: 850.00,
    balanceType: "credit",
    narration: "Conveyance - Client visit ABC Corp, BKC",
    claimId: "CONV-2024-00012",
    visits: 1,
    period: "Apr-24",
    counterparty: "X2001 (Conveyance Exp)",
    approvedBy: "Rajesh Kumar, Priya Sharma",
    hasAttachment: true,
    status: "pending",
    rowClass: "expense-row"
  },
  // Add more transactions as needed...
];

export const summaryData = {
  totalClaims: 14100.00,
  totalPayments: 9450.00,
  totalVisits: 18,
  outstanding: 4650.00
};

export const ledgerData = {
  employeeInfo,
  transactions,
  summaryData
};