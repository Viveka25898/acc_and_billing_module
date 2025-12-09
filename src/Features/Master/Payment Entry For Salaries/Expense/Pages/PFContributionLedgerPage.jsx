import React, { useState, useMemo } from 'react'
import { pfContributionData } from '../data/PFContributionData'
import PFLedgerHeader from '../Components/PFLedgerHeader'
import PFFilterBar from '../Components/PFFilterBar'
import PFLedgerTable from '../Components/PFLedgerTable'
import PFFooter from '../Components/PFFooter'
const PFContributionLedgerPage = () => {
  const [filters, setFilters] = useState({
    month: 'All',
    site: 'All',
    paymentStatus: 'All',
    paymentMode: 'All',
    employeeSearch: '',
    challanSearch: '',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return pfContributionData.transactions.filter((transaction) => {
      // Month filter
      if (filters.month !== 'All' && transaction.pfPostingMonth !== filters.month) return false

      // Site filter
      if (filters.site !== 'All' && transaction.siteCostCenter !== filters.site) return false

      // Payment Status filter
      if (filters.paymentStatus !== 'All' && transaction.paymentStatus !== filters.paymentStatus)
        return false

      // Payment Mode filter
      if (filters.paymentMode !== 'All' && transaction.paymentMode !== filters.paymentMode)
        return false

      // Employee search filter
      if (
        filters.employeeSearch &&
        !transaction.employeeName.toLowerCase().includes(filters.employeeSearch.toLowerCase()) &&
        !transaction.employeeUan.includes(filters.employeeSearch) &&
        !transaction.employeeId.toLowerCase().includes(filters.employeeSearch.toLowerCase())
      )
        return false

      // Challan/ECR search filter
      if (
        filters.challanSearch &&
        !transaction.ecrNo.toLowerCase().includes(filters.challanSearch.toLowerCase()) &&
        !transaction.challanNo.toLowerCase().includes(filters.challanSearch.toLowerCase())
      )
        return false

      return true
    })
  }, [filters])

  // Calculate summary statistics
  const calculateSummary = useMemo(() => {
    const totalEmployerContribution = filteredTransactions.reduce(
      (sum, t) => sum + (t.amounts?.total || 0),
      0
    )

    const pendingTransactions = filteredTransactions.filter((t) => t.paymentStatus === 'Pending')
    const totalPendingAmount = pendingTransactions.reduce(
      (sum, t) => sum + (t.amounts?.total || 0),
      0
    )

    const paidTransactions = filteredTransactions.filter(
      (t) => t.paymentStatus === 'Paid' || t.paymentStatus === 'Late Paid'
    )
    const totalPaidAmount = paidTransactions.reduce((sum, t) => sum + (t.amounts?.total || 0), 0)

    // Count unique employees
    const uniqueEmployees = new Set(
      filteredTransactions.filter((t) => t.employeeId !== '-').map((t) => t.employeeId)
    )
    const totalEmployees = uniqueEmployees.size

    return {
      totalEmployerContribution,
      totalPendingAmount,
      totalPaidAmount,
      totalEmployees,
    }
  }, [filteredTransactions])

  // Get closing balance
  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[filteredTransactions.length - 1].balance
      : '₹ 0.00 Dr'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <PFLedgerHeader
          accountInfo={pfContributionData.accountInfo}
          pfRates={pfContributionData.pfRates}
        />

        <PFFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          months={pfContributionData.months}
          sites={pfContributionData.sites}
          paymentStatuses={pfContributionData.paymentStatuses}
          paymentModes={pfContributionData.paymentModes}
        />

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              PF Contribution Transactions ({filteredTransactions.length} records)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Employer PF, EPS, Admin & EDLI contributions as per EPF Act
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setFilters({
                  month: 'All',
                  site: 'All',
                  paymentStatus: 'All',
                  paymentMode: 'All',
                  employeeSearch: '',
                  challanSearch: '',
                })
              }
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All Filters
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Add PF Entry
            </button>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <PFLedgerTable transactions={filteredTransactions} />
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No PF transactions found matching the filters.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
          </div>
        )}

        <PFFooter
          closingBalance={closingBalance}
          totalTransactions={filteredTransactions.length}
          totalEmployerContribution={calculateSummary.totalEmployerContribution}
          totalPendingAmount={calculateSummary.totalPendingAmount}
          totalPaidAmount={calculateSummary.totalPaidAmount}
          totalEmployees={calculateSummary.totalEmployees}
        />
      </div>
    </div>
  )
}

export default PFContributionLedgerPage
