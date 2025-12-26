/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import PFLedgerHeader from '../Components/PFLedgerHeader'
import PFFilterBar from '../Components/PFFilterBar'
import PFLedgerTable from '../Components/PFLedgerTable'
import PFFooter from '../Components/PFFooter'

const PFContributionLedgerPage = () => {
  const [allTransactions, setAllTransactions] = useState([])
  const [ledgerDetails, setLedgerDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    month: 'All',
    site: 'All',
    paymentStatus: 'All',
    paymentMode: 'All',
    employeeSearch: '',
    challanSearch: '',
  })

  // Load real transactions from localStorage
  useEffect(() => {
    try {
      console.log('🔄 Loading Employer PF Contribution ledger data...')
      const details = SalaryLedgerService.getLedgerDetails('X2001001002')
      setLedgerDetails(details)
      const transactions = SalaryLedgerService.getLedgerTransactions('X2001001002')
      setAllTransactions(transactions)
      console.log('✅ Loaded Employer PF Contribution ledger:', {
        details,
        transactionCount: transactions.length,
      })
      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading PF Contribution ledger:', error)
      setLoading(false)
    }
  }, [])

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'reset') {
      setFilters({
        month: 'All',
        site: 'All',
        paymentStatus: 'All',
        paymentMode: 'All',
        employeeSearch: '',
        challanSearch: '',
      })
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }))
    }
  }

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    try {
      if (!allTransactions || allTransactions.length === 0) return []

      return allTransactions.filter((transaction) => {
        // Skip opening balance in filters
        if (transaction.entryType === 'opening') return true

        // Month filter
        if (filters.month !== 'All' && transaction.payrollPeriod !== filters.month) return false

        // Site filter
        if (filters.site !== 'All' && transaction.costCenter !== filters.site) return false

        // Payment Status filter
        if (filters.paymentStatus !== 'All' && transaction.status !== filters.paymentStatus)
          return false

        // Payment Mode filter
        if (filters.paymentMode !== 'All' && transaction.paymentMethod !== filters.paymentMode)
          return false

        // Employee search filter
        if (
          filters.employeeSearch &&
          !transaction.narration.toLowerCase().includes(filters.employeeSearch.toLowerCase()) &&
          !transaction.referenceDoc.toLowerCase().includes(filters.employeeSearch.toLowerCase())
        )
          return false

        // Challan/ECR search filter
        if (
          filters.challanSearch &&
          !transaction.voucherNo.toLowerCase().includes(filters.challanSearch.toLowerCase()) &&
          !transaction.batchId.toLowerCase().includes(filters.challanSearch.toLowerCase())
        )
          return false

        return true
      })
    } catch (error) {
      console.error('❌ Error filtering transactions:', error)
      return []
    }
  }, [allTransactions, filters])

  // Calculate summary statistics
  const calculateSummary = useMemo(() => {
    try {
      const totalEmployerContribution = filteredTransactions.reduce(
        (sum, t) => sum + (t.debit || 0),
        0
      )

      const pendingTransactions = filteredTransactions.filter((t) => t.status === 'Pending')
      const totalPendingAmount = pendingTransactions.reduce((sum, t) => sum + (t.debit || 0), 0)

      const paidTransactions = filteredTransactions.filter(
        (t) => t.status === 'Posted' || t.status === 'Paid'
      )
      const totalPaidAmount = paidTransactions.reduce((sum, t) => sum + (t.debit || 0), 0)

      // Count transactions
      const totalEmployees = filteredTransactions.filter((t) => t.entryType !== 'opening').length

      return {
        totalEmployerContribution,
        totalPendingAmount,
        totalPaidAmount,
        totalEmployees,
      }
    } catch (error) {
      console.error('❌ Error calculating summary:', error)
      return {
        totalEmployerContribution: 0,
        totalPendingAmount: 0,
        totalPaidAmount: 0,
        totalEmployees: 0,
      }
    }
  }, [filteredTransactions])

  // Get closing balance
  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[filteredTransactions.length - 1].balanceFormatted || '₹ 0.00 Dr'
      : '₹ 0.00 Dr'

  // Get summary from service
  const summary = useMemo(() => {
    try {
      return SalaryLedgerService.getLedgerSummary(filteredTransactions, 'X2001001002')
    } catch (error) {
      console.error('❌ Error getting ledger summary:', error)
      return {
        openingBalance: 0,
        totalDebit: 0,
        totalCredit: 0,
        closingBalance: 0,
        transactionCount: 0,
      }
    }
  }, [filteredTransactions])

  // Extract unique values for filters
  const months = useMemo(() => {
    const m = new Set(['All'])
    allTransactions.forEach((t) => {
      if (t.payrollPeriod && t.payrollPeriod !== '-') m.add(t.payrollPeriod)
    })
    return Array.from(m)
  }, [allTransactions])

  const sites = useMemo(() => {
    const s = new Set(['All'])
    allTransactions.forEach((t) => {
      if (t.costCenter && t.costCenter !== '-') s.add(t.costCenter)
    })
    return Array.from(s)
  }, [allTransactions])

  const paymentStatuses = ['All', 'Posted', 'Pending', 'Paid']
  const paymentModes = ['All', 'Bank Transfer', 'NEFT', 'RTGS', 'Cheque']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">
            Loading PF Contribution Ledger...
          </p>
        </div>
      </div>
    )
  }

  const accountInfo = ledgerDetails
    ? {
        glAccountCode: ledgerDetails.glAccountCode,
        accountName: ledgerDetails.accountName,
        accountType: ledgerDetails.accountType,
        category: ledgerDetails.category,
        financialYear: ledgerDetails.financialYear,
      }
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {accountInfo && (
          <PFLedgerHeader accountInfo={accountInfo} pfRates={{ employer: 12, eps: 8.33 }} />
        )}

        <PFFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          months={months}
          sites={sites}
          paymentStatuses={paymentStatuses}
          paymentModes={paymentModes}
        />

        <div className="mb-6 bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">PF Contribution Transactions</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredTransactions.length} of {allTransactions.length} total records |
              Employer PF, EPS, Admin & EDLI contributions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('reset', null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              🔄 Clear Filters
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md font-medium">
              ➕ Add PF Entry
            </button>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <PFLedgerTable transactions={filteredTransactions} />
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-lg">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              No PF transactions found matching the filters
            </p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
            <button
              onClick={() => handleFilterChange('reset', null)}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔄 Clear All Filters
            </button>
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
