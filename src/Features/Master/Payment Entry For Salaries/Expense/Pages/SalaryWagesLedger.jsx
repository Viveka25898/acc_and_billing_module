import React, { useState, useEffect, useMemo } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import LedgerHeader from '../Components/LedgerHeader'
import FilterBar from '../Components/FilterBar'
import LedgerTable from '../Components/LedgerTable'
import Footer from '../Components/Footer'

function SalaryWagesLedgerPage() {
  const [allTransactions, setAllTransactions] = useState([])
  const [ledgerDetails, setLedgerDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    department: 'All',
    costCenter: 'All',
    paymentMode: 'All',
    employeeName: '',
    startDate: '',
    endDate: '',
  })

  // Load real transactions from localStorage on component mount
  useEffect(() => {
    try {
      console.log('🔄 Loading Salaries & Wages ledger data...')

      // Get ledger details
      const details = SalaryLedgerService.getLedgerDetails('X2001001001')
      setLedgerDetails(details)

      // Get transactions
      const transactions = SalaryLedgerService.getLedgerTransactions('X2001001001')
      setAllTransactions(transactions)

      console.log('✅ Loaded Salaries & Wages ledger:', {
        details,
        transactionCount: transactions.length,
      })

      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading Salaries & Wages ledger:', error)
      setLoading(false)
    }
  }, [])

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'reset') {
      setFilters({
        department: 'All',
        costCenter: 'All',
        paymentMode: 'All',
        employeeName: '',
        startDate: '',
        endDate: '',
      })
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }))
    }
  }

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      // Skip opening balance in filters
      if (transaction.entryType === 'opening') return true

      if (filters.department !== 'All' && transaction.department !== filters.department)
        return false
      if (filters.costCenter !== 'All' && transaction.costCenter !== filters.costCenter)
        return false
      if (filters.paymentMode !== 'All' && transaction.paymentMethod !== filters.paymentMode)
        return false
      if (
        filters.employeeName &&
        !transaction.narration.toLowerCase().includes(filters.employeeName.toLowerCase())
      )
        return false

      // Date range filter
      if (filters.startDate || filters.endDate) {
        try {
          const parts = transaction.date.split('-')
          const transactionDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)

          if (filters.startDate) {
            const startDate = new Date(filters.startDate)
            if (transactionDate < startDate) return false
          }

          if (filters.endDate) {
            const endDate = new Date(filters.endDate)
            if (transactionDate > endDate) return false
          }
        } catch {
          // Skip invalid dates
        }
      }

      return true
    })
  }, [allTransactions, filters])

  // Get summary from service
  const summary = useMemo(() => {
    return SalaryLedgerService.getLedgerSummary(filteredTransactions, 'X2001001001')
  }, [filteredTransactions])

  // Calculate closing balance from last transaction
  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[filteredTransactions.length - 1].balanceFormatted
      : '₹ 0.00 Dr'

  // Extract unique values for filter dropdowns
  const departments = useMemo(() => {
    const depts = new Set(['All'])
    allTransactions.forEach((t) => {
      if (t.department && t.department !== '-') depts.add(t.department)
    })
    return Array.from(depts)
  }, [allTransactions])

  const costCenters = useMemo(() => {
    const centers = new Set(['All'])
    allTransactions.forEach((t) => {
      if (t.costCenter && t.costCenter !== '-') centers.add(t.costCenter)
    })
    return Array.from(centers)
  }, [allTransactions])

  const paymentModes = useMemo(() => {
    const modes = new Set(['All'])
    allTransactions.forEach((t) => {
      if (t.paymentMethod && t.paymentMethod !== '-') modes.add(t.paymentMethod)
    })
    return Array.from(modes)
  }, [allTransactions])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading Salary & Wages Ledger...</p>
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
        {accountInfo && <LedgerHeader accountInfo={accountInfo} />}

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={departments}
          costCenters={costCenters}
          paymentModes={paymentModes}
        />

        <div className="mb-6 bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredTransactions.length} of {allTransactions.length} total records
            </p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md text-sm md:text-base whitespace-nowrap font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export to Excel
          </button>
        </div>

        {filteredTransactions.length > 0 ? (
          <LedgerTable transactions={filteredTransactions} />
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              No transactions found matching the filters
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

        <Footer
          closingBalance={closingBalance}
          totalTransactions={filteredTransactions.length}
          transactions={filteredTransactions}
          summary={summary}
        />
      </div>
    </div>
  )
}

export default SalaryWagesLedgerPage
