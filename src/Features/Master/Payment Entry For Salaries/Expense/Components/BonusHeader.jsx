import React from 'react'

const BonusHeader = () => {
  return (
    <header className="bg-gradient-to-r from-teal-800 to-teal-600 text-white p-6 rounded-xl shadow-lg mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-12"></div>

      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-4">
          <i className="fas fa-money-check-dollar text-4xl"></i>
          Monthly Bonus Expense Ledger
        </h1>

        <p className="text-teal-100 mb-6 max-w-3xl">
          Accounting entries recorded ONLY when monthly bonus is paid to employees
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/15 p-4 rounded-lg">
            <h3 className="text-sm text-teal-100 mb-2">General Ledger Code</h3>
            <p className="text-xl font-bold">X2001001007</p>
          </div>

          <div className="bg-white/15 p-4 rounded-lg">
            <h3 className="text-sm text-teal-100 mb-2">Account Type</h3>
            <p className="text-xl font-bold">Expense Account</p>
          </div>

          <div className="bg-white/15 p-4 rounded-lg">
            <h3 className="text-sm text-teal-100 mb-2">Accounting Basis</h3>
            <p className="text-xl font-bold">Cash Basis (Paid Monthly)</p>
          </div>

          <div className="bg-white/15 p-4 rounded-lg">
            <h3 className="text-sm text-teal-100 mb-2">Current FY</h3>
            <p className="text-xl font-bold">2024-2025</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default BonusHeader
