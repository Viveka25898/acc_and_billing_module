import React, { useState } from 'react'
import { ledgerData } from '../data/SalaryWagesLedgerData'
import LedgerHeader from '../Components/LedgerHeader'
import FilterBar from '../Components/FilterBar'
import LedgerTable from '../Components/LedgerTable'
import Footer from '../Components/Footer'
function SalaryWagesLedgerPage() {
  const [filters, setFilters] = useState({
    department: 'All',
    costCenter: 'All',
    paymentMode: 'All',
    employeeName: '',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const filteredTransactions = ledgerData.transactions.filter((transaction) => {
    if (filters.department !== 'All' && transaction.department !== filters.department) return false
    if (filters.costCenter !== 'All' && transaction.costCenter !== filters.costCenter) return false
    if (filters.paymentMode !== 'All' && transaction.paymentMode !== filters.paymentMode)
      return false
    if (
      filters.employeeName &&
      !transaction.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())
    )
      return false
    return true
  })

  // Calculate closing balance from last transaction
  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[filteredTransactions.length - 1].balance
      : '₹ 0.00 Dr'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <LedgerHeader accountInfo={ledgerData.accountInfo} />

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={ledgerData.departments}
          costCenters={ledgerData.costCenters}
          paymentModes={ledgerData.paymentModes}
        />

        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Transaction Details ({filteredTransactions.length} records)
          </h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Export to Excel
          </button>
        </div>

        {filteredTransactions.length > 0 ? (
          <LedgerTable transactions={filteredTransactions} />
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500 text-lg">No transactions found matching the filters.</p>
            <button
              onClick={() =>
                setFilters({
                  department: 'All',
                  costCenter: 'All',
                  paymentMode: 'All',
                  employeeName: '',
                })
              }
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pass transactions to Footer */}
        <Footer
          closingBalance={closingBalance}
          totalTransactions={filteredTransactions.length}
          transactions={filteredTransactions}
        />
      </div>
    </div>
  )
}

export default SalaryWagesLedgerPage
