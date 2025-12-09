import React, { useState, useMemo } from 'react'
import { liabilityData } from '../data/SalaryLiabilityData'
import LiabilityLedgerHeader from '../Component/LedgerHeader'
import LiabilityFilterBar from '../Component/FilterBar'
import LiabilityLedgerTable from '../Component/LedgerTable'
import LiabilityFooter from '../Component/Footer'
const SalaryPayableLedger = () => {
  const [filters, setFilters] = useState({
    department: 'All',
    costCenter: 'All',
    status: 'All',
    paymentMethod: 'All',
    employeeSearch: '',
    startDate: '',
    endDate: '',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const filteredTransactions = useMemo(() => {
    return liabilityData.transactions.filter((transaction) => {
      // Department filter
      if (filters.department !== 'All' && transaction.department !== filters.department)
        return false

      // Cost Center filter
      if (filters.costCenter !== 'All' && transaction.costCenter !== filters.costCenter)
        return false

      // Status filter
      if (filters.status !== 'All' && transaction.status !== filters.status) return false

      // Payment Method filter
      if (filters.paymentMethod !== 'All' && transaction.paymentMethod !== filters.paymentMethod)
        return false

      // Employee search filter
      if (
        filters.employeeSearch &&
        !transaction.employeeName.toLowerCase().includes(filters.employeeSearch.toLowerCase()) &&
        !transaction.employeeId.toLowerCase().includes(filters.employeeSearch.toLowerCase())
      )
        return false

      // Date range filter
      if (filters.startDate) {
        const transactionDate = new Date(transaction.date.split('-').reverse().join('-'))
        const startDate = new Date(filters.startDate)
        if (transactionDate < startDate) return false
      }

      if (filters.endDate) {
        const transactionDate = new Date(transaction.date.split('-').reverse().join('-'))
        const endDate = new Date(filters.endDate)
        if (transactionDate > endDate) return false
      }

      return true
    })
  }, [filters])

  // Calculate summary statistics
  const calculateSummary = useMemo(() => {
    const totalPayable = filteredTransactions.reduce((sum, t) => sum + (t.creditAmount || 0), 0)

    const pendingTransactions = filteredTransactions.filter((t) => t.status === 'Pending')
    const totalPending = pendingTransactions.reduce((sum, t) => sum + (t.creditAmount || 0), 0)

    const paidTransactions = filteredTransactions.filter((t) => t.status === 'Paid')
    const totalPaid = paidTransactions.reduce((sum, t) => {
      const debitValue = parseInt(t.debit.replace(/[^0-9]/g, '') || '0')
      return sum + debitValue
    }, 0)

    return { totalPayable, totalPending, totalPaid }
  }, [filteredTransactions])

  // Get closing balance
  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[filteredTransactions.length - 1].balance
      : '₹ 0.00'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <LiabilityLedgerHeader accountInfo={liabilityData.accountInfo} />

        <LiabilityFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={liabilityData.departments}
          costCenters={liabilityData.costCenters}
          statusOptions={liabilityData.statusOptions}
          paymentMethods={liabilityData.paymentMethods}
        />

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Salary Payable Transactions ({filteredTransactions.length} records)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Liability account showing amounts owed to employees
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setFilters({
                  department: 'All',
                  costCenter: 'All',
                  status: 'All',
                  paymentMethod: 'All',
                  employeeSearch: '',
                  startDate: '',
                  endDate: '',
                })
              }
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All Filters
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Add New Transaction
            </button>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <LiabilityLedgerTable transactions={filteredTransactions} />
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No transactions found matching the filters.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
          </div>
        )}

        <LiabilityFooter
          closingBalance={closingBalance}
          totalTransactions={filteredTransactions.length}
          totalPayable={calculateSummary.totalPayable}
          totalPending={calculateSummary.totalPending}
          totalPaid={calculateSummary.totalPaid}
        />
      </div>
    </div>
  )
}

export default SalaryPayableLedger
