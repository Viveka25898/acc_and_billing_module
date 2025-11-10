/* eslint-disable no-unused-vars */
// utils/hkMaterialLedgerService.js
export class HKMaterialLedgerService {
  
  /**
   * Get all vendor ledger entries for a specific HK Material vendor GL account
   */
  static getVendorLedgerEntries(accountCode) {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      
      console.log(`📊 Generating HK Material vendor ledger for: ${accountCode}`);
      
      // Filter transactions that involve this vendor account
      const hkTransactions = transactions.filter(txn => 
        txn.entries?.some(entry => entry.glCode === accountCode)
      );
      
      // Sort by date ascending
      hkTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      console.log(`📋 Found ${hkTransactions.length} HK Material transactions`);
      
      // Convert to ledger entries
      const ledgerEntries = [];
      let runningBalance = 0;
      let balanceType = 'CR'; // Vendors typically have credit balance
      
      hkTransactions.forEach(txn => {
        const vendorEntry = txn.entries.find(entry => entry.glCode === accountCode);
        const expenseEntry = txn.entries.find(entry => entry.glCode === "X1001004001");
        const cgstEntry = txn.entries.find(entry => entry.glCode === "A3007001001");
        const sgstEntry = txn.entries.find(entry => entry.glCode === "A3007001002");
        
        if (vendorEntry) {
          const debit = vendorEntry.debit || 0;
          const credit = vendorEntry.credit || 0;
          
          // Calculate running balance (vendor perspective)
          // For vendors: Credit increases liability (outstanding), Debit decreases (payment)
          runningBalance += credit - debit;
          balanceType = runningBalance >= 0 ? 'CR' : 'DR';
          
          // Determine entry type
          const entryType = this.getVendorEntryType(debit, credit);
          
          // Get counterparty info (usually the expense account or invoice details)
          const counterparty = expenseEntry 
            ? expenseEntry.glName || 'HK MATERIALS'
            : txn.narration || 'HK Material Purchase';
          
          // Format date for display (DD-MM-YY format)
          const displayDate = this.formatDate(txn.date);
          
          // Format balance
          const formattedBalance = `${Math.abs(runningBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${balanceType}`;
          
          ledgerEntries.push({
            date: displayDate, // Formatted date for display (DD-MM-YY)
            originalDate: txn.date, // Original date for filtering (YYYY-MM-DD)
            voucherNo: txn.voucherNo,
            entryType: entryType,
            debit: debit > 0 ? debit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            credit: credit > 0 ? credit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            balance: formattedBalance,
            balanceType: balanceType,
            narration: vendorEntry.narration || txn.narration || '',
            refNo: txn.invoiceNumber || txn.id,
            counterparty: counterparty,
            counterpartyType: "HK Materials",
            type: entryType === 'Invoice' ? 'Purchase Invoice' : entryType === 'Payment' ? 'Payment' : 'Journal',
            approvedBy: txn.approvedBy || 'System',
            attachments: vendorEntry.attachments || 0,
            costCenter: vendorEntry.costCenter || expenseEntry?.costCenter || 'Operations',
            status: txn.status || 'Posted',
            invoiceNumber: txn.invoiceNumber || '-'
          });
        }
      });
      
      console.log(`✅ Generated ${ledgerEntries.length} HK Material vendor ledger entries`);
      return ledgerEntries;
      
    } catch (error) {
      console.error('❌ Error generating HK Material vendor ledger:', error);
      return [];
    }
  }

  /**
   * Get vendor account details for header
   */
  static getVendorAccountDetails(accountCode) {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};
      
      const account = chartOfAccounts.find(acc => acc.code === accountCode);
      
      if (!account) {
        console.log(`❌ HK Material vendor account not found: ${accountCode}`);
        return null;
      }
      
      // Extract vendor name from account name or code
      const vendorName = account.name.replace('HK MATERIAL VENDOR - ', '') || 
                        accountCode.split('_').slice(2).join(' ').replace(/_/g, ' ');
      
      // Get current balance
      const balance = ledgerBalances[accountCode] || { debit: 0, credit: 0, balance: 0 };
      const outstandingBalance = Math.abs(balance.balance);
      const balanceType = balance.balance >= 0 ? 'Credit' : 'Debit';
      
      // Get vendor transactions to calculate totals
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const hkTransactions = transactions.filter(txn => 
        txn.entries?.some(entry => entry.glCode === accountCode)
      );
      
      // Calculate invoice and payment totals
      let totalInvoices = 0;
      let totalPayments = 0;
      let pendingInvoices = 0;
      
      hkTransactions.forEach(txn => {
        const vendorEntry = txn.entries.find(entry => entry.glCode === accountCode);
        if (vendorEntry) {
          if (vendorEntry.credit > 0) {
            totalInvoices += vendorEntry.credit;
            pendingInvoices++;
          }
          if (vendorEntry.debit > 0) {
            totalPayments += vendorEntry.debit;
          }
        }
      });
      
      return {
        vendorCode: accountCode,
        vendorName: vendorName,
        gstin: account.gstin || 'N/A',
        pan: account.pan || 'N/A',
        glAccountCode: accountCode,
        accountName: account.name,
        tdsSection: account.tdsSection || 'N/A',
        paymentTerms: account.paymentTerms || 'Net 30 Days',
        balances: [
          {
            label: "Opening Balance (01-Apr-2025)",
            amount: `₹${(0).toLocaleString('en-IN')}`,
            type: "Credit (Outstanding)",
          },
          {
            label: "Current Outstanding",
            amount: `₹${outstandingBalance.toLocaleString('en-IN')}`,
            type: `${balanceType} Balance`,
          },
          {
            label: "Overdue Amount",
            amount: `₹${(0).toLocaleString('en-IN')}`,
            type: "Aging > 30 Days",
          },
        ],
        summary: {
          totalInvoices: `₹${totalInvoices.toLocaleString('en-IN')}`,
          totalPayments: `₹${totalPayments.toLocaleString('en-IN')}`,
          pendingInvoices: `${pendingInvoices} Invoices`,
        }
      };
      
    } catch (error) {
      console.error('❌ Error getting HK Material vendor account details:', error);
      return null;
    }
  }

  /**
   * Determine entry type based on debit/credit
   */
  static getVendorEntryType(debit, credit) {
    if (credit > 0 && debit === 0) return 'Invoice';
    if (debit > 0 && credit === 0) return 'Payment';
    return 'Journal';
  }

  /**
   * Format date for display (DD-MM-YY format)
   */
  static formatDate(dateString) {
    try {
      // Handle both YYYY-MM-DD and DD-MM-YY formats
      let date;
      if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          // YYYY-MM-DD format
          date = new Date(dateString);
        } else {
          // DD-MM-YY format - convert to YYYY-MM-DD
          const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
          date = new Date(`${year}-${parts[1]}-${parts[0]}`);
        }
      } else {
        date = new Date(dateString);
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateString;
    }
  }
  
  /**
   * Parse date for filtering (convert DD-MM-YY to Date object)
   */
  static parseDate(dateString) {
    try {
      if (!dateString) return null;
      if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          // YYYY-MM-DD format
          return new Date(dateString);
        } else {
          // DD-MM-YY format
          const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
          return new Date(`${year}-${parts[1]}-${parts[0]}`);
        }
      }
      return new Date(dateString);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all HK Material vendor GL codes
   */
  static getAllHKVendorCodes() {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      return chartOfAccounts
        .filter(acc => acc.code.startsWith('L2005002_') && acc.code.includes('_'))
        .map(acc => ({
          code: acc.code,
          name: acc.name,
          vendorName: acc.name.replace('HK MATERIAL VENDOR - ', '')
        }));
    } catch (error) {
      console.error('Error getting HK vendor codes:', error);
      return [];
    }
  }
}

