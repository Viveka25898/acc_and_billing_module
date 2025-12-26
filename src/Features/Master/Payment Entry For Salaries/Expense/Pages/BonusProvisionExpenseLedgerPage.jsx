import React, { useState, useEffect, useMemo } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import BonusProvisionHeader from '../Components/BonusProvisionHeader'
import BonusFilter from '../Components/BonusFilter'
import BonusTable from '../Components/BonusTable'
import BonusFooter from '../Components/BonusFooter'

const BonusProvisionExpenseLedgerPage = () => {
  const [allTransactions, setAllTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    voucherType: 'All',
    costCenter: 'All',
  })

  // Load real transactions from localStorage
  useEffect(() => {
    try {
      console.log('🔄 Loading Bonus Provision Expense ledger data...')
      const details = SalaryLedgerService.getLedgerDetails('X2001001007')
      const transactions = SalaryLedgerService.getLedgerTransactions('X2001001007')
      setAllTransactions(transactions)
      console.log('✅ Loaded Bonus Provision Expense ledger:', {
        details,
        transactionCount: transactions.length,
      })
      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading Bonus Provision Expense ledger:', error)
      setLoading(false)
    }
  }, [])

  // Filter transactions based on filter criteria
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions]

    // Filter by date range
    if (filters.fromDate) {
      filtered = filtered.filter((txn) => {
        const txnDate = new Date(txn.date)
        const fromDate = new Date(filters.fromDate)
        return txnDate >= fromDate
      })
    }
    if (filters.toDate) {
      filtered = filtered.filter((txn) => {
        const txnDate = new Date(txn.date)
        const toDate = new Date(filters.toDate)
        return txnDate <= toDate
      })
    }

    // Filter by voucher type
    if (filters.voucherType && filters.voucherType !== 'All') {
      filtered = filtered.filter((txn) => txn.voucherType === filters.voucherType)
    }

    // Filter by cost center
    if (filters.costCenter && filters.costCenter !== 'All') {
      filtered = filtered.filter((txn) => txn.costCenter === filters.costCenter)
    }

    return filtered
  }, [allTransactions, filters])

  // Calculate summary data
  const summaryData = useMemo(() => {
    if (!filteredTransactions.length) {
      return {
        closingBalance: 0,
        totalDebit: 0,
        totalCredit: 0,
        transactions: 0,
      }
    }

    const totalDebit = filteredTransactions.reduce(
      (sum, entry) => sum + (parseFloat(entry.debit) || 0),
      0
    )
    const totalCredit = filteredTransactions.reduce(
      (sum, entry) => sum + (parseFloat(entry.credit) || 0),
      0
    )
    const lastEntry = filteredTransactions[filteredTransactions.length - 1]
    const closingBalance = parseFloat(lastEntry?.balance) || 0

    return {
      closingBalance,
      totalDebit,
      totalCredit,
      transactions: filteredTransactions.length,
    }
  }, [filteredTransactions])

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      voucherType: 'All',
      costCenter: 'All',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Bonus Provision Expense Ledger...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BonusProvisionHeader />
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <BonusFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        <BonusTable ledgerData={filteredTransactions} />
        <BonusFooter summaryData={summaryData} />
      </div>
    </div>
  )
}

export default BonusProvisionExpenseLedgerPage
