import { saveAllReportsLedgersBalances } from './ReportsLedgerBalancesService';
// Utility to update closing balance for ALL X (Expense) ledgers and keep them in sync

export function updateExpenseClosingBalance() {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
        const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances') || '{}');

        // Get all X ledger codes from chart of accounts (Expenses)
        const xLedgers = chartOfAccounts.filter(acc => acc.code && acc.code.startsWith('X') && acc.type === 'ACCOUNT');

        console.info('[X Sync] Found', xLedgers.length, 'X (Expense) ledgers to sync');

        // Calculate closing balance for each X ledger from transactions
        xLedgers.forEach(ledger => {
            let closingBalance = 0;

            // Calculate from transactions
            transactions.forEach(txn => {
                if (!txn.entries || !Array.isArray(txn.entries)) return;
                txn.entries.forEach(entry => {
                    if (entry.glCode === ledger.code) {
                        const debit = entry.debit || 0;
                        const credit = entry.credit || 0;
                        // For expenses: debit increases expense, credit decreases expense
                        closingBalance += debit - credit;
                    }
                });
            });

            if (closingBalance !== 0) {
                console.info(`[X Sync] ${ledger.code}: ₹${closingBalance.toFixed(2)}`);
            }

            // Update ledgerBalances for this expense ledger
            ledgerBalances[ledger.code] = { balance: closingBalance };
        });

        // Save updated balances to localStorage
        localStorage.setItem('ledgerBalances', JSON.stringify(ledgerBalances));
        // Also update reportsLedgersBalances
        saveAllReportsLedgersBalances();
        console.info('[X Sync] All X (Expense) ledger balances updated successfully');

    } catch (err) {
        console.error('[X Sync] Error updating closing balances:', err);
    }
}

// Auto-sync function that listens for transaction changes
export function autoSyncExpenseOnTransactionChange() {
    // Initial sync
    updateExpenseClosingBalance();

    // Listen for storage changes (transactions updated in another tab/window)
    window.addEventListener('storage', (e) => {
        if (e.key === 'transactions') {
            console.info('[X Sync] Transactions changed, re-syncing expense balances...');
            updateExpenseClosingBalance();
        }
    });

    // Listen for custom event (transactions updated in same tab)
    window.addEventListener('transactionsUpdated', () => {
        console.info('[X Sync] Transactions updated, re-syncing expense balances...');
        updateExpenseClosingBalance();
    });
}
