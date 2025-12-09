import React, { useState, useMemo } from 'react'
import { pfPayableData } from './../data/PFPayableLedgerData'
import PFPayableHeader from '../Component/PFPayableHeader'
import PFPayableFilterBar from '../Component/PFPayableFilterBar'
import PFPayableLedgerTable from '../Component/PFPayableLedgerTable'
import PFPayableFooter from '../Component/PFPayableFooter'
const PFPayableLedgerPage = () => {
  const [filters, setFilters] = useState({
    month: 'All',
    costCenter: 'All',
    paymentStatus: 'All',
    showOnly: 'all',
    challanSearch: '',
    dueDateStart: '',
    dueDateEnd: '',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return pfPayableData.transactions.filter((transaction) => {
      // Month filter
      if (filters.month !== 'All' && transaction.pfMonth !== filters.month) return false

      // Cost Center filter
      if (filters.costCenter !== 'All' && transaction.costCenter !== filters.costCenter)
        return false

      // Payment Status filter
      if (filters.paymentStatus !== 'All' && transaction.paymentStatus !== filters.paymentStatus)
        return false

      // Show Only filter
      if (filters.showOnly === 'liability' && !transaction.credit.includes('₹')) return false
      if (filters.showOnly === 'payment' && !transaction.debit.includes('₹')) return false

      // Challan/ECR search filter
      if (
        filters.challanSearch &&
        !transaction.ecrNo.toLowerCase().includes(filters.challanSearch.toLowerCase()) &&
        !transaction.challanNo.toLowerCase().includes(filters.challanSearch.toLowerCase())
      )
        return false

      // Due Date range filter
      if (filters.dueDateStart) {
        const dueDate = new Date(transaction.dueDate.split('-').reverse().join('-'))
        const startDate = new Date(filters.dueDateStart)
        if (dueDate < startDate) return false
      }

      if (filters.dueDateEnd) {
        const dueDate = new Date(transaction.dueDate.split('-').reverse().join('-'))
        const endDate = new Date(filters.dueDateEnd)
        if (dueDate > endDate) return false
      }

      return true
    })
  }, [filters])

  // Calculate summary statistics
  const calculateSummary = useMemo(() => {
    const totalLiability = filteredTransactions.reduce((sum, t) => {
      if (t.credit !== '-') {
        const creditValue = parseInt(t.credit.replace(/[^0-9]/g, '') || '0')
        return sum + creditValue
      }
      return sum
    }, 0)

    const unpaidTransactions = filteredTransactions.filter(
      (t) => t.paymentStatus === 'Unpaid' || t.paymentStatus === 'Overdue'
    )
    const totalUnpaidAmount = unpaidTransactions.reduce((sum, t) => {
      if (t.credit !== '-') {
        const creditValue = parseInt(t.credit.replace(/[^0-9]/g, '') || '0')
        return sum + creditValue
      }
      return sum
    }, 0)

    // Calculate overdue (past due date)
    const today = new Date()
    const overdueTransactions = filteredTransactions.filter((t) => {
      if (t.paymentStatus === 'Unpaid' || t.paymentStatus === 'Overdue') {
        const dueDate = new Date(t.dueDate.split('-').reverse().join('-'))
        return dueDate < today
      }
      return false
    })
    const overdueAmount = overdueTransactions.reduce((sum, t) => {
      if (t.credit !== '-') {
        const creditValue = parseInt(t.credit.replace(/[^0-9]/g, '') || '0')
        return sum + creditValue
      }
      return sum
    }, 0)

    // Calculate penalties
    const penaltyTransactions = filteredTransactions.filter(
      (t) => t.paymentStatus === 'Late Paid' || (t.amounts && t.amounts.penalty)
    )
    const penaltyAmount = penaltyTransactions.reduce((sum, t) => sum + (t.amounts?.penalty || 0), 0)

    return {
      totalLiability,
      totalUnpaidAmount,
      overdueAmount,
      penaltyAmount,
    }
  }, [filteredTransactions])

  // Get closing balance
  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[filteredTransactions.length - 1].balance
      : '₹ 0.00'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <PFPayableHeader
          accountInfo={pfPayableData.accountInfo}
          complianceInfo={pfPayableData.complianceInfo}
        />

        <PFPayableFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          months={pfPayableData.months}
          costCenters={pfPayableData.costCenters}
          paymentStatuses={pfPayableData.paymentStatuses}
        />

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              PF Payable Transactions ({filteredTransactions.length} records)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Liability account showing amounts payable to EPFO
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setFilters({
                  month: 'All',
                  costCenter: 'All',
                  paymentStatus: 'All',
                  showOnly: 'all',
                  challanSearch: '',
                  dueDateStart: '',
                  dueDateEnd: '',
                })
              }
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All Filters
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Add PF Liability Entry
            </button>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <PFPayableLedgerTable transactions={filteredTransactions} />
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No PF payable transactions found.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
          </div>
        )}

        <PFPayableFooter
          closingBalance={closingBalance}
          totalTransactions={filteredTransactions.length}
          totalLiability={calculateSummary.totalLiability}
          totalUnpaidAmount={calculateSummary.totalUnpaidAmount}
          overdueAmount={calculateSummary.overdueAmount}
          penaltyAmount={calculateSummary.penaltyAmount}
        />
      </div>
    </div>
  )
}

export default PFPayableLedgerPage
