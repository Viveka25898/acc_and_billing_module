

/**
 * Dynamic Ledger Service - Converts transactions to ledger entries
 */
export class LedgerService {
  
  /**
   * Get all ledger entries for a specific GL account
   */
  static getLedgerEntries(accountCode) {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      console.log(`📊 Generating ledger for: ${accountCode}`);
      
      // Filter transactions that involve this account
      const relevantTransactions = transactions.filter(txn => 
        txn.entries.some(entry => entry.glCode === accountCode)
      );
      
      console.log(`📋 Found ${relevantTransactions.length} relevant transactions`);
      
      // Convert transactions to ledger entries
      const ledgerEntries = [];
      let runningBalance = 0;
      let balanceType = 'DR';
      
      relevantTransactions.forEach(txn => {
        const accountEntry = txn.entries.find(entry => entry.glCode === accountCode);
        const otherEntry = txn.entries.find(entry => entry.glCode !== accountCode);
        
        if (accountEntry) {
          const debit = accountEntry.debit || 0;
          const credit = accountEntry.credit || 0;
          
          // Calculate running balance
          runningBalance += debit - credit;
          balanceType = runningBalance >= 0 ? 'DR' : 'CR';
          
          // Get counterparty info
          const counterparty = this.getCounterpartyInfo(otherEntry, chartOfAccounts, users);
          
          ledgerEntries.push({
            date: txn.date,
            voucherNo: txn.voucherNo,
            entryType: this.getEntryType(debit, credit),
            debit: debit,
            credit: credit,
            balance: Math.abs(runningBalance),
            balanceType: balanceType,
            narration: accountEntry.narration,
            refNo: txn.id,
            counterparty: counterparty.name,
            counterpartyType: counterparty.type,
            type: 'Transaction',
            approvedBy: txn.approvedBy,
            attachments: 0,
            costCenter: accountEntry.costCenter || 'General'
          });
        }
      });
      
      console.log(`✅ Generated ${ledgerEntries.length} ledger entries`);
      return ledgerEntries;
      
    } catch (error) {
      console.error('❌ Error generating ledger entries:', error);
      return [];
    }
  }
  
  /**
   * Get counterparty information for ledger display
   */
  static getCounterpartyInfo(entry, chartOfAccounts, users) {
    if (!entry) return { name: 'N/A', type: 'Unknown' };
    
    // Check if it's an employee account
    if (entry.glCode && entry.glCode.startsWith('A3002-EMP-')) {
      const empId = entry.glCode.replace('A3002-EMP-', '');
      const employee = users.find(u => u.empId === empId);
      return {
        name: employee?.fullName || `Employee ${empId}`,
        type: 'Employee'
      };
    }
    
    // Check if it's a bank account
    if (entry.glCode && entry.glCode.startsWith('A3004003')) {
      const bank = chartOfAccounts.find(acc => acc.code === entry.glCode);
      return {
        name: bank?.name || 'Bank Account',
        type: 'Bank'
      };
    }
    
    // Check if it's a vendor account
    if (entry.glCode && (entry.glCode.startsWith('L2005') || entry.glCode.includes('VEN'))) {
      const vendor = chartOfAccounts.find(acc => acc.code === entry.glCode);
      return {
        name: vendor?.name || 'Vendor',
        type: 'Vendor'
      };
    }
    
    // Default case
    const account = chartOfAccounts.find(acc => acc.code === entry.glCode);
    return {
      name: account?.name || entry.glName || 'Account',
      type: 'Account'
    };
  }
  
  /**
   * Determine entry type based on debit/credit
   */
  static getEntryType(debit, credit) {
    if (debit > 0) return 'Payment';
    if (credit > 0) return 'Receipt';
    return 'Journal';
  }
  
  /**
   * Get account details for header
   */
  static getAccountDetails(accountCode) {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};
      
      const account = chartOfAccounts.find(acc => acc.code === accountCode);
      
      if (!account) {
        console.log(`❌ Account not found: ${accountCode}`);
        return null;
      }
      
      // Check if it's an employee account
      if (accountCode.startsWith('A3002-EMP-')) {
        const empId = accountCode.replace('A3002-EMP-', '');
        const employee = users.find(u => u.empId === empId);
        
        return {
          employeeId: employee?.empId || empId,
          employeeName: employee?.fullName || account.name,
          department: employee?.department || 'Operations',
          reportingManager: employee?.reportsTo || 'N/A',
          glAccountCode: accountCode,
          accountName: account.name,
          financialYear: '2024-2025',
          period: 'Apr 2024 - Mar 2025',
          openingBalance: {
            amount: 0, // You can calculate this from older transactions
            date: '2024-04-01',
            type: 'CR'
          }
        };
      }
      
      // For other account types (banks, vendors, etc.)
      return {
        employeeId: 'N/A',
        employeeName: account.name,
        department: 'Finance',
        reportingManager: 'N/A',
        glAccountCode: accountCode,
        accountName: account.name,
        financialYear: '2024-2025',
        period: 'Apr 2024 - Mar 2025',
        openingBalance: {
          amount: ledgerBalances[accountCode]?.balance || 0,
          date: '2024-04-01',
          type: ledgerBalances[accountCode]?.balance >= 0 ? 'DR' : 'CR'
        }
      };
      
    } catch (error) {
      console.error('Error getting account details:', error);
      return null;
    }
  }
}