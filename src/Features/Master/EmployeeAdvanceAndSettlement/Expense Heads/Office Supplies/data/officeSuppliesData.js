// src/data/officeSuppliesData.js
export const officeSuppliesData = {
  header: {
    expenseHeadCode: "X1001003001",
    expenseHeadName: "OFFICE SUPPLIES EXPENSE",
    parentAccount: "OTHER PRODUCTION COST (X1001003)",
    accountType: "EXPENSE - DIRECT",
    financialYear: "2024-25",
    period: "Apr 2024 to May 2024",
    costCenter: "All Operations",
    department: "Administration"
  },
  balances: {
    opening: { amount: "₹0.00", type: "Debit Balance" },
    periodExpenses: { amount: "₹42,300.00", type: "Total Debits" },
    closing: { amount: "₹42,300.00", type: "Debit Balance" }
  },
  stats: [
    { label: "Total Transactions", value: "6" },
    { label: "Vendors", value: "3" },
    { label: "Avg per Transaction", value: "₹7,050" },
    { label: "Purchase Orders", value: "4" }
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
      voucherNo: "PV-2024-0045",
      entryType: "purchase",
      debit: "15,000.00",
      credit: "-",
      balance: "15,000.00 DR",
      narration: "Office stationery purchase: Pens, notebooks, folders from Stationery World",
      settlementRef: "PO-2024-0456",
      employee: { name: "Admin Department", id: "ADM-001" },
      glAccount: "X1001003001",
      costCenter: "Head Office",
      approvedBy: "Finance Manager",
      attachments: 2,
      status: "posted",
      rowType: "normal"
    },
    {
      id: 3,
      date: "12-Apr-24",
      voucherNo: "PV-2024-0058",
      entryType: "purchase",
      debit: "8,500.00",
      credit: "-",
      balance: "23,500.00 DR",
      narration: "Printer cartridges & toners for office printers",
      settlementRef: "PO-2024-0489",
      employee: { name: "IT Department", id: "IT-001" },
      glAccount: "X1001003001",
      costCenter: "All Branches",
      approvedBy: "Finance Manager",
      attachments: 1,
      status: "posted",
      rowType: "normal"
    },
    {
      id: 4,
      date: "22-Apr-24",
      voucherNo: "PV-2024-0072",
      entryType: "purchase",
      debit: "7,800.00",
      credit: "-",
      balance: "31,300.00 DR",
      narration: "Cleaning supplies: Detergents, sanitizers, tissue papers",
      settlementRef: "PO-2024-0523",
      employee: { name: "Admin Department", id: "ADM-001" },
      glAccount: "X1001003001",
      costCenter: "Head Office",
      approvedBy: "Finance Manager",
      attachments: 1,
      status: "posted",
      rowType: "normal"
    },
    {
      id: 5,
      date: "15-May-24",
      voucherNo: "PV-2024-0091",
      entryType: "purchase",
      debit: "11,000.00",
      credit: "-",
      balance: "42,300.00 DR",
      narration: "Office furniture accessories: Chair mats, desk organizers, file cabinets",
      settlementRef: "PO-2024-0589",
      employee: { name: "Admin Department", id: "ADM-001" },
      glAccount: "X1001003001",
      costCenter: "All Branches",
      approvedBy: "Finance Manager",
      attachments: 3,
      status: "posted",
      rowType: "normal"
    },
    {
      id: 6,
      date: "31-May-24",
      voucherNo: "CL-2024",
      entryType: "closing",
      debit: "-",
      credit: "-",
      balance: "42,300.00 DR",
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
    totalDebit: "₹42,300.00",
    totalCredit: "₹0.00",
    closingBalance: "₹42,300.00 DR"
  },
  filterOptions: {
    employees: [
      { value: "", label: "All" },
      { value: "adm001", label: "ADM-001 - Admin Department" },
      { value: "it001", label: "IT-001 - IT Department" }
    ],
    costCenters: [
      { value: "", label: "All" },
      { value: "hq", label: "Head Office" },
      { value: "all", label: "All Branches" }
    ],
    entryTypes: [
      { value: "", label: "All" },
      { value: "purchase", label: "Purchase" },
      { value: "settlement", label: "Settlement" }
    ]
  }
};