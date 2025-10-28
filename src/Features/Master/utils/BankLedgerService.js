// services/bankLedgerService.js

export class BankLedgerService {
  
  /**
   * Get bank account details for header
   */
  static getBankAccountDetails(bankCode) {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const bankAccount = chartOfAccounts.find(acc => acc.code === bankCode);
      
      if (!bankAccount) {
        return null;
      }

      // Default bank details - you can extend this with more bank-specific data
      const bankDetails = {
        'A3004003001': {
          bankName: 'HDFC Bank',
          accountNumber: '50100123456789',
          ifscCode: 'HDFC0001234',
          branch: 'Mumbai - Andheri East',
          accountType: 'Current Account'
        },
        'A3004003002': {
          bankName: 'HDFC Bank', 
          accountNumber: '50100987654321',
          ifscCode: 'HDFC0001234',
          branch: 'Mumbai - Andheri East',
          accountType: 'Current Account'
        },
        'A3004003003': {
          bankName: 'Punjab Bank',
          accountNumber: '12345678901234',
          ifscCode: 'PUNB0123456',
          branch: 'Delhi - Connaught Place',
          accountType: 'Current Account'
        }
      };

      const details = bankDetails[bankCode] || {
        bankName: 'Bank Account',
        accountNumber: 'N/A',
        ifscCode: 'N/A',
        branch: 'N/A',
        accountType: 'Current Account'
      };

      return {
        glAccountCode: bankCode,
        accountName: bankAccount.name,
        ...details,
        financialYear: '2024-25'
      };
      
    } catch (error) {
      console.error('Error getting bank account details:', error);
      return null;
    }
  }

  /**
   * Get all transactions for a bank account
   */
  static getBankTransactions(bankCode) {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      console.log(`🏦 Loading bank transactions for: ${bankCode}`);
      
      // Filter transactions that involve this bank account
      const bankTransactions = transactions.filter(txn => 
        txn.entries.some(entry => entry.glCode === bankCode)
      );
      
      console.log(`📋 Found ${bankTransactions.length} bank transactions`);
      
      // Convert to bank ledger format
      const ledgerEntries = [];
      let runningBalance = 500000; // Opening balance (you can make this dynamic)
      
      bankTransactions.forEach(txn => {
        const bankEntry = txn.entries.find(entry => entry.glCode === bankCode);
        const otherEntry = txn.entries.find(entry => entry.glCode !== bankCode);
        
        if (bankEntry) {
          const debit = bankEntry.debit || 0;
          const credit = bankEntry.credit || 0;
          
          // Calculate running balance (for banks, credit decreases balance, debit increases)
          runningBalance += debit - credit;
          const balanceType = runningBalance >= 0 ? 'DR' : 'CR';
          
          // Get counterparty info
          const counterparty = this.getCounterpartyInfo(otherEntry, chartOfAccounts, users);
          
          // Determine transaction type
          const entryType = credit > 0 ? 'payment' : 'receipt';
          const transactionType = this.getTransactionType(otherEntry);
          
          ledgerEntries.push({
            date: this.formatDate(txn.date),
            voucherNo: txn.voucherNo,
            entryType: entryType,
            debit: debit > 0 ? this.formatAmount(debit) : '-',
            credit: credit > 0 ? this.formatAmount(credit) : '-',
            balance: this.formatAmount(Math.abs(runningBalance)) + ' ' + balanceType,
            narration: bankEntry.narration,
            refNo: txn.advanceRequestId || txn.id,
            counterparty: counterparty.name,
            type: transactionType,
            approvedBy: txn.approvedBy || 'System',
            instrument: 'NEFT - ' + txn.voucherNo,
            valueDate: this.formatDate(txn.date),
            tdsDetails: this.getTDSDetails(otherEntry),
            status: 'posted',
            costCenter: bankEntry.costCenter || 'Head Office',
            rowClass: entryType === 'payment' ? 'bg-red-50' : 'bg-green-50'
          });
        }
      });

      // Add opening balance as first entry
      ledgerEntries.unshift({
        date: '01-Apr-24',
        voucherNo: 'OB-2024',
        entryType: 'opening',
        debit: '5,00,000.00',
        credit: '-',
        balance: '5,00,000.00 DR',
        narration: 'Opening Balance B/F FY 2024-25',
        refNo: '-',
        counterparty: '-',
        type: 'opening_type',
        approvedBy: '-',
        instrument: '-',
        valueDate: '01-Apr-24',
        tdsDetails: '-',
        status: 'posted',
        costCenter: 'Head Office',
        recon: 'reconciled',
        rowClass: 'bg-orange-50'
      });
      
      return ledgerEntries;
      
    } catch (error) {
      console.error('Error getting bank transactions:', error);
      return [];
    }
  }

  /**
   * Get counterparty information
   */
  static getCounterpartyInfo(entry, chartOfAccounts, users) {
    if (!entry) return { name: 'N/A', type: 'Unknown' };
    
    // Employee account
    if (entry.glCode && entry.glCode.startsWith('A3002-EMP-')) {
      const empId = entry.glCode.replace('A3002-EMP-', '');
      const employee = users.find(u => u.empId === empId);
      return {
        name: employee?.fullName || `EMP-${empId}`,
        type: 'advance'
      };
    }
    
    // Vendor account
    if (entry.glCode && entry.glCode.startsWith('L2005')) {
      const vendor = chartOfAccounts.find(acc => acc.code === entry.glCode);
      return {
        name: vendor?.name || 'Vendor',
        type: 'vendor'
      };
    }
    
    // Other accounts
    const account = chartOfAccounts.find(acc => acc.code === entry.glCode);
    return {
      name: account?.name || entry.glName || 'Account',
      type: 'other'
    };
  }

  /**
   * Determine transaction type
   */
  static getTransactionType(entry) {
    if (!entry) return 'other';
    
    if (entry.glCode && entry.glCode.startsWith('A3002-EMP-')) {
      return 'advance';
    }
    
    if (entry.glCode && entry.glCode.startsWith('L2005')) {
      return 'vendor';
    }
    
    return 'other';
  }

  /**
   * Get TDS details if applicable
   */
  static getTDSDetails(entry) {
    // You can enhance this to calculate actual TDS based on transaction rules
    if (entry && entry.glCode && entry.glCode.startsWith('L2005')) {
      return 'TDS 194C Applicable';
    }
    return '-';
  }

  /**
   * Format date for display
   */
  static formatDate(dateString) {
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
   * Format amount for display
   */
  static formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Get summary statistics
   */
  static getBankSummary(transactions) {
    let totalDebit = 0;
    let totalCredit = 0;
    let closingBalance = 0;
    let balanceType = 'DR';

    transactions.forEach(txn => {
      if (txn.entryType !== 'opening') {
        const debit = txn.debit !== '-' ? parseFloat(txn.debit.replace(/,/g, '')) : 0;
        const credit = txn.credit !== '-' ? parseFloat(txn.credit.replace(/,/g, '')) : 0;
        
        totalDebit += debit;
        totalCredit += credit;
      }
    });

    // Calculate closing balance from last transaction
    if (transactions.length > 0) {
      const lastTxn = transactions[transactions.length - 1];
      const balanceParts = lastTxn.balance.split(' ');
      closingBalance = parseFloat(balanceParts[0].replace(/,/g, ''));
      balanceType = balanceParts[1];
    }

    return {
      totalReceipts: totalDebit,
      totalPayments: totalCredit,
      closingBalance: closingBalance,
      balanceType: balanceType
    };
  }
}