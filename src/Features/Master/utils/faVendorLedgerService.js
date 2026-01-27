/* eslint-disable no-unused-vars */
// utils/faVendorLedgerService.js
export class FAVendorLedgerService {

  /**
   * Get all vendor ledger entries for a specific Fixed Asset vendor GL account (L2005003_*)
   */
  static getVendorLedgerEntries(accountCode) {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];

      // Filter transactions that involve this vendor account
      const faTransactions = transactions.filter(txn =>
        txn.entries?.some(entry => entry.glCode === accountCode)
      );

      // Sort by date ascending
      faTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Convert to ledger entries
      const ledgerEntries = [];
      let runningBalance = 0;
      let balanceType = 'CR'; // Vendors typically have credit balance

      faTransactions.forEach(txn => {
        const vendorEntry = txn.entries.find(entry => entry.glCode === accountCode);
        const assetEntry = txn.entries.find(entry => (entry.glCode || '').startsWith('A100'));

        if (vendorEntry) {
          const debit = vendorEntry.debit || 0;
          const credit = vendorEntry.credit || 0;

          // Vendor perspective: Credit increases liability, Debit decreases
          runningBalance += credit - debit;
          balanceType = runningBalance >= 0 ? 'CR' : 'DR';

          const entryType = this.getVendorEntryType(debit, credit);
          const counterparty = assetEntry
            ? (assetEntry.glName || 'Fixed Asset')
            : (txn.narration || 'Fixed Asset Purchase');

          const displayDate = this.formatDate(txn.date);
          const formattedBalance = `${Math.abs(runningBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${balanceType}`;

          ledgerEntries.push({
            date: displayDate,
            originalDate: txn.date,
            voucherNo: txn.voucherNo,
            entryType: entryType,
            debit: debit > 0 ? debit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            credit: credit > 0 ? credit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            balance: formattedBalance,
            balanceType: balanceType,
            narration: vendorEntry.narration || txn.narration || '',
            refNo: txn.invoiceNumber || txn.id,
            counterparty: counterparty,
            counterpartyType: "Fixed Asset",
            type: txn.vendorType || (entryType === 'Invoice' ? 'Fixed Asset Invoice' : entryType === 'Payment' ? 'Fixed Asset Payment' : 'Journal'),
            approvedBy: txn.approvedBy || 'System',
            attachments: vendorEntry.attachments || 0,
            costCenter: vendorEntry.costCenter || assetEntry?.costCenter || txn.costCenter || 'Operations',
            customer: txn.customer || txn.clientName || '-',
            site: vendorEntry.site || assetEntry?.site || txn.site || '-',
            state: txn.state || '-',
            city: txn.city || '-',
            branch: txn.branch || '-',
            status: txn.status || 'Posted',
            invoiceNumber: txn.invoiceNumber || '-'
          });
        }
      });

      return ledgerEntries;

    } catch (error) {
      console.error('❌ Error generating FA vendor ledger:', error);
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
        console.log(`❌ FA vendor account not found: ${accountCode}`);
        return null;
      }

      // Extract vendor name from account name or code
      const vendorName = account.name.replace('FIXED ASSET VENDOR - ', '') ||
        accountCode.split('_').slice(2).join(' ').replace(/_/g, ' ');

      const balance = ledgerBalances[accountCode] || { debit: 0, credit: 0, balance: 0 };
      const outstandingBalance = Math.abs(balance.balance);
      const balanceType = balance.balance >= 0 ? 'Credit' : 'Debit';

      // Totals from transactions
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const faTransactions = transactions.filter(txn =>
        txn.entries?.some(entry => entry.glCode === accountCode)
      );

      let totalInvoices = 0;
      let totalPayments = 0;
      let pendingInvoices = 0;

      faTransactions.forEach(txn => {
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
        glAccountCode: accountCode,
        accountName: account.name,
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
          }
        ],
        summary: {
          totalInvoices: `₹${totalInvoices.toLocaleString('en-IN')}`,
          totalPayments: `₹${totalPayments.toLocaleString('en-IN')}`,
          pendingInvoices: `${pendingInvoices} Invoices`,
        }
      };

    } catch (error) {
      console.error('❌ Error getting FA vendor account details:', error);
      return null;
    }
  }

  static getVendorEntryType(debit, credit) {
    if (credit > 0 && debit === 0) return 'Invoice';
    if (debit > 0 && credit === 0) return 'Payment';
    return 'Journal';
  }

  static formatDate(dateString) {
    try {
      let date;
      if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          date = new Date(dateString);
        } else {
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

  static parseDate(dateString) {
    try {
      if (!dateString) return null;
      if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          return new Date(dateString);
        } else {
          const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
          return new Date(`${year}-${parts[1]}-${parts[0]}`);
        }
      }
      return new Date(dateString);
    } catch (error) {
      return null;
    }
  }
}