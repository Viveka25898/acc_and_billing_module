// Service to save all ledger balances (Account, Folder, Subfolder, etc.) in localStorage under 'reportsLedgersBalances'
// Tolerates both number and object entries in `ledgerBalances`.

export function saveAllReportsLedgersBalances() {
  try {
    const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || []
    const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances') || '{}')
    const reportsLedgersBalances = {}

    chartOfAccounts.forEach((acc) => {
      if (!acc.code) return

      const balanceEntry = ledgerBalances[acc.code]
      let balance = 0

      if (balanceEntry !== null && balanceEntry !== undefined) {
        if (typeof balanceEntry === 'number') {
          // Plain number stored in ledgerBalances
          balance = balanceEntry
        } else if (typeof balanceEntry === 'object') {
          // Object with possible balance fields
          const val =
            balanceEntry.balance ??
            balanceEntry.closingBalance ??
            balanceEntry.amount ??
            0
          balance = typeof val === 'number' ? val : Number(val) || 0
        }
      }

      reportsLedgersBalances[acc.code] = {
        type: acc.type,
        name: acc.name,
        balance,
      }
    })

    localStorage.setItem('reportsLedgersBalances', JSON.stringify(reportsLedgersBalances))
    console.info('[Reports] All ledger balances saved to reportsLedgersBalances')
  } catch (err) {
    console.error('[Reports] Error saving reportsLedgersBalances:', err)
  }
}

