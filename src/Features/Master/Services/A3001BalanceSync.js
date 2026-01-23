// Utility to update closing balance for ALL A3 ledgers and keep them in sync
// This does NOT change existing logic, just adds a sync step

export function updateA3001ClosingBalance() {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
        const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances') || '{}');
        const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts') || '{}');
        const clientLedgers = JSON.parse(localStorage.getItem('clientLedgers') || '{}');

        // Get all A3 ledger codes from chart of accounts
        const a3Ledgers = chartOfAccounts.filter(acc => acc.code && acc.code.startsWith('A3') && acc.type === 'ACCOUNT');

        // Get all D-prefix client/debtor ledgers (A3003 sub-accounts)
        const debtorLedgers = chartOfAccounts.filter(acc => acc.code && acc.code.startsWith('D') && acc.type === 'ACCOUNT');

        console.info('[A3 Sync] Found', a3Ledgers.length, 'A3 ledgers to sync');
        console.info('[A3 Sync] Found', debtorLedgers.length, 'D (debtor) ledgers to sync');

        // Calculate closing balance for each A3 ledger from transactions
        a3Ledgers.forEach(ledger => {
            let closingBalance = 0;

            // Calculate from transactions (works for all A3 ledgers including banks)
            transactions.forEach(txn => {
                if (!txn.entries || !Array.isArray(txn.entries)) return;
                txn.entries.forEach(entry => {
                    if (entry.glCode === ledger.code) {
                        const debit = entry.debit || 0;
                        const credit = entry.credit || 0;
                        closingBalance += debit - credit;
                    }
                });
            });

            if (closingBalance !== 0) {
                console.info(`[A3 Sync] ${ledger.code}: ₹${closingBalance.toFixed(2)}`);
            }

            // Update ledgerBalances for this ledger
            ledgerBalances[ledger.code] = { balance: closingBalance };
        });

        // Calculate closing balance for each D (debtor/client) ledger
        debtorLedgers.forEach(ledger => {
            let closingBalance = 0;

            // Calculate closing balance from transactions
            transactions.forEach(txn => {
                if (!txn.entries || !Array.isArray(txn.entries)) return;
                txn.entries.forEach(entry => {
                    if (entry.glCode === ledger.code) {
                        const debit = entry.debit || 0;
                        const credit = entry.credit || 0;
                        closingBalance += debit - credit;
                    }
                });
            });

            if (closingBalance !== 0) {
                console.info(`[A3 Sync] ${ledger.code} (Debtor): ₹${closingBalance.toFixed(2)}`);
            }

            // Update ledgerBalances for this debtor ledger
            ledgerBalances[ledger.code] = { balance: closingBalance };
        });

        // Save updated balances to localStorage
        localStorage.setItem('ledgerBalances', JSON.stringify(ledgerBalances));
        console.info('[A3 Sync] All A3 ledger balances updated successfully');

    } catch (err) {
        console.error('[A3 Sync] Error updating closing balances:', err);
    }
}

// Optionally, call this after adding a new entry to any A3 ledger
export function autoSyncA3001OnTransactionChange() {
    // Listen for a custom event 'transactionsUpdated' and update closing balance
    window.addEventListener('transactionsUpdated', updateA3001ClosingBalance);
}
