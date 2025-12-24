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
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ledger data...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {accountInfo && <LedgerHeader accountInfo={accountInfo} />}

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={departments}
          costCenters={costCenters}
          paymentModes={paymentModes}
        />

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Transaction Details ({filteredTransactions.length} records)
          </h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base whitespace-nowrap">
            📥 Export to Excel
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
                  startDate: '',
                  endDate: '',
                })
              }
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
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
