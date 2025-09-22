// Mock data for reconciliation history
const reconciliationData = [
  {
    id: '1',
    fileName: 'bank_statement_jan_2024.pdf',
    date: '2024-01-31T10:30:00Z',
    reconciler: 'A',
    bankAccount: 'Main Operating Account - ****1234',
    period: 'January 2024',
    notes: 'Monthly reconciliation completed successfully',
    records: [
      { id: '1', date: '2024-01-01', description: 'Office Supplies', amount: '1500.00', reference: 'INV001', inBank: true, inBooks: true },
      { id: '2', date: '2024-01-05', description: 'Client Payment', amount: '25000.00', reference: 'PAY001', inBank: true, inBooks: true },
      { id: '3', date: '2024-01-10', description: 'Utility Bill', amount: '7500.00', reference: 'UTIL001', inBank: true, inBooks: true }
    ],
    matched: [
      { id: '1', date: '2024-01-01', description: 'Office Supplies', amount: '1500.00', reference: 'INV001', inBank: true, inBooks: true },
      { id: '2', date: '2024-01-05', description: 'Client Payment', amount: '25000.00', reference: 'PAY001', inBank: true, inBooks: true },
      { id: '3', date: '2024-01-10', description: 'Utility Bill', amount: '7500.00', reference: 'UTIL001', inBank: true, inBooks: true }
    ],
    unmatched: []
  },
  {
    id: '2',
    fileName: 'bank_statement_feb_2024.pdf',
    date: '2024-02-29T14:45:00Z',
    reconciler: 'B',
    bankAccount: 'Main Operating Account - ****1234',
    period: 'February 2024',
    notes: 'Two transactions require investigation',
    records: [
      { id: '1', date: '2024-02-01', description: 'Rent Payment', amount: '50000.00', reference: 'RENT001', inBank: true, inBooks: true },
      { id: '2', date: '2024-02-05', description: 'Software Subscription', amount: '2500.00', reference: 'SUB001', inBank: true, inBooks: true },
      { id: '3', date: '2024-02-10', description: 'Miscellaneous Expense', amount: '1200.00', reference: 'MISC001', inBank: true, inBooks: false },
      { id: '4', date: '2024-02-15', description: 'Client Refund', amount: '3000.00', reference: 'REF001', inBank: false, inBooks: true }
    ],
    matched: [
      { id: '1', date: '2024-02-01', description: 'Rent Payment', amount: '50000.00', reference: 'RENT001', inBank: true, inBooks: true },
      { id: '2', date: '2024-02-05', description: 'Software Subscription', amount: '2500.00', reference: 'SUB001', inBank: true, inBooks: true }
    ],
    unmatched: [
      { id: '3', date: '2024-02-10', description: 'Miscellaneous Expense', amount: '1200.00', reference: 'MISC001', inBank: true, inBooks: false },
      { id: '4', date: '2024-02-15', description: 'Client Refund', amount: '3000.00', reference: 'REF001', inBank: false, inBooks: true }
    ]
  },
  {
    id: '3',
    fileName: 'bank_statement_mar_2024.pdf',
    date: '2024-03-31T09:15:00Z',
    reconciler: 'C',
    bankAccount: 'Savings Account - ****5678',
    period: 'March 2024',
    notes: 'Perfect match with no discrepancies',
    records: [
      { id: '1', date: '2024-03-01', description: 'Salary Deposit', amount: '100000.00', reference: 'SAL001', inBank: true, inBooks: true },
      { id: '2', date: '2024-03-05', description: 'Investment', amount: '25000.00', reference: 'INV001', inBank: true, inBooks: true },
      { id: '3', date: '2024-03-10', description: 'Insurance Premium', amount: '15000.00', reference: 'INS001', inBank: true, inBooks: true }
    ],
    matched: [
      { id: '1', date: '2024-03-01', description: 'Salary Deposit', amount: '100000.00', reference: 'SAL001', inBank: true, inBooks: true },
      { id: '2', date: '2024-03-05', description: 'Investment', amount: '25000.00', reference: 'INV001', inBank: true, inBooks: true },
      { id: '3', date: '2024-03-10', description: 'Insurance Premium', amount: '15000.00', reference: 'INS001', inBank: true, inBooks: true }
    ],
    unmatched: []
  }
];

// Function to get all reconciliation history
export const getReconciliationHistory = () => {
  return reconciliationData;
};

// Function to get a specific reconciliation by ID
export const getReconciliationById = (id) => {
  return reconciliationData.find(record => record.id === id);
};

// Function to add new reconciliation record
export const addReconciliationRecord = (record) => {
  const newRecord = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    ...record
  };
  reconciliationData.unshift(newRecord);
  return newRecord;
};

// Function to delete reconciliation record
export const deleteReconciliationRecord = (id) => {
  const index = reconciliationData.findIndex(record => record.id === id);
  if (index !== -1) {
    return reconciliationData.splice(index, 1)[0];
  }
  return null;
};

// Function to update reconciliation record
export const updateReconciliationRecord = (id, updates) => {
  const index = reconciliationData.findIndex(record => record.id === id);
  if (index !== -1) {
    reconciliationData[index] = { ...reconciliationData[index], ...updates };
    return reconciliationData[index];
  }
  return null;
};

// Function to get reconciliation statistics
export const getReconciliationStats = () => {
  const totalRecords = reconciliationData.length;
  const perfectMatches = reconciliationData.filter(record => 
    record.records.every(r => r.inBank && r.inBooks)
  ).length;
  const totalTransactions = reconciliationData.reduce((sum, record) => 
    sum + record.records.length, 0
  );
  const matchedTransactions = reconciliationData.reduce((sum, record) => 
    sum + record.records.filter(r => r.inBank && r.inBooks).length, 0
  );

  return {
    totalRecords,
    perfectMatches,
    totalTransactions,
    matchedTransactions,
    matchRate: totalTransactions > 0 ? Math.round((matchedTransactions / totalTransactions) * 100) : 0
  };
};

export default {
  getReconciliationHistory,
  getReconciliationById,
  addReconciliationRecord,
  deleteReconciliationRecord,
  updateReconciliationRecord,
  getReconciliationStats
};