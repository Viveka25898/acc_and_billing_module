import React from 'react'

const Footer = ({ closingBalance, totalTransactions, transactions, summary }) => {
  // Calculate total debit
  const calculateTotalDebit = () => {
    try {
      if (!transactions || transactions.length === 0) return '0'

      const total = transactions.reduce((sum, transaction) => {
        // Handle both numeric and string debit values
        let debitValue = 0

        if (typeof transaction.debit === 'number') {
          debitValue = transaction.debit
        } else if (typeof transaction.debit === 'string') {
          // Extract numeric value from string (e.g., "₹ 35,000" → 35000)
          debitValue = parseInt(transaction.debit.replace(/[^0-9]/g, '') || '0')
        }

        return sum + debitValue
      }, 0)

      return total.toLocaleString('en-IN')
    } catch (error) {
      console.error('❌ Error calculating total debit:', error)
      return '0'
    }
  }

  return (
    <footer className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Closing Balance</span>
          <span className="text-2xl font-bold text-red-600">{closingBalance}</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Total Transactions</span>
          <span className="text-2xl font-bold text-blue-600">{totalTransactions}</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Total Debit</span>
          <span className="text-2xl font-bold text-green-600">₹ {calculateTotalDebit()}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} XYZ Pvt. Ltd. All rights reserved. This is a sample ledger
          for demonstration purposes.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Data as of {new Date().toLocaleDateString()} | Generated at{' '}
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </footer>
  )
}

export default Footer
