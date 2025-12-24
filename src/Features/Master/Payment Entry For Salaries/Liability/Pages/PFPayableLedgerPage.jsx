/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import LiabilityLedgerHeader from '../Component/LedgerHeader'
import LiabilityFilterBar from '../Component/FilterBar'
import LiabilityLedgerTable from '../Component/LedgerTable'
import LiabilityFooter from '../Component/Footer'

const PFPayableLedgerPage = () => {
  const [allTransactions, setAllTransactions] = useState([])
  const [ledgerDetails, setLedgerDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    department: 'All',
    costCenter: 'All',
    status: 'All',
    paymentMethod: 'All',
    batchSearch: '',
    startDate: '',
    endDate: '',
  })

  // Load real transactions from localStorage
  useEffect(() => {
    const loadLedgerData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('🔄 Loading Employer PF Payable ledger data...')
        const details = SalaryLedgerService.getLedgerDetails('L2002002')
        setLedgerDetails(details)
        const transactions = SalaryLedgerService.getLedgerTransactions('L2002002')
        setAllTransactions(transactions)
        console.log('✅ Loaded Employer PF Payable ledger:', {
          details,
          transactionCount: transactions.length,
        })
        setLoading(false)
      } catch (error) {
        console.error('❌ Error loading Employer PF Payable ledger:', error)
        setError('Failed to load ledger data. Please try again.')
        setLoading(false)
      }
    }
    loadLedgerData()
  }, [])

  // Apply filters to transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      if (filters.department !== 'All' && transaction.department !== filters.department)
        return false
      if (filters.costCenter !== 'All' && transaction.costCenter !== filters.costCenter)
        return false
      if (filters.status !== 'All' && transaction.status !== filters.status) return false
      if (filters.paymentMethod !== 'All' && transaction.paymentMethod !== filters.paymentMethod)
        return false
      if (
        filters.batchSearch &&
        !transaction.batchId?.toLowerCase().includes(filters.batchSearch.toLowerCase())
      )
        return false
      if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate))
        return false
      if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) return false
      return true
    })
  }, [allTransactions, filters])

  // Calculate summary
  const calculateSummary = useMemo(() => {
    return SalaryLedgerService.getLedgerSummary(filteredTransactions, 'L2002002')
  }, [filteredTransactions])

  const closingBalance = useMemo(() => {
    if (filteredTransactions.length === 0) return calculateSummary.openingBalance
    return filteredTransactions[filteredTransactions.length - 1].runningBalance
  }, [filteredTransactions, calculateSummary])

  const departments = useMemo(() => {
    const depts = [...new Set(allTransactions.map((t) => t.department).filter(Boolean))]
    return ['All', ...depts]
  }, [allTransactions])

  const costCenters = useMemo(() => {
    const centers = [...new Set(allTransactions.map((t) => t.costCenter).filter(Boolean))]
    return ['All', ...centers]
  }, [allTransactions])

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(allTransactions.map((t) => t.status).filter(Boolean))]
    return ['All', ...statuses]
  }, [allTransactions])

  const paymentMethods = useMemo(() => {
    const methods = [...new Set(allTransactions.map((t) => t.paymentMethod).filter(Boolean))]
    return ['All', ...methods]
  }, [allTransactions])

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const handleExportToExcel = () => {
    SalaryLedgerService.exportLedgerToExcel('L2002002', filteredTransactions)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Employer PF Payable ledger...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <LiabilityLedgerHeader
        accountInfo={ledgerDetails}
        openingBalance={calculateSummary.openingBalance}
        closingBalance={closingBalance}
        totalDebit={calculateSummary.totalDebit}
        totalCredit={calculateSummary.totalCredit}
      />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <LiabilityFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={departments}
          costCenters={costCenters}
          statusOptions={statusOptions}
          paymentMethods={paymentMethods}
        />
        {filteredTransactions.length > 0 ? (
          <LiabilityLedgerTable
            transactions={filteredTransactions}
            onExportToExcel={handleExportToExcel}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border-t-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Transactions Found</h3>
            <p className="text-gray-500 mb-4">
              No employer PF payable transactions match your current filters.
            </p>
            <button
              onClick={() =>
                setFilters({
                  department: 'All',
                  costCenter: 'All',
                  status: 'All',
                  paymentMethod: 'All',
                  batchSearch: '',
                  startDate: '',
                  endDate: '',
                })
              }
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        <LiabilityFooter
          closingBalance={closingBalance}
          totalTransactions={filteredTransactions.length}
          totalPayable={calculateSummary.totalCredit}
          totalPending={closingBalance}
          totalPaid={calculateSummary.totalDebit}
        />
      </div>
    </div>
  )
}

export default PFPayableLedgerPage
