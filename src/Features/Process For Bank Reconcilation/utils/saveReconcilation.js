/* eslint-disable no-unused-vars */
// File: src/features/bankReconciliation/utils/reconciliationHistory.js

// File: src/features/bankReconciliation/utils/reconciliationHistory.js

// Dummy Reconciliation Data
const dummyHistory = [
  {
    id: 1,
    date: "2025-07-01T10:30:00Z",
    fileName: "statement_july1.csv",
    records: [
      { date: "2025-07-01", amount: 10000, description: "ABC Enterprises", inBooks: true, inBank: true },
      { date: "2025-07-02", amount: 5000, description: "XYZ Pvt Ltd", inBooks: true, inBank: false },
      { date: "2025-07-03", amount: 8000, description: "PQR Industries", inBooks: false, inBank: true },
    ]
  },
  {
    id: 2,
    date: "2025-07-02T15:00:00Z",
    fileName: "statement_july2.csv",
    records: [
      { date: "2025-07-04", amount: 7000, description: "LMN Services", inBooks: true, inBank: true },
      { date: "2025-07-05", amount: 3000, description: "RST Pvt Ltd", inBooks: false, inBank: true },
    ]
  },
  {
    id: 3,
    date: "2025-07-03T09:00:00Z",
    fileName: "statement_july3.csv",
    records: [
      { date: "2025-07-03", amount: 15000, description: "OPQ Enterprises", inBooks: true, inBank: true },
      { date: "2025-07-03", amount: 2500, description: "STU Solutions", inBooks: true, inBank: true },
      { date: "2025-07-03", amount: 2000, description: "Unknown Entry", inBooks: false, inBank: true },
    ]
  },
  {
    id: 4,
    date: "2025-07-04T14:45:00Z",
    fileName: "statement_july4.csv",
    records: [
      { date: "2025-07-04", amount: 12000, description: "JKL Traders", inBooks: true, inBank: true },
      { date: "2025-07-04", amount: 1000, description: "Wrong Vendor", inBooks: true, inBank: false },
      { date: "2025-07-04", amount: 4500, description: "Mismatch Pvt", inBooks: false, inBank: true },
    ]
  }
];

export function saveReconciliation(fileName, matched, unmatched) {
  console.warn("saveReconciliation is disabled in dummy mode.");
}

export function getReconciliationHistory() {
  return dummyHistory;
}

export function getReconciliationById(id) {
  return dummyHistory.find((item) => item.id === parseInt(id));
}


