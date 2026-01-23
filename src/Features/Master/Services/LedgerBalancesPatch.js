// Patch for updating ledgerBalances in localStorage after any ledger update
// Usage: Call this function after updating any ledger's closing balance
import { updateLedgerBalance } from '../Services/LedgerBalancesLocalStorageService'

// Call this after updating a ledger's closing balance
export function patchUpdateLedgerBalanceAfterLedgerChange(ledgerCode, closingBalance) {
    updateLedgerBalance(ledgerCode, closingBalance)
}

// Optionally, call this after bulk updates to ledgers
import { syncAllLedgerBalances } from '../Services/LedgerBalancesLocalStorageService'
export function patchSyncAllLedgerBalances(latestBalances) {
    syncAllLedgerBalances(latestBalances)
}
