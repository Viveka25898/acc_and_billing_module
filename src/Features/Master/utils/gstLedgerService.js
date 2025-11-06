/* eslint-disable no-unused-vars */
// utils/gstLedgerService.js

export class GSTLedgerService {
  static getLedgerFor(glCode, ledgerName) {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];

      // Filter transactions that include this GST input account
      const relevantTxns = transactions.filter(txn =>
        txn.entries?.some(e => e.glCode === glCode)
      );

      // Sort by date ascending
      relevantTxns.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Build ledger entries with running balance (DR for asset)
      const entries = [];
      let running = 0;
      relevantTxns.forEach(txn => {
        const line = txn.entries.find(e => e.glCode === glCode);
        if (!line) return;
        const debit = line.debit || 0;
        const credit = line.credit || 0;
        running += debit - credit;
        entries.push({
          date: txn.date,
          voucherNo: txn.voucherNo,
          description: line.narration || txn.narration || ledgerName,
          debit,
          credit,
          balance: running,
          counterparty: txn.siteDetails?.siteName || txn.counterparty || '',
          refNo: txn.id,
          costCenter: line.costCenter || 'General',
          approvedBy: txn.approvedBy,
          attachments: line.attachments || 0,
          status: 'Posted'
        });
      });

      const account = chartOfAccounts.find(acc => acc.code === glCode);
      const fy = '2025-26';
      const period = 'Apr 2025 - Mar 2026';
      const openingBalance = '₹0.00 (Dr)';

      return {
        ledgerName: ledgerName,
        ledgerCode: glCode,
        type: 'Asset',
        financialYear: fy,
        period,
        openingBalance,
        entries
      };
    } catch (e) {
      console.error('Error building GST ledger:', e);
      return {
        ledgerName: ledgerName,
        ledgerCode: glCode,
        type: 'Asset',
        financialYear: '',
        period: '',
        openingBalance: '₹0.00 (Dr)',
        entries: []
      };
    }
  }
}


