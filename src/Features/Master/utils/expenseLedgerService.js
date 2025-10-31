/* eslint-disable no-unused-vars */
// src/services/expenseLedgerService.js

/**
 * Unified Expense Ledger Service - Converts real transactions to ledger format
 */
export class ExpenseLedgerService {
  
  /**
   * Get ledger data for specific expense head
   */
  static getExpenseLedgerData(expenseHeadCode) {
    try {
      console.log(`📊 Generating ledger for expense head: ${expenseHeadCode}`);
      
      // Get all transactions from localStorage
      const allTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Filter transactions for this expense head
      const expenseTransactions = allTransactions.filter(txn => 
        txn.entries.some(entry => entry.glCode === expenseHeadCode)
      );
      
      console.log(`📋 Found ${expenseTransactions.length} transactions for ${expenseHeadCode}`);
      
      // Get expense head details
      const expenseHead = chartOfAccounts.find(acc => acc.code === expenseHeadCode);
      if (!expenseHead) {
        throw new Error(`Expense head ${expenseHeadCode} not found in chart of accounts`);
      }
      
      // Transform transactions to ledger format
      const ledgerTransactions = this.transformTransactionsToLedgerFormat(
        expenseTransactions, 
        expenseHeadCode,
        users
      );
      
      // Calculate balances and stats
      const balances = this.calculateBalances(ledgerTransactions);
      const stats = this.calculateStats(ledgerTransactions, users);
      const summary = this.calculateSummary(ledgerTransactions);
      const filterOptions = this.generateFilterOptions(ledgerTransactions, users);
      
      return {
        header: this.getHeaderData(expenseHead, expenseHeadCode),
        balances: balances,
        stats: stats,
        transactions: ledgerTransactions,
        summary: summary,
        filterOptions: filterOptions
      };
      
    } catch (error) {
      console.error('❌ Error generating expense ledger:', error);
      // Return empty structure with error message
      return this.getEmptyLedgerData(expenseHeadCode, error.message);
    }
  }
  
  /**
   * Transform real transactions to ledger display format
   */
  static transformTransactionsToLedgerFormat(transactions, expenseHeadCode, users) {
    const ledgerEntries = [];
    let runningBalance = 0;
    
    // Add opening balance
    ledgerEntries.push({
      id: 1,
      date: '01-Apr-25',
      voucherNo: 'OB-2025',
      entryType: 'opening',
      debit: '0.00',
      credit: '-',
      balance: '0.00 DR',
      narration: 'Opening Balance B/F FY 2025-26',
      settlementRef: '-',
      employee: { name: '-', id: '' },
      glAccount: '-',
      costCenter: 'All',
      approvedBy: 'System',
      attachments: 0,
      status: 'posted',
      rowType: 'opening'
    });
    
    // Process each transaction
    transactions.forEach((txn, index) => {
      const expenseEntry = txn.entries.find(entry => entry.glCode === expenseHeadCode);
      const employeeEntry = txn.entries.find(entry => entry.glCode && entry.glCode.startsWith('A3002-EMP-'));
      
      if (expenseEntry) {
        const amount = expenseEntry.debit || 0;
        runningBalance += amount;
        
        // Get employee details
        const employee = this.getEmployeeDetails(employeeEntry, users);
        
        // Determine entry type
        const entryType = txn.voucherType?.includes('Journal') ? 'settlement' : 'purchase';
        
        ledgerEntries.push({
          id: index + 2, // Start from 2 after opening balance
          date: this.formatDateForDisplay(txn.date),
          voucherNo: txn.voucherNo,
          entryType: entryType,
          debit: amount.toFixed(2),
          credit: '-',
          balance: `${runningBalance.toFixed(2)} DR`,
          narration: expenseEntry.narration || txn.narration,
          settlementRef: txn.settlementId || txn.advanceRequestId || `TXN-${txn.id?.slice(-6)}`,
          employee: employee,
          glAccount: employeeEntry?.glCode || '-',
          costCenter: expenseEntry.costCenter || 'General',
          approvedBy: txn.approvedBy || 'System',
          attachments: 0, // You can enhance this with actual attachment count
          status: 'posted',
          rowType: 'normal'
        });
      }
    });
    
    // Add closing balance
    if (ledgerEntries.length > 1) {
      ledgerEntries.push({
        id: ledgerEntries.length + 1,
        date: '31-May-25',
        voucherNo: 'CL-2025',
        entryType: 'closing',
        debit: '-',
        credit: '-',
        balance: `${runningBalance.toFixed(2)} DR`,
        narration: 'Closing Balance C/F to Jun 2025',
        settlementRef: '-',
        employee: { name: '-', id: '' },
        glAccount: '-',
        costCenter: 'All',
        approvedBy: 'System',
        attachments: 0,
        status: 'posted',
        rowType: 'closing'
      });
    }
    
    return ledgerEntries;
  }
  
  /**
   * Get employee details from transaction entry
   */
  static getEmployeeDetails(employeeEntry, users) {
    if (!employeeEntry || !employeeEntry.employeeId) {
      return { name: 'System', id: '' };
    }
    
    const employee = users.find(u => u.empId === employeeEntry.employeeId);
    if (employee) {
      return {
        name: employee.fullName,
        id: `EMP-${employee.empId}`
      };
    }
    
    // If employee not found, try to extract from GL code
    if (employeeEntry.glCode && employeeEntry.glCode.startsWith('A3002-EMP-')) {
      const empId = employeeEntry.glCode.replace('A3002-EMP-', '');
      return {
        name: `Employee ${empId}`,
        id: `EMP-${empId}`
      };
    }
    
    return { name: 'Unknown', id: '' };
  }
  
  /**
   * Calculate balances for header
   */
  static calculateBalances(transactions) {
    const normalTransactions = transactions.filter(t => t.rowType === 'normal');
    const totalDebits = normalTransactions.reduce((sum, t) => sum + parseFloat(t.debit || 0), 0);
    const closingBalance = transactions.find(t => t.rowType === 'closing')?.balance || '0.00 DR';
    
    return {
      opening: { amount: '₹0.00', type: 'Debit Balance' },
      periodExpenses: { amount: `₹${totalDebits.toLocaleString('en-IN')}`, type: 'Total Debits' },
      closing: { amount: `₹${closingBalance.split(' ')[0]}`, type: 'Debit Balance' }
    };
  }
  
  /**
   * Calculate statistics
   */
  static calculateStats(transactions, users) {
    const normalTransactions = transactions.filter(t => t.rowType === 'normal');
    const employeeIds = [...new Set(normalTransactions.map(t => t.employee.id).filter(id => id))];
    const totalAmount = normalTransactions.reduce((sum, t) => sum + parseFloat(t.debit || 0), 0);
    const avgPerTransaction = normalTransactions.length > 0 ? totalAmount / normalTransactions.length : 0;
    const settlements = normalTransactions.filter(t => t.entryType === 'settlement').length;
    
    return [
      { label: "Total Transactions", value: normalTransactions.length.toString() },
      { label: "Employees", value: employeeIds.length.toString() },
      { label: "Avg per Transaction", value: `₹${Math.round(avgPerTransaction).toLocaleString('en-IN')}` },
      { label: "Settlements", value: settlements.toString() }
    ];
  }
  
