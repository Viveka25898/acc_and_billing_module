import React, { useState, useMemo } from 'react'
import { lwfContributionData } from '../data/lwfContributionData'
import LWFLedgerHeader from '../Components/LWFHeaderLedger'
import LWFFilterBar from '../Components/LWFFilterBar'
import LWFLedgerTable from '../Components/LWFLedgerTable'
import LWFFooter from '../Components/LWFFooter'

const LWFContributionLedgerPage = () => {
  const [filters, setFilters] = useState({
    month: 'All',
    state: 'All',
    contributionType: 'All',
    paymentStatus: 'All',
    minEmployees: '',
    maxEmployees: '',
    minAmount: '',
    maxAmount: '',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return lwfContributionData.transactions.filter((transaction) => {
      // Month filter (extract month from date)
      if (filters.month !== 'All') {
        const transactionMonth = transaction.date.split('-')[1] // Extract MM from DD-MM-YYYY
        const filterMonth = {
          'Apr-2024': '04',
          'May-2024': '05',
          'Jun-2024': '06',
          'Jul-2024': '07',
          'Aug-2024': '08',
          'Sep-2024': '09',
        }[filters.month]

        if (transactionMonth !== filterMonth) return false
      }

      // State filter
      if (filters.state !== 'All' && transaction.state !== filters.state) return false

      // Contribution Type filter
      if (
        filters.contributionType !== 'All' &&
        transaction.contributionType !== filters.contributionType
      )
        return false

      // Payment Status filter
      if (filters.paymentStatus !== 'All' && transaction.paymentStatus !== filters.paymentStatus)
        return false

      // Employee Count range filter
      if (filters.minEmployees && transaction.employeeCount !== '-') {
        const employeeCount = parseInt(transaction.employeeCount) || 0
        if (employeeCount < parseInt(filters.minEmployees)) return false
      }

      if (filters.maxEmployees && transaction.employeeCount !== '-') {
        const employeeCount = parseInt(transaction.employeeCount) || 0
        if (employeeCount > parseInt(filters.maxEmployees)) return false
      }

      // Amount range filter
      if (filters.minAmount && transaction.debit !== '-') {
        const debitAmount = parseInt(transaction.debit.replace(/[^0-9]/g, '') || 0)
        if (debitAmount < parseInt(filters.minAmount)) return false
      }

      if (filters.maxAmount && transaction.debit !== '-') {
        const debitAmount = parseInt(transaction.debit.replace(/[^0-9]/g, '') || 0)
        if (debitAmount > parseInt(filters.maxAmount)) return false
      }

      return true
    })
  }, [filters])

  // Calculate summary statistics
  const calculateSummary = useMemo(() => {
    const totalExpense = filteredTransactions.reduce(
      (sum, t) => sum + parseInt(t.debit.replace(/[^0-9]/g, '') || 0),
      0
    )

    // Calculate total employees covered
    const employeeTransactions = filteredTransactions.filter((t) => t.employeeCount !== '-')
    const coveredEmployees = employeeTransactions.reduce(
      (sum, t) => sum + (parseInt(t.employeeCount) || 0),
      0
    )

    // Count unique states covered
    const uniqueStates = new Set(
      filteredTransactions.filter((t) => t.state !== 'All States').map((t) => t.state)
    )
    const statesCovered = uniqueStates.size

    // Calculate pending payments (accrued entries)
    const pendingTransactions = filteredTransactions.filter(
      (t) => t.paymentStatus === 'Accrued' || t.paymentStatus === 'Pending'
    )
    const pendingPayments = pendingTransactions.reduce(
      (sum, t) => sum + parseInt(t.debit.replace(/[^0-9]/g, '') || 0),
      0
    )

    return {
      totalExpense,
      coveredEmployees,
      statesCovered,
      pendingPayments,
    }
  }, [filteredTransactions])

  // Get closing balance from the last transaction
  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[filteredTransactions.length - 1].balance
      : '₹ 0.00'

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <LWFLedgerHeader
          accountInfo={lwfContributionData.accountInfo}
          stateRates={lwfContributionData.stateRates}
          complianceInfo={lwfContributionData.complianceInfo}
        />

        <LWFFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          months={lwfContributionData.months}
          states={lwfContributionData.states}
          contributionTypes={lwfContributionData.contributionTypes}
          paymentStatuses={lwfContributionData.paymentStatuses}
        />

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              LWF Contribution Transactions ({filteredTransactions.length} records)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Employer Labour Welfare Fund contributions as per various State LWF Acts
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setFilters({
                  month: 'All',
                  state: 'All',
                  contributionType: 'All',
                  paymentStatus: 'All',
                  minEmployees: '',
                  maxEmployees: '',
                  minAmount: '',
                  maxAmount: '',
                })
              }
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All Filters
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Add LWF Contribution Entry
            </button>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <LWFLedgerTable transactions={filteredTransactions} />
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
            <p className="text-gray-500 text-lg">No LWF transactions found.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
          </div>
        )}

        <LWFFooter
          closingBalance={closingBalance}
          totalTransactions={filteredTransactions.length}
          totalExpense={calculateSummary.totalExpense}
          coveredEmployees={calculateSummary.coveredEmployees}
          statesCovered={calculateSummary.statesCovered}
          pendingPayments={calculateSummary.pendingPayments}
          complianceInfo={lwfContributionData.complianceInfo}
        />
      </div>
    </div>
  )
}

export default LWFContributionLedgerPage
