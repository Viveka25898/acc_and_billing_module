// TDS Receivable Ledger Footer — 26AS status section and Note removed
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0.00'
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const TDSReceivableLedgerFooter = ({ entries }) => {
  const totalGrossAmount = entries.reduce((sum, e) => sum + (Number(e.grossAmount) || 0), 0)
  const totalTDSDebit    = entries.reduce((sum, e) => sum + (Number(e.tdsDebit)    || 0), 0)
  const totalCredit      = entries.reduce((sum, e) => sum + (Number(e.credit)      || 0), 0)
  const closingBalance   = totalTDSDebit - totalCredit

  return (
    <div className="border-t-2 border-green-200 bg-green-50">
      {/* Totals Row only — 26AS status and Note row removed */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-bold text-green-800 uppercase tracking-wide">
            Ledger Totals &mdash; GL Code: A3006001
          </span>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-xs">Total Gross Amount</span>
              <span className="font-semibold text-gray-800">{formatCurrency(totalGrossAmount)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-green-700 text-xs font-medium">Total TDS Debit</span>
              <span className="font-bold text-green-700 text-base">{formatCurrency(totalTDSDebit)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-xs">Total Credit</span>
              <span className="font-semibold text-gray-700">{formatCurrency(totalCredit)}</span>
            </div>
            <div className="h-8 w-px bg-green-300" />
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-gray-600">Closing Balance (Dr.)</span>
              <span className={`font-bold text-lg ${closingBalance >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {formatCurrency(closingBalance)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">Total Entries</span>
              <span className="font-semibold text-gray-700">{entries.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TDSReceivableLedgerFooter
