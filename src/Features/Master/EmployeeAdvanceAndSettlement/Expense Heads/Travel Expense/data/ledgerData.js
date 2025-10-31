// src/data/ledgerData.js
export const ledgerData = {
  header: {
    expenseHeadCode: "X1001002001",
    expenseHeadName: "TRAVEL EXPENSE",
    parentAccount: "OTHER PRODUCTION COST (X1001002)",
    accountType: "EXPENSE - DIRECT",
    financialYear: "2024-25",
    period: "Apr 2024 to May 2024",
    costCenter: "All Operations",
    department: "Operations"
  },
  balances: {
    opening: { amount: "₹0.00", type: "Debit Balance" },
    periodExpenses: { amount: "₹1,85,000.00", type: "Total Debits" },
    closing: { amount: "₹1,85,000.00", type: "Debit Balance" }
  },
  stats: [
    { label: "Total Transactions", value: "12" },
    { label: "Employees", value: "5" },
    { label: "Avg per Transaction", value: "₹15,417" },
    { label: "Settlements", value: "8" }
  ],
  transactions: [
    {
      id: 1,
      date: "01-Apr-24",
      voucherNo: "OB-2024",
      entryType: "opening",
      debit: "0.00",
      credit: "-",
      balance: "0.00 DR",
      narration: "Opening Balance B/F FY 2024-25",
      settlementRef: "-",
      employee: { name: "-", id: "" },
      glAccount: "-",
      costCenter: "All",
      approvedBy: "System",
      attachments: 0,
      status: "posted",
      rowType: "opening"
    },
    {
      id: 2,
      date: "05-Apr-24",
      voucherNo: "JV-2024-0089",
      entryType: "settlement",
      debit: "25,000.00",
      credit: "-",
      balance: "25,000.00 DR",
      narration: "Travel expenses: Mumbai site visit - Auto fare, Parking, Toll",
      settlementRef: "ADV-SETTLE-2024-001",
      employee: { name: "John Doe", id: "EMP-001" },
      glAccount: "A3002-EMP-001",
      costCenter: "Mumbai Branch",
      approvedBy: "Priya Sharma (AE)",
      attachments: 3,
      status: "posted",
      rowType: "normal"
    },
    {
      id: 3,
      date: "08-Apr-24",
      voucherNo: "JV-2024-0095",
      entryType: "settlement",
      debit: "18,500.00",
      credit: "-",
      balance: "43,500.00 DR",
      narration: "Travel expenses: Client meeting Delhi - Taxi charges",
      settlementRef: "ADV-SETTLE-2024-004",
      employee: { name: "Jane Smith", id: "EMP-002" },
      glAccount: "A3002-EMP-002",
      costCenter: "Delhi Branch",
      approvedBy: "Priya Sharma (AE)",
      attachments: 2,
      status: "posted",
      rowType: "normal"
    },
    {
      id: 4,
      date: "12-Apr-24",
      voucherNo: "JV-2024-0102",
      entryType: "settlement",
      debit: "32,000.00",
      credit: "-",
      balance: "75,500.00 DR",
      narration: "Travel expenses: Vendor visit - Multiple locations, Fuel reimbursement",
      settlementRef: "ADV-SETTLE-2024-008",
      employee: { name: "Mike Johnson", id: "EMP-003" },
      glAccount: "A3002-EMP-003",
      costCenter: "Mumbai Branch",
      approvedBy: "Priya Sharma (AE)",
      attachments: 5,
      status: "posted",
      rowType: "normal"
    },
    {
      id: 11,
      date: "31-May-24",
      voucherNo: "CL-2024",
      entryType: "closing",
      debit: "-",
      credit: "-",
      balance: "1,85,000.00 DR",
      narration: "Closing Balance C/F to Jun 2024",
      settlementRef: "-",
      employee: { name: "-", id: "" },
      glAccount: "-",
      costCenter: "All",
      approvedBy: "System",
      attachments: 0,
      status: "posted",
      rowType: "closing"
    }
  ],
  summary: {
    totalDebit: "₹1,85,000.00",
    totalCredit: "₹0.00",
    closingBalance: "₹1,85,000.00 DR"
  },
  filterOptions: {
    employees: [
      { value: "", label: "All Employees" },
      { value: "emp1", label: "EMP-001 - John Doe" },
      { value: "emp2", label: "EMP-002 - Jane Smith" },
      { value: "emp3", label: "EMP-003 - Mike Johnson" }
    ],
    costCenters: [
      { value: "", label: "All" },
      { value: "mumbai", label: "Mumbai Branch" },
      { value: "delhi", label: "Delhi Branch" },
      { value: "hq", label: "Head Office" }
    ],
    entryTypes: [
      { value: "", label: "All" },
      { value: "settlement", label: "Settlement" },
      { value: "journal", label: "Journal" }
    ]
  }
};