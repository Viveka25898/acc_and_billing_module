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
      const conveyanceRequests = JSON.parse(localStorage.getItem('conveyanceRequests')) || [];
      
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
        users,
        conveyanceRequests
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
  static transformTransactionsToLedgerFormat(transactions, expenseHeadCode, users, conveyanceRequests = []) {
    const ledgerEntries = [];
    let runningBalance = 0;
    
    // Get current date for dynamic period calculation
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Calculate period start and end dates
    const periodStart = `01-Apr-${currentYear.toString().slice(-2)}`;
    const periodEnd = this.calculatePeriodEnd(currentDate);
    
    // Add opening balance
    ledgerEntries.push({
      id: 1,
      date: periodStart,
      voucherNo: `OB-${currentYear}`,
      entryType: 'opening',
      debit: '0.00',
      credit: '-',
      balance: '0.00 DR',
      narration: `Opening Balance B/F FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
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
        
        // Get employee details - check expenseEntry first (for conveyance), then employeeEntry
        let employee = { name: 'System', id: '' };
        if (expenseEntry.employeeId) {
          // Conveyance transactions have employeeId in expense entry
          const emp = users.find(u => u.empId === expenseEntry.employeeId || u.username === expenseEntry.employeeId);
          if (emp) {
            employee = {
              name: emp.fullName || emp.username,
              id: `EMP-${emp.empId}`
            };
          }
        } else {
          // Other transactions might have employee in separate entry
          employee = this.getEmployeeDetails(employeeEntry, users);
        }
        
        // Determine entry type
        let entryType = 'purchase';
        if (txn.voucherType?.includes('Journal')) {
          entryType = 'settlement';
        } else if (txn.voucherType?.includes('Expense') && txn.conveyanceClaimId) {
          entryType = 'expense'; // Conveyance expense voucher
        } else if (txn.voucherType?.includes('Expense')) {
          entryType = 'expense';
        }
        
        // Get settlement/claim reference - check for conveyance claim ID first
        const settlementRef = txn.conveyanceClaimId 
          ? `CONV-${txn.conveyanceClaimId?.slice(-6)}` 
          : txn.settlementId || txn.advanceRequestId || `TXN-${txn.id?.slice(-6)}`;
        
        // Get attachment count from conveyance request if it's a conveyance transaction
        let attachmentCount = 0;
        if (txn.conveyanceClaimId || expenseHeadCode === 'X2001003') {
          const conveyanceReq = conveyanceRequests.find(req => 
            req.id === txn.conveyanceClaimId || 
            req.transactionId === txn.id || 
            req.voucherNumber === txn.voucherNo
          );
          if (conveyanceReq) {
            attachmentCount = (conveyanceReq.reports?.length || 0) + (conveyanceReq.receipts?.length || 0);
          }
        }
        
        ledgerEntries.push({
          id: index + 2, // Start from 2 after opening balance
          date: this.formatDateForDisplay(txn.date),
          voucherNo: txn.voucherNo,
          entryType: entryType,
          debit: amount.toFixed(2),
          credit: '-',
          balance: `${runningBalance.toFixed(2)} DR`,
          narration: expenseEntry.narration || txn.narration,
          settlementRef: settlementRef,
          employee: employee,
          glAccount: employeeEntry?.glCode || expenseEntry.employeeId ? `EMP-${expenseEntry.employeeId}` : '-',
          costCenter: expenseEntry.costCenter || 'General',
          approvedBy: txn.approvedBy || 'System',
          attachments: attachmentCount,
          status: 'posted',
          rowType: 'normal'
        });
      }
    });
    
    // Add closing balance with dynamic date
    if (ledgerEntries.length > 1) {
      ledgerEntries.push({
        id: ledgerEntries.length + 1,
        date: periodEnd,
        voucherNo: `CL-${currentYear}`,
        entryType: 'closing',
        debit: '-',
        credit: '-',
        balance: `${runningBalance.toFixed(2)} DR`,
        narration: `Closing Balance C/F to ${this.getNextPeriod(currentDate)}`,
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
   * Calculate period end date based on current date
   */
  static calculatePeriodEnd(currentDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    
    // If it's before the 25th of the month, show current month end
    // If it's after the 25th, show next month end
    const targetMonth = day > 25 ? month + 1 : month;
    const targetYear = targetMonth > 11 ? year + 1 : year;
    const adjustedMonth = targetMonth % 12;
    
    const lastDay = new Date(targetYear, adjustedMonth + 1, 0).getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${lastDay}-${monthNames[adjustedMonth]}-${targetYear.toString().slice(-2)}`;
  }
  
  /**
   * Get next period for narration
   */
  static getNextPeriod(currentDate) {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${monthNames[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`;
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
      { value: "expense", label: "Expense" },
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
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
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
      },
      'X2001003': {
        name: 'BRANCH CONVEYANCE EXPENSE',
        parent: 'BRANCH MANAGEMENT (X2001)',
        department: 'Operations'
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
      financialYear: `${currentYear}-${nextYear.toString().slice(-2)}`,
      period: `Apr ${currentYear} to ${new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`,
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
    const currentYear = new Date().getFullYear();
    const periodEnd = this.calculatePeriodEnd(new Date());
    
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
          date: `01-Apr-${currentYear.toString().slice(-2)}`,
          voucherNo: `OB-${currentYear}`,
          entryType: "opening",
          debit: "0.00",
          credit: "-",
          balance: "0.00 DR",
          narration: `Opening Balance B/F FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
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
          date: periodEnd,
          voucherNo: `CL-${currentYear}`,
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