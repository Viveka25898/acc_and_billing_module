// Utility to update closing balance for ALL L (Liability) ledgers and keep them in sync

export function updateLiabilityClosingBalance() {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
        const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances') || '{}');

        // Get all L ledger codes from chart of accounts (Liabilities)
        const lLedgers = chartOfAccounts.filter(acc => acc.code && acc.code.startsWith('L') && acc.type === 'ACCOUNT');

        console.info('[L Sync] Found', lLedgers.length, 'L (Liability) ledgers to sync');

        // Calculate closing balance for each L ledger from transactions
        lLedgers.forEach(ledger => {
            let closingBalance = 0;

            // Calculate from transactions
            transactions.forEach(txn => {
                if (!txn.entries || !Array.isArray(txn.entries)) return;
                txn.entries.forEach(entry => {
                    if (entry.glCode === ledger.code) {
                        const debit = entry.debit || 0;
                        const credit = entry.credit || 0;
                        // For liabilities: credit increases balance, debit decreases balance
                        closingBalance += credit - debit;
                    }
                });
            });

            if (closingBalance !== 0) {
                console.info(`[L Sync] ${ledger.code}: ₹${closingBalance.toFixed(2)}`);
            }

            // Update ledgerBalances for this liability ledger
            ledgerBalances[ledger.code] = { balance: closingBalance };
        });

        // Save updated balances to localStorage
        localStorage.setItem('ledgerBalances', JSON.stringify(ledgerBalances));
        console.info('[L Sync] All L (Liability) ledger balances updated successfully');

    } catch (err) {
        console.error('[L Sync] Error updating closing balances:', err);
    }
}

// Auto-sync function that listens for transaction changes
export function autoSyncLiabilityOnTransactionChange() {
    // Initial sync
    updateLiabilityClosingBalance();

    // Listen for storage changes (transactions updated in another tab/window)
    window.addEventListener('storage', (e) => {
        if (e.key === 'transactions') {
            console.info('[L Sync] Transactions changed, re-syncing liability balances...');
            updateLiabilityClosingBalance();
        }
    });

    // Listen for custom event (transactions updated in same tab)
    window.addEventListener('transactionsUpdated', () => {
        console.info('[L Sync] Transactions updated, re-syncing liability balances...');
        updateLiabilityClosingBalance();
    });
}
