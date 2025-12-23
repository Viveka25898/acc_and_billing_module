import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1
  const currentFY = `${currentYear}-${nextYear.toString().slice(-2)}`

  return (
    <footer className="text-center py-6 text-gray-600 border-t border-gray-200">
      <p className="mb-2">
        Monthly Bonus Expense Ledger | GL Code: X2001001007 | Accounting Basis: Cash (Paid Monthly)
      </p>
      <p className="text-sm mb-2">
        This ledger records only actual monthly bonus payments. No accruals or provisions are
        maintained.
      </p>
      <p className="text-sm flex items-center justify-center gap-2">
        <i className="fas fa-lock text-gray-500"></i>
        Financial Document - Access Restricted | FY: {currentFY}
      </p>
    </footer>
  )
}

export default Footer
