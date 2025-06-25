// File: src/features/billing/data/pofakeData.js

const POFakeData = Array.from({ length: 20 }, (_, i) => {
  const isRejected = i % 5 === 0;
  return {
    poNumber: `PO-2025-${(i + 1).toString().padStart(3, '0')}`,
    vendorName: `Vendor ${i + 1}`,
    expenseType: i % 2 === 0 ? "professional-fees" : "one-time-service",
    poType: i % 3 === 0 ? "yearly" : "one-time",
    amount: (10000 + i * 500).toFixed(2),
    managerApproval: isRejected ? "rejected" : i % 2 === 0 ? "approved" : "pending",
    financeApproval: isRejected ? "rejected" : i % 3 === 0 ? "approved" : "pending",
    status: isRejected ? "rejected" : i % 2 === 0 ? "approved" : "pending",
    rejectionReason: isRejected ? `PO rejected due to missing documents for Vendor ${i + 1}.` : null,
  };
});

export default POFakeData;