  /**
   * Calculate footer summary
   */
  static calculateSummary(transactions) {
    const normalTransactions = transactions.filter(t => t.rowType === 'normal');
    const totalDebit = normalTransactions.reduce((sum, t) => sum + parseFloat(t.debit || 0), 0);
    const closingBalance = transactions.find(t => t.rowType === 'closing')?.balance || '0.00 DR';
    
    return {
      totalDebit: `₹${totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      totalCredit: '₹0.00',
      closingBalance: `₹${closingBalance}`
    };
  }
  
  /**
   * Generate filter options
   */
  static generateFilterOptions(transactions, users) {
    const normalTransactions = transactions.filter(t => t.rowType === 'normal');
    
    // Get unique employees
    const employeeOptions = [
      { value: "", label: "All Employees" }
    ];
    
    normalTransactions.forEach(t => {
      if (t.employee.id && !employeeOptions.some(e => e.value === t.employee.id)) {
        employeeOptions.push({
          value: t.employee.id.toLowerCase(),
          label: `${t.employee.id} - ${t.employee.name}`
        });
      }
    });
    
    // Get unique cost centers
    const costCenterOptions = [
      { value: "", label: "All" }
    ];
    
    const costCenters = [...new Set(normalTransactions.map(t => t.costCenter).filter(cc => cc))];
    costCenters.forEach(cc => {
      costCenterOptions.push({
        value: cc.toLowerCase().replace(/\s+/g, '-'),
        label: cc
      });
    });
    
    // Entry types
    const entryTypeOptions = [
      { value: "", label: "All" },
      { value: "settlement", label: "Settlement" },
      { value: "purchase", label: "Purchase" },
      { value: "journal", label: "Journal" }
    ];
    
    return {
      employees: employeeOptions,
      costCenters: costCenterOptions,
      entryTypes: entryTypeOptions
    };
  }
  
  /**
   * Get header data for expense head
   */
  static getHeaderData(expenseHead, expenseHeadCode) {
    const expenseHeadConfig = {
      'X1001002001': {
        name: 'TRAVEL EXPENSE',
        parent: 'OTHER PRODUCTION COST (X1001002)',
        department: 'Operations'
      },
      'X1001003001': {
        name: 'FOOD & REFRESHMENT EXPENSE', 
        parent: 'FOOD COST (X1001003)',
        department: 'Operations'
      },
      'X2001002001': {
        name: 'OFFICE SUPPLIES EXPENSE',
        parent: 'OTHER BRANCH EXPENSES (X2001002)',
        department: 'Administration'
      }
    };
    
    const config = expenseHeadConfig[expenseHeadCode] || {
      name: expenseHead?.name || 'Expense Head',
      parent: expenseHead?.parentAccount || 'General Expenses',
      department: 'Various'
    };
    
    return {
      expenseHeadCode: expenseHeadCode,
      expenseHeadName: config.name,
      parentAccount: config.parent,
      accountType: "EXPENSE - DIRECT",
      financialYear: "2025-26",
      period: "Apr 2025 to May 2026",
      costCenter: "All Operations",
      department: config.department
    };
  }
  
  /**
   * Format date for display
   */
  static formatDateForDisplay(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      }).replace(/-/g, '-');
    } catch {
      return dateString;
    }
  }
  
  /**
   * Return empty structure when no data found
   */
  static getEmptyLedgerData(expenseHeadCode, errorMessage = '') {
    const header = this.getHeaderData(null, expenseHeadCode);
    
    return {
      header: header,
      balances: {
        opening: { amount: "₹0.00", type: "Debit Balance" },
        periodExpenses: { amount: "₹0.00", type: "Total Debits" },
        closing: { amount: "₹0.00", type: "Debit Balance" }
      },
      stats: [
        { label: "Total Transactions", value: "0" },
        { label: "Employees", value: "0" },
        { label: "Avg per Transaction", value: "₹0" },
        { label: "Settlements", value: "0" }
      ],
      transactions: [
        {
          id: 1,
          date: "01-Apr-25",
          voucherNo: "OB-2025",
          entryType: "opening",
          debit: "0.00",
          credit: "-",
          balance: "0.00 DR",
          narration: "Opening Balance B/F FY 2025-26",
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
          date: "31-May-26",
          voucherNo: "CL-2025",
          entryType: "closing",
          debit: "-",
          credit: "-",
          balance: "0.00 DR",
          narration: errorMessage || "No transactions found for this period",
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
        totalDebit: "₹0.00",
        totalCredit: "₹0.00",
        closingBalance: "₹0.00 DR"
      },
      filterOptions: {
        employees: [{ value: "", label: "All Employees" }],
        costCenters: [{ value: "", label: "All" }],
        entryTypes: [
          { value: "", label: "All" },
          { value: "settlement", label: "Settlement" },
          { value: "purchase", label: "Purchase" }
        ]
      }
    };
  }
}