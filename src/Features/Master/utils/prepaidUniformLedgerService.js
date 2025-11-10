/* eslint-disable no-unused-vars */
// utils/prepaidUniformLedgerService.js
export class PrepaidUniformLedgerService {
  
  /**
   * Get all vendor ledger entries for a specific Prepaid Uniform vendor GL account (L2005004_*)
   */
  static getVendorLedgerEntries(accountCode) {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      
      console.log(`📊 Generating Prepaid Uniform vendor ledger for: ${accountCode}`);
      
      // Filter transactions that involve this vendor account
      const prepaidUniformTransactions = transactions.filter(txn => 
        txn.entries?.some(entry => entry.glCode === accountCode)
      );
      
      // Sort by date ascending
      prepaidUniformTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      console.log(`📋 Found ${prepaidUniformTransactions.length} Prepaid Uniform transactions`);
      
      // Convert to ledger entries
      const ledgerEntries = [];
      let runningBalance = 0;
      let balanceType = 'CR'; // Vendors typically have credit balance
      
      prepaidUniformTransactions.forEach(txn => {
        const vendorEntry = txn.entries.find(entry => entry.glCode === accountCode);
        const prepaidEntry = txn.entries.find(entry => entry.glCode === "A3005001");
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
          
          // Get counterparty info (usually the prepaid expense account or invoice details)
          const counterparty = prepaidEntry 
            ? prepaidEntry.glName || 'UNIFORM EXPENSE (Prepaid)'
            : txn.narration || 'Prepaid Uniform Purchase';
          
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
            counterpartyType: "Prepaid Uniform",
            type: entryType === 'Invoice' ? 'Purchase Invoice' : entryType === 'Payment' ? 'Payment' : 'Journal',
            approvedBy: txn.approvedBy || 'System',
            attachments: vendorEntry.attachments || 0,
            costCenter: vendorEntry.costCenter || prepaidEntry?.costCenter || 'Operations',
            status: txn.status || 'Posted',
            invoiceNumber: txn.invoiceNumber || '-',
            prepaidPeriod: txn.prepaidDetails?.prepaidPeriod || prepaidEntry?.prepaidPeriod || '-',
            monthlyAmortization: txn.prepaidDetails?.monthlyAmortization || '-'
          });
        }
      });
      
      console.log(`✅ Generated ${ledgerEntries.length} Prepaid Uniform vendor ledger entries`);
      return ledgerEntries;
      
    } catch (error) {
      console.error('❌ Error generating Prepaid Uniform vendor ledger:', error);
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
        console.log(`❌ Prepaid Uniform vendor account not found: ${accountCode}`);
        return null;
      }
      
      // Extract vendor name from account name or code
      const vendorName = account.name.replace('UNIFORM VENDOR - ', '').replace('PREPAID VENDOR - ', '') || 
                        accountCode.split('_').slice(2).join(' ').replace(/_/g, ' ');
      
      // Get current balance
      const balance = ledgerBalances[accountCode] || { debit: 0, credit: 0, balance: 0 };
      const outstandingBalance = Math.abs(balance.balance);
      const balanceType = balance.balance >= 0 ? 'Credit' : 'Debit';
      
      // Get vendor transactions to calculate totals
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const prepaidUniformTransactions = transactions.filter(txn => 
        txn.entries?.some(entry => entry.glCode === accountCode)
      );
      
      // Calculate invoice and payment totals
      let totalInvoices = 0;
      let totalPayments = 0;
      let pendingInvoices = 0;
      
      prepaidUniformTransactions.forEach(txn => {
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
      console.error('❌ Error getting Prepaid Uniform vendor account details:', error);
      return null;
    }
  }

  /**
   * Get Prepaid Uniform Expense ledger entries for A3005001 (UNIFORM EXPENSE - Prepaid)
   */
  static getPrepaidExpenseLedgerEntries(accountCode = "A3005001") {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const billingManagerInvoices = JSON.parse(localStorage.getItem('billing_manager_invoices')) || [];
      const finalProcessed = JSON.parse(localStorage.getItem('final_processed_invoices')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      
      console.log(`📊 Generating Prepaid Uniform Expense ledger for: ${accountCode}`);
      
      // Filter transactions that involve this Prepaid Expense account (debit entries for purchase, credit entries for amortization)
      const prepaidTransactions = transactions.filter(txn => 
        txn.entries?.some(entry => entry.glCode === accountCode)
      );
      
      // Sort by date ascending
      prepaidTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      console.log(`📋 Found ${prepaidTransactions.length} Prepaid Uniform Expense transactions`);
      
      // Convert to ledger entries
      const ledgerEntries = [];
      let runningBalance = 0;
      let balanceType = 'DR'; // Prepaid expenses are assets (debit balance)
      
      prepaidTransactions.forEach(txn => {
        const prepaidEntry = txn.entries.find(entry => entry.glCode === accountCode);
        const vendorEntry = txn.entries.find(entry => entry.glCode.startsWith('L2005004_'));
        const expenseEntry = txn.entries.find(entry => entry.glCode === "X2001004");
        
        if (prepaidEntry) {
          const debit = prepaidEntry.debit || 0;
          const credit = prepaidEntry.credit || 0;
          
          // Calculate running balance (asset perspective)
          // For prepaid expenses: Debit increases asset, Credit decreases (amortization)
          runningBalance += debit - credit;
          balanceType = runningBalance >= 0 ? 'DR' : 'CR';
          
          // Determine entry type
          const entryType = this.getPrepaidEntryType(debit, credit);
          
          // Get vendor name or expense account name
          const counterparty = vendorEntry 
            ? vendorEntry.glName?.replace('UNIFORM VENDOR - ', '') || 'Vendor'
            : expenseEntry?.glName || txn.narration || 'Prepaid Uniform';
          
          // Find invoice details
          const invoice = billingManagerInvoices.find(inv => 
            inv.invoiceNumber === txn.invoiceNumber || 
            inv.purchaseTransactionId === txn.id
          ) || finalProcessed.find(inv => 
            inv.invoiceNumber === txn.invoiceNumber || 
            inv.purchaseTransactionId === txn.id
          );
          
          // Format date for display
          const displayDate = this.formatDate(txn.date);
          
          // Format balance
          const formattedBalance = `${Math.abs(runningBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${balanceType}`;
          
          ledgerEntries.push({
            date: displayDate,
            originalDate: txn.date,
            voucherNo: txn.voucherNo,
            documentNo: txn.invoiceNumber || txn.voucherNo,
            voucherType: txn.voucherType || (entryType === 'Purchase' ? 'Purchase' : 'Journal'),
            description: prepaidEntry.narration || txn.narration || `Prepaid Uniform - ${counterparty}`,
            vendor: counterparty,
            vendorCode: vendorEntry?.glCode || '-',
            prepaidAmount: debit > 0 ? debit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            amortizationAmount: credit > 0 ? credit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            period: invoice?.prepaidPeriod || txn.prepaidDetails?.prepaidPeriod || prepaidEntry.prepaidPeriod || '-',
            totalMonths: invoice?.prepaidPeriod || txn.prepaidDetails?.prepaidPeriod || prepaidEntry.prepaidPeriod || 0,
            monthlyAmort: invoice?.monthlyAmortization || txn.prepaidDetails?.monthlyAmortization || prepaidEntry.monthlyAmortization || '-',
            cumulativeAmort: '-', // Will be calculated from previous entries
            remainingBalance: formattedBalance,
            expenseAccount: expenseEntry?.glName || 'X2-UNIFORM EXPENSE',
            assetCode: `AST-UNIF-${txn.id?.slice(-6) || 'N/A'}`,
            paymentMethod: '-',
            approvedBy: txn.approvedBy || invoice?.processedByBM || 'System',
            status: txn.status || invoice?.billingManagerStatus || 'Approved',
            remarks: prepaidEntry.narration || txn.narration || '',
            entryType: entryType,
            debit: debit,
            credit: credit,
            balance: runningBalance,
            balanceType: balanceType,
            prepaidStartMonth: invoice?.prepaidStartMonth || txn.prepaidDetails?.prepaidStartMonth || prepaidEntry.prepaidStartMonth || '-',
            invoiceNumber: txn.invoiceNumber || invoice?.invoiceNumber || '-'
          });
        }
      });
      
      // Calculate cumulative amortization
      let cumulativeAmort = 0;
      ledgerEntries.forEach((entry, index) => {
        if (entry.credit > 0) {
          cumulativeAmort += entry.credit;
          entry.cumulativeAmort = `₹${cumulativeAmort.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
          entry.cumulativeAmort = index > 0 ? ledgerEntries[index - 1].cumulativeAmort : '-';
        }
      });
      
      console.log(`✅ Generated ${ledgerEntries.length} Prepaid Uniform Expense ledger entries`);
      return ledgerEntries;
      
    } catch (error) {
      console.error('❌ Error generating Prepaid Uniform Expense ledger:', error);
      return [];
    }
  }

  /**
   * Get Uniform Expense ledger entries for X2001004 (monthly amortization entries)
   */
  static getUniformExpenseLedgerEntries(accountCode = "X2001004") {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      
      console.log(`📊 Generating Uniform Expense ledger for: ${accountCode}`);
      
      // Filter transactions that involve this Uniform Expense account (debit entries for amortization)
      const expenseTransactions = transactions.filter(txn => 
        txn.entries?.some(entry => entry.glCode === accountCode && entry.debit > 0)
      );
      
      // Sort by date ascending
      expenseTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      console.log(`📋 Found ${expenseTransactions.length} Uniform Expense transactions`);
      
      // Convert to ledger entries
      const ledgerEntries = [];
      let runningBalance = 0;
      let balanceType = 'DR'; // Expenses are debits
      
      expenseTransactions.forEach(txn => {
        const expenseEntry = txn.entries.find(entry => entry.glCode === accountCode && entry.debit > 0);
        const prepaidEntry = txn.entries.find(entry => entry.glCode === "A3005001");
        
        if (expenseEntry) {
          const debit = expenseEntry.debit || 0;
          const credit = expenseEntry.credit || 0;
          
          // Calculate running balance (expense perspective)
          runningBalance += debit - credit;
          balanceType = runningBalance >= 0 ? 'DR' : 'CR';
          
          // Format date for display
          const displayDate = this.formatDate(txn.date);
          
          // Format balance
          const formattedBalance = `${Math.abs(runningBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${balanceType}`;
          
          ledgerEntries.push({
            date: displayDate,
            originalDate: txn.date,
            voucherNo: txn.voucherNo,
            entryType: "Journal",
            description: expenseEntry.narration || txn.narration || `Monthly amortization for Prepaid Uniform`,
            debit: debit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            credit: '-',
            balance: formattedBalance,
            balanceType: balanceType,
            counterparty: prepaidEntry?.glName || "A3005-UNIFORM (Prepaid)",
            counterpartyType: "Prepaid Uniform",
            approvedBy: txn.approvedBy || 'Billing Manager',
            status: txn.status || 'Posted',
            refNo: txn.invoiceNumber || txn.id,
            narration: expenseEntry.narration || txn.narration || '',
            costCenter: expenseEntry.costCenter || 'Operations'
          });
        }
      });
      
      console.log(`✅ Generated ${ledgerEntries.length} Uniform Expense ledger entries`);
      return ledgerEntries;
      
    } catch (error) {
      console.error('❌ Error generating Uniform Expense ledger:', error);
      return [];
    }
  }

  /**
   * Get Prepaid Uniform account details for header (A3005001)
   */
  static getPrepaidExpenseAccountDetails(accountCode = "A3005001") {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      
      const account = chartOfAccounts.find(acc => acc.code === accountCode);
      
      if (!account) {
        console.log(`❌ Prepaid Uniform Expense account not found: ${accountCode}`);
        return null;
      }
      
      // Get current balance
      const balance = ledgerBalances[accountCode] || { debit: 0, credit: 0, balance: 0 };
      const totalPrepaid = balance.debit || 0;
      const totalAmortized = balance.credit || 0;
      const remainingBalance = totalPrepaid - totalAmortized;
      
      // Get transaction counts
      const prepaidTransactions = transactions.filter(txn => 
        txn.entries?.some(entry => entry.glCode === accountCode && entry.debit > 0)
      );
      
      const amortizationTransactions = transactions.filter(txn => 
        txn.entries?.some(entry => entry.glCode === accountCode && entry.credit > 0)
      );
      
      return {
        accountCode: accountCode,
        accountName: account.name || "UNIFORM EXPENSE",
        glAccountCode: accountCode,
        balances: [
          {
            label: "Total Prepaid Amount",
            amount: `₹${totalPrepaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            type: "Asset (Debit)",
          },
          {
            label: "Total Amortized",
            amount: `₹${totalAmortized.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            type: "Amortization (Credit)",
          },
          {
            label: "Remaining Balance",
            amount: `₹${remainingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            type: "Net Prepaid Asset",
          },
        ],
        summary: {
          totalPrepaidEntries: `${prepaidTransactions.length} Purchase Entries`,
          totalAmortizationEntries: `${amortizationTransactions.length} Amortization Entries`,
          activePrepaidItems: `${prepaidTransactions.length} Active Items`,
        }
      };
      
    } catch (error) {
      console.error('❌ Error getting Prepaid Uniform Expense account details:', error);
      return null;
    }
  }

  /**
   * Determine vendor entry type based on debit/credit
   */
  static getVendorEntryType(debit, credit) {
    if (credit > 0 && debit === 0) return 'Invoice';
    if (debit > 0 && credit === 0) return 'Payment';
    return 'Journal';
  }

  /**
   * Determine prepaid entry type based on debit/credit
   */
  static getPrepaidEntryType(debit, credit) {
    if (debit > 0 && credit === 0) return 'Purchase';
    if (credit > 0 && debit === 0) return 'Amortization';
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
   * Get all Prepaid Uniform vendor GL codes
   */
  static getAllPrepaidUniformVendorCodes() {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      return chartOfAccounts
        .filter(acc => acc.code.startsWith('L2005004_') && acc.code.includes('_'))
        .map(acc => ({
          code: acc.code,
          name: acc.name,
          vendorName: acc.name.replace('UNIFORM VENDOR - ', '').replace('PREPAID VENDOR - ', '')
        }));
    } catch (error) {
      console.error('Error getting Prepaid Uniform vendor codes:', error);
      return [];
    }
  }
}

