// LedgerBalancesLocalStorageService.js
// Utility to manage all ledger balances in localStorage under 'ledgerBalances' key

const LEDGER_BALANCES_KEY = 'ledgerBalances';

// Save all ledger balances to localStorage
export function saveAllLedgerBalances(ledgerBalances) {
    if (!ledgerBalances || typeof ledgerBalances !== 'object') return;
    localStorage.setItem(LEDGER_BALANCES_KEY, JSON.stringify(ledgerBalances));
}

// Get all ledger balances from localStorage
export function getAllLedgerBalances() {
    const data = localStorage.getItem(LEDGER_BALANCES_KEY);
    return data ? JSON.parse(data) : {};
}

// Update a single ledger's balance in localStorage
export function updateLedgerBalance(ledgerCode, closingBalance) {
    if (!ledgerCode) return;
    const balances = getAllLedgerBalances();
    balances[ledgerCode] = closingBalance;
    saveAllLedgerBalances(balances);
}

// Bulk update: add missing ledgers or update all
export function syncAllLedgerBalances(latestBalances) {
    const balances = getAllLedgerBalances();
    let changed = false;
    Object.entries(latestBalances).forEach(([code, balance]) => {
        if (balances[code] !== balance) {
            balances[code] = balance;
            changed = true;
        }
    });
    if (changed) saveAllLedgerBalances(balances);
}
