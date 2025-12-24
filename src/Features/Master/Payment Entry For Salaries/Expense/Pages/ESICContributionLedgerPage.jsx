import React, { useState, useMemo, useEffect } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import ESICLedgerHeader from '../Components/ESICLedgerHeader'
import ESICFilterBar from '../Components/ESICFilterBar'
import ESICLedgerTable from '../Components/ESICLedgerTable'
import ESICFooter from '../Components/ESICFooter'

const ESICContributionLedgerPage = () => {
  const [allTransactions, setAllTransactions] = useState([])
  const [ledgerDetails, setLedgerDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    month: 'All',
    branch: 'All',
    paymentStatus: 'All',
    paymentMode: 'All',
    minWages: '',
    maxWages: '',
    challanSearch: '',
  })

  // Load real transactions from localStorage
  useEffect(() => {
    try {
      console.log('🔄 Loading Employer ESIC Contribution ledger data...')
      const details = SalaryLedgerService.getLedgerDetails('X2001001003')
      setLedgerDetails(details)
      const transactions = SalaryLedgerService.getLedgerTransactions('X2001001003')
      setAllTransactions(transactions)
      console.log('✅ Loaded Employer ESIC Contribution ledger:', {
        details,
        transactionCount: transactions.length,
      })
      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading ESIC Contribution ledger:', error)
      setLoading(false)
    }
  }, [])

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return esicContributionData.transactions.filter((transaction) => {
      // Month filter
      if (filters.month !== 'All' && transaction.esicMonth !== filters.month) return false

      // Branch filter
      if (filters.branch !== 'All' && transaction.branchCostCenter !== filters.branch) return false

      // Payment Status filter
      if (filters.paymentStatus !== 'All' && transaction.paymentStatus !== filters.paymentStatus)
        return false

      // Payment Mode filter
      if (filters.paymentMode !== 'All' && transaction.paymentMode !== filters.paymentMode)
        return false

      // ESI Wages range filter
      if (filters.minWages) {
        const esiWages = parseInt(transaction.esiWages.replace(/[^0-9]/g, '') || '0')
        if (esiWages < parseInt(filters.minWages)) return false
      }

      if (filters.maxWages) {
        const esiWages = parseInt(transaction.esiWages.replace(/[^0-9]/g, '') || '0')
        if (esiWages > parseInt(filters.maxWages)) return false
      }

      // Challan/TRRN search filter
      if (
        filters.challanSearch &&
        !transaction.trrnNo.toLowerCase().includes(filters.challanSearch.toLowerCase()) &&
        !transaction.esiChallanNo.toLowerCase().includes(filters.challanSearch.toLowerCase())
      )
        return false

      return true
    })
  }, [filters])

  // Calculate summary statistics
  const calculateSummary = useMemo(() => {
    const totalEmployerContribution = filteredTransactions.reduce(
      (sum, t) => sum + (t.amounts?.employerContribution || 0),
      0
    )

    const pendingTransactions = filteredTransactions.filter((t) => t.paymentStatus === 'Pending')
    const totalPendingAmount = pendingTransactions.reduce(
      (sum, t) => sum + (t.amounts?.employerContribution || 0),
      0
    )

    // Count unique employees covered
    const totalEmployeesCovered = filteredTransactions.reduce(
      (sum, t) => sum + (t.esiEligibleEmployees || 0),
      0
    )

    // Calculate penalties
    const penaltyTransactions = filteredTransactions.filter(
      (t) =>
        t.paymentStatus === 'Late Paid' || (t.amounts && (t.amounts.penalty || t.amounts.interest))
    )
    const totalPenalties = penaltyTransactions.reduce(
      (sum, t) => sum + (t.amounts?.penalty || 0) + (t.amounts?.interest || 0),
      0
    )

    return {
      totalEmployerContribution,
      totalPendingAmount,
      totalEmployeesCovered,
      totalPenalties,
    }
  }, [filteredTransactions])

  // Get closing balance
  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[filteredTransactions.length - 1].balance
      : '₹ 0.00 Dr'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <ESICLedgerHeader
          accountInfo={esicContributionData.accountInfo}
          complianceInfo={esicContributionData.complianceInfo}
          medicalBenefits={esicContributionData.medicalBenefits}
        />

        <ESICFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          months={esicContributionData.months}
          branches={esicContributionData.branches}
          paymentStatuses={esicContributionData.paymentStatuses}
          paymentModes={esicContributionData.paymentModes}
        />

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              ESIC Contribution Transactions ({filteredTransactions.length} records)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Employer ESIC contributions @ 3.25% as per ESI Act, 1948
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setFilters({
                  month: 'All',
                  branch: 'All',
                  paymentStatus: 'All',
                  paymentMode: 'All',
                  minWages: '',
                  maxWages: '',
                  challanSearch: '',
                })
              }
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All Filters
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Add ESIC Entry
            </button>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <ESICLedgerTable transactions={filteredTransactions} />
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
            <p className="text-gray-500 text-lg">No ESIC transactions found.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
          </div>
        )}

        <ESICFooter
          closingBalance={closingBalance}
          totalTransactions={filteredTransactions.length}
          totalEmployerContribution={calculateSummary.totalEmployerContribution}
          totalPendingAmount={calculateSummary.totalPendingAmount}
          totalEmployeesCovered={calculateSummary.totalEmployeesCovered}
          totalPenalties={calculateSummary.totalPenalties}
        />
      </div>
    </div>
  )
}

export default ESICContributionLedgerPage
