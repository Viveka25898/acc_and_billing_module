/* eslint-disable no-unused-vars */
// utils/rentLedgerService.js
export class RentLedgerService {

  /**
   * Get all vendor ledger entries for a specific GL account
   */
  static getVendorLedgerEntries(accountCode) {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];

      console.log(`📊 Generating rent vendor ledger for: ${accountCode}`);

      // Filter transactions that involve this vendor account (include all voucher types)
      const rentTransactions = transactions.filter(txn =>
        txn.entries?.some(entry => entry.glCode === accountCode)
      );

      console.log(`📋 Found ${rentTransactions.length} rent transactions`);

      // Convert to ledger entries
      const ledgerEntries = [];
      let runningBalance = 0;
      let balanceType = 'CR'; // Vendors typically have credit balance

      rentTransactions.forEach(txn => {
        const vendorEntry = txn.entries.find(entry => entry.glCode === accountCode);
        const rentEntry = txn.entries.find(entry => entry.glCode === "X2001002002");
        const gstEntry = txn.entries.find(entry =>
          ["A3007001001", "A3007001002", "A3007001003"].includes(entry.glCode)
        );

        if (vendorEntry) {
          const debit = vendorEntry.debit || 0;
          const credit = vendorEntry.credit || 0;

          // Calculate running balance (vendor perspective)
          runningBalance += credit - debit;
          balanceType = runningBalance >= 0 ? 'CR' : 'DR';

          const siteName = txn.siteDetails?.siteName || '';
          const siteLoc = txn.siteDetails?.location || txn.siteDetails?.siteLocation || '';
          const derivedCounterparty = siteName || 'Your Company';

          ledgerEntries.push({
            date: txn.date,
            displayDate: txn.date,
            voucherNo: txn.voucherNo,
            entryType: this.getVendorEntryType(debit, credit),
            debit: debit,
            credit: credit,
            balance: Math.abs(runningBalance),
            balanceType: balanceType,
            narration: vendorEntry.narration || txn.narration || '',
            refNo: txn.id,
            counterparty: siteLoc ? `${derivedCounterparty} - ${siteLoc}` : derivedCounterparty,
            counterpartyType: "Company",
            type: txn.vendorType || (credit > 0 ? 'Rent Invoice' : 'Rent Payment'),
            approvedBy: txn.approvedBy,
            attachments: vendorEntry.attachments || 0,
            costCenter: vendorEntry.costCenter || 'General',
            siteName: txn.siteDetails?.siteName,
            month: txn.rentVoucherId ? this.extractMonthFromVoucher(txn.rentVoucherId) : ''
          });
        }
      });

      console.log(`✅ Generated ${ledgerEntries.length} vendor ledger entries`);
      return ledgerEntries;

    } catch (error) {
      console.error('❌ Error generating rent vendor ledger:', error);
      return [];
    }
  }

  /**
   * Get branch office rent ledger entries
   */
  static getBranchRentLedgerEntries() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];

      console.log(`📊 Generating branch office rent ledger`);

      // Filter transactions with branch office rent GL code
      const rentTransactions = transactions.filter(txn =>
        txn.entries.some(entry => entry.glCode === "X2001002002")
      );

      const ledgerEntries = [];
      let runningBalance = 0;
      let balanceType = 'DR'; // Expense accounts typically have debit balance

      rentTransactions.forEach(txn => {
        const rentEntry = txn.entries.find(entry => entry.glCode === "X2001002002");
        const vendorEntry = txn.entries.find(entry => entry.glCode.startsWith('L2005'));

        if (rentEntry) {
          const debit = rentEntry.debit || 0;
          const credit = rentEntry.credit || 0;

          runningBalance += debit - credit;
          balanceType = runningBalance >= 0 ? 'DR' : 'CR';

          ledgerEntries.push({
            date: txn.date,
            voucherNo: txn.voucherNo,
            entryType: this.getRentExpenseEntryType(debit, credit),
            debit: debit,
            credit: credit,
            balance: Math.abs(runningBalance),
            balanceType: balanceType,
            narration: rentEntry.narration,
            refNo: txn.id,
            counterparty: vendorEntry?.glName || 'Vendor',
            counterpartyType: "Vendor",
            type: 'Rent Expense',
            approvedBy: txn.approvedBy,
            attachments: 0,
            costCenter: rentEntry.costCenter || 'General',
            siteName: txn.siteDetails?.siteName,
            month: txn.rentVoucherId ? this.extractMonthFromVoucher(txn.rentVoucherId) : '',
            vendorGL: vendorEntry?.glCode
          });
        }
      });

      console.log(`✅ Generated ${ledgerEntries.length} branch rent ledger entries`);
      return ledgerEntries;

    } catch (error) {
      console.error('❌ Error generating branch rent ledger:', error);
      return [];
    }
  }

  /**
   * Get vendor account details
   */
  static getVendorAccountDetails(accountCode) {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const sites = JSON.parse(localStorage.getItem('sites')) || [];

      const account = chartOfAccounts.find(acc => acc.code === accountCode);

      if (!account) {
        console.log(`❌ Vendor account not found: ${accountCode}`);
        return null;
      }

      // Find site and owner info from the account name
      const vendorName = account.name.replace('VENDOR-', '').split(' - ')[1] || account.name;

      // Find site that has this vendor
      const vendorSite = sites.find(site =>
        site.owners?.some(owner => owner.glCode === accountCode)
      );

      const opening = { amount: 0, date: '2025-04-01', type: 'CR' };
      const openingBalanceLabel = `${(opening.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} ${opening.type}`;

      return {
        // Fields expected by header/table components
        ledgerCode: accountCode,
        displayName: vendorName,
        type: 'Vendor (Rent)',
        parent: 'Rent Vendors',
        period: 'Apr 2025 - Mar 2026',
        openingBalanceLabel,

        // Additional info if needed elsewhere
        vendorId: accountCode,
        vendorName: vendorName,
        glAccountCode: accountCode,
        accountName: account.name,
        siteName: vendorSite?.siteName || 'Multiple Sites',
        location: vendorSite?.location || 'Various Locations',
        financialYear: '2025-2026',
        openingBalance: opening,
        contactInfo: {
          pan: vendorSite?.owners?.[0]?.panNumber || 'N/A',
          gstin: vendorSite?.owners?.[0]?.gstin || 'N/A'
        }
      };

    } catch (error) {
      console.error('Error getting vendor account details:', error);
      return null;
    }
  }

  /**
   * Get branch rent account details
   */
  static getBranchRentAccountDetails() {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];

      const account = chartOfAccounts.find(acc => acc.code === "X2001002002");

      return {
        accountCode: "X2001002002",
        accountName: account?.name || "BRANCH OFFICE RENT",
        description: "Rent Expenses for All Branch Offices",
        financialYear: '2025-2026',
        period: 'Apr 2025 - Mar 2026',
        openingBalance: {
          amount: 0,
          date: '2025-04-01',
          type: 'DR'
        }
      };

    } catch (error) {
      console.error('Error getting branch rent account details:', error);
      return null;
    }
  }

  // Helper methods
  static getVendorEntryType(debit, credit) {
    if (debit > 0) return 'Payment';
    if (credit > 0) return 'Invoice';
    return 'Journal';
  }

  static getRentExpenseEntryType(debit, credit) {
    if (debit > 0) return 'Expense';
    if (credit > 0) return 'Reversal';
    return 'Journal';
  }

  static extractMonthFromVoucher(voucherId) {
    // Extract month from voucher data if available
    const vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    const voucher = vouchers.find(v => v.voucherId === voucherId);
    return voucher?.month || '';
  }
}