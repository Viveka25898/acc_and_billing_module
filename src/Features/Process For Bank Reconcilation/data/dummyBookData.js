export const dummyCashLedgers = [
  { id: 'ledger_main', name: 'Main Company Cash Ledger' },
  { id: 'ledger_sales', name: 'Sales Department Cash Book' },
  { id: 'ledger_ops', name: 'Operations Petty Cash Ledger' },
];

// Updated dummy data with proper date formatting and more realistic transactions

// Dummy data for Main Company Cash Ledger (ledger_main) - May 2024
export const dummyBookData_Main = [
  // ✅ PERFECT MATCHES: These should match with bank statement entries
  { 
    id: "l_m1", 
    date: "2024-05-02", 
    description: "Invoice Payment from ABC Corp", 
    reference: "NEFT123456789", 
    amount: 50000.00, 
    type: "credit" 
  },
  { 
    id: "l_m2", 
    date: "2024-05-05", 
    description: "Cash Withdrawal for office expenses", 
    reference: "ATM987654", 
    amount: 10000.00, 
    type: "debit" 
  },
  { 
    id: "l_m3", 
    date: "2024-05-10", 
    description: "Payment to John Electronics", 
    reference: "IMPS987654321", 
    amount: 12500.00, 
    type: "debit" 
  },
  { 
    id: "l_m4", 
    date: "2024-05-14", 
    description: "Office supplies payment", 
    reference: "CHQ101", 
    amount: 5000.00, 
    type: "debit" 
  },
  { 
    id: "l_m5", 
    date: "2024-05-18", 
    description: "Client payment received", 
    reference: "RTGS456789123", 
    amount: 75000.00, 
    type: "credit" 
  },

  // ❌ UNMATCHED IN BANK: These are in our books but NOT on the bank statement yet
  { 
    id: "l_m6", 
    date: "2024-05-30", 
    description: "Deposit from XYZ Ltd", 
    reference: "XYZ789", 
    amount: 15000.00, 
    type: "credit" 
  },
  { 
    id: "l_m7", 
    date: "2024-05-29", 
    description: "Rent payment by cheque", 
    reference: "CHQ102", 
    amount: 8000.00, 
    type: "debit" 
  },
  { 
    id: "l_m8", 
    date: "2024-05-31", 
    description: "Salary advance to employee", 
    reference: "SADV001", 
    amount: 25000.00, 
    type: "debit" 
  },

  // Additional entries for testing
  { 
    id: "l_m9", 
    date: "2024-05-03", 
    description: "Utility bills payment", 
    reference: "UB240503", 
    amount: 3500.00, 
    type: "debit" 
  },
  { 
    id: "l_m10", 
    date: "2024-05-15", 
    description: "Insurance premium", 
    reference: "INS2024", 
    amount: 12000.00, 
    type: "debit" 
  }
];

// Dummy data for Sales Department Cash Book (ledger_sales)
export const dummyBookData_Sales = [
  // ✅ PERFECT MATCHES
  { 
    id: "l_s1", 
    date: "2024-05-07", 
    description: "Customer advance payment", 
    reference: "NEFT555111222", 
    amount: 25000.00, 
    type: "credit" 
  },
  { 
    id: "l_s2", 
    date: "2024-05-15", 
    description: "Sales commission payout", 
    reference: "COMM1505", 
    amount: 7500.00, 
    type: "debit" 
  },
  { 
    id: "l_s3", 
    date: "2024-05-20", 
    description: "Product delivery charges", 
    reference: "DEL2024", 
    amount: 2500.00, 
    type: "debit" 
  },

  // ❌ UNMATCHED IN BANK
  { 
    id: "l_s4", 
    date: "2024-05-31", 
    description: "Monthly incentive payment", 
    reference: "INC3105", 
    amount: 15000.00, 
    type: "debit" 
  },
  { 
    id: "l_s5", 
    date: "2024-05-28", 
    description: "Customer refund processed", 
    reference: "REF2805", 
    amount: 5000.00, 
    type: "debit" 
  },

  // Additional test entries
  { 
    id: "l_s6", 
    date: "2024-05-12", 
    description: "Marketing expense", 
    reference: "MKT001", 
    amount: 8000.00, 
    type: "debit" 
  },
  { 
    id: "l_s7", 
    date: "2024-05-25", 
    description: "Sales team bonus", 
    reference: "BONUS25", 
    amount: 20000.00, 
    type: "debit" 
  }
];

// Dummy data for Operations Petty Cash Ledger (ledger_ops)
export const dummyBookData_Ops = [
  { 
    id: "l_o1", 
    date: "2024-05-01", 
    description: "Office snacks and refreshments", 
    reference: "PC001", 
    amount: 500.00, 
    type: "debit" 
  },
  { 
    id: "l_o2", 
    date: "2024-05-10", 
    description: "Courier and postal charges", 
    reference: "PC002", 
    amount: 350.00, 
    type: "debit" 
  },
  { 
    id: "l_o3", 
    date: "2024-05-15", 
    description: "Office cleaning supplies", 
    reference: "PC003", 
    amount: 750.00, 
    type: "debit" 
  },
  { 
    id: "l_o4", 
    date: "2024-05-22", 
    description: "Vehicle fuel expense", 
    reference: "FUEL001", 
    amount: 2000.00, 
    type: "debit" 
  },
  { 
    id: "l_o5", 
    date: "2024-05-28", 
    description: "Office maintenance", 
    reference: "MAINT01", 
    amount: 1500.00, 
    type: "debit" 
  }
];

// Helper function to get dummy book data by ledger ID
export const getDummyBookDataById = (ledgerId) => {
  console.log('Getting book data for ledger:', ledgerId);
  
  switch(ledgerId) {
    case 'ledger_main': 
      console.log('Returning main ledger data:', dummyBookData_Main);
      return dummyBookData_Main;
    case 'ledger_sales': 
      console.log('Returning sales ledger data:', dummyBookData_Sales);
      return dummyBookData_Sales;
    case 'ledger_ops': 
      console.log('Returning ops ledger data:', dummyBookData_Ops);
      return dummyBookData_Ops;
    default: 
      console.log('No data found for ledger:', ledgerId);
      return [];
  }
};