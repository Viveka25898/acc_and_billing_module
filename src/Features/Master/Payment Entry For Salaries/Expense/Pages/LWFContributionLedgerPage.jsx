import React, { useState, useMemo, useEffect } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import LWFLedgerHeader from '../Components/LWFHeaderLedger'
import LWFFilterBar from '../Components/LWFFilterBar'
import LWFLedgerTable from '../Components/LWFLedgerTable'
import LWFFooter from '../Components/LWFFooter'

const LWFContributionLedgerPage = () => {
  const [allTransactions, setAllTransactions] = useState([])
  const [ledgerDetails, setLedgerDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    voucherType: 'All',
    costCenter: 'All',
  })
  console.log('Correct Page is Loading')

  // Load real transactions from localStorage
  useEffect(() => {
    try {
      console.log('🔄 Loading Employer LWF Contribution ledger data...')
      const details = SalaryLedgerService.getLedgerDetails('X2001001004')
      setLedgerDetails(details)
      const transactions = SalaryLedgerService.getLedgerTransactions('X2001001004')
      setAllTransactions(transactions)
      console.log('✅ Loaded Employer LWF Contribution ledger:', {
        details,
        transactionCount: transactions.length,
      })
      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading LWF Contribution ledger:', error)
      setLoading(false)
    }
  }, [])

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      voucherType: 'All',
      costCenter: 'All',
    })
  }

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      // Date range filter
      if (filters.fromDate && transaction.date < filters.fromDate) return false
      if (filters.toDate && transaction.date > filters.toDate) return false

      // Voucher type filter
      if (filters.voucherType !== 'All' && transaction.voucherType !== filters.voucherType)
        return false

      // Cost center filter
      if (filters.costCenter !== 'All' && transaction.costCenter !== filters.costCenter)
        return false

      return true
    })
  }, [allTransactions, filters])

  // Calculate summary statistics
  const calculateSummary = useMemo(() => {
    const totalDebit = filteredTransactions.reduce((sum, t) => sum + (t.debit || 0), 0)
    const totalCredit = filteredTransactions.reduce((sum, t) => sum + (t.credit || 0), 0)

    return {
      closingBalance: ledgerDetails?.closingBalance || '₹0.00',
      totalDebit: `₹${totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      totalCredit: `₹${totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      transactionCount: filteredTransactions.length,
    }
  }, [filteredTransactions, ledgerDetails])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading LWF Contribution data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <LWFLedgerHeader accountInfo={ledgerDetails} />

        <LWFFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {filteredTransactions.length > 0 ? (
          <LWFLedgerTable transactions={filteredTransactions} />
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 text-blue-400">
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

        <LWFFooter {...calculateSummary} />
      </div>
    </div>
  )
}

export default LWFContributionLedgerPage
