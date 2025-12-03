import { SummaryCard } from './SummeryCard'

export const SummaryFooter = ({ data, ledgerName }) => {
  const totalTransactions = data.length
  const totalExpense = data.reduce((sum, item) => sum + item.expenseAmount, 0)
  const closingBalance = data[data.length - 1]?.runningBalance || 0

  return (
    <footer className="bg-gray-100 border-t-4 border-indigo-600 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Total Transactions" value={totalTransactions.toString()} />
        <SummaryCard
          label="Total Expense Amount"
          value={`₹${totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <SummaryCard
          label="Closing Ledger Balance"
          value={`₹${closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Dr`}
        />
        <SummaryCard label="Ledger Name" value={ledgerName} />
      </div>
    </footer>
  )
}
