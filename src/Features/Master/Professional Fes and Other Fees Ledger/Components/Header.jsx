export const Header = ({ ledgerName }) => {
  return (
    <header className="bg-gradient-to-r from-green-800 to-green-900 text-gray-50 px-6 py-5">
      <h1 className="text-2xl font-semibold mb-1">{ledgerName} Expense Ledger</h1>
      <p className="text-sm opacity-80">
        Ledger view for all {ledgerName.toLowerCase()} booked during the selected period
      </p>
    </header>
  )
}
