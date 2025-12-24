/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import LiabilityLedgerHeader from '../Component/LedgerHeader'
import LiabilityFilterBar from '../Component/FilterBar'
import LiabilityLedgerTable from '../Component/LedgerTable'
import LiabilityFooter from '../Component/Footer'

const EmployeePFPayableLedgerPage = () => {
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
        console.log('🔄 Loading EMPLOYEE PF PAYABLE ledger data...')

        const details = SalaryLedgerService.getLedgerDetails('L2002006')
        if (!details) {
          throw new Error('Failed to load ledger details')
        }
        setLedgerDetails(details)

        const transactions = SalaryLedgerService.getLedgerTransactions('L2002006')
        setAllTransactions(transactions || [])

        console.log('✅ Loaded EMPLOYEE PF PAYABLE ledger:', {
          details,
          transactionCount: transactions.length,
        })

        setLoading(false)
      } catch (error) {
        console.error('❌ Error loading EMPLOYEE PF PAYABLE ledger:', error)
        setError(error.message || 'Failed to load ledger data')
        setLoading(false)
      }
    }

    loadLedgerData()
  }, [])

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const filteredTransactions = useMemo(() => {
    try {
      return allTransactions.filter((transaction) => {
        if (transaction.entryType === 'opening') return true
        if (filters.department !== 'All' && transaction.department !== filters.department)
          return false
        if (filters.costCenter !== 'All' && transaction.costCenter !== filters.costCenter)
          return false
        if (filters.status !== 'All' && transaction.status !== filters.status) return false
        if (filters.paymentMethod !== 'All' && transaction.paymentMethod !== filters.paymentMethod)
          return false
        if (filters.batchSearch) {
          const searchLower = filters.batchSearch.toLowerCase()
          const matchesBatch = transaction.batchId?.toLowerCase().includes(searchLower)
          if (!matchesBatch) return false
        }
        if (filters.startDate) {
          try {
            const transactionDate = new Date(transaction.date.split('-').reverse().join('-'))
            const startDate = new Date(filters.startDate)
            if (transactionDate < startDate) return false
          } catch {}
        }
        if (filters.endDate) {
          try {
            const transactionDate = new Date(transaction.date.split('-').reverse().join('-'))
            const endDate = new Date(filters.endDate)
            if (transactionDate > endDate) return false
          } catch {}
        }
        return true
      })
    } catch (error) {
      console.error('❌ Error filtering transactions:', error)
      return allTransactions
    }
  }, [allTransactions, filters])

  const calculateSummary = useMemo(() => {
    try {
      const summary = SalaryLedgerService.getLedgerSummary(filteredTransactions, 'L2002006')
      return {
        totalPayable: summary.totalCredit,
        totalPending: summary.closingBalance,
        totalPaid: summary.totalDebit,
      }
    } catch (error) {
      console.error('❌ Error calculating summary:', error)
      return { totalPayable: '0.00', totalPending: '0.00 CR', totalPaid: '0.00' }
    }
  }, [filteredTransactions])

  const closingBalance = useMemo(() => {
    try {
      return filteredTransactions.length > 0
        ? filteredTransactions[filteredTransactions.length - 1].runningBalance
        : '0.00 CR'
    } catch {
      return '0.00 CR'
    }
  }, [filteredTransactions])

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

  const accountInfo = ledgerDetails || {
    glAccountCode: 'L2002006',
    accountName: 'EMPLOYEE PF PAYABLE',
    accountType: 'Current Liability',
    category: 'Employee Payables',
    financialYear: '2024-25',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee PF payable ledger...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 md:p-8 flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Ledger</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <LiabilityLedgerHeader accountInfo={accountInfo} />
        <LiabilityFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={departments}
          costCenters={costCenters}
          statusOptions={statusOptions}
          paymentMethods={paymentMethods}
        />
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Employee PF Payable Transactions ({filteredTransactions.length} records)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Liability account showing employee PF contributions owed (12% of Basic + DA)
            </p>
          </div>
          <div className="flex gap-2">
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
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
            >
              Clear All Filters
            </button>
            <button
              onClick={() =>
                SalaryLedgerService.exportLedgerToExcel('L2002006', filteredTransactions)
              }
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              Export to Excel
            </button>
          </div>
        </div>
        {filteredTransactions.length > 0 ? (
          <>
            <LiabilityLedgerTable transactions={filteredTransactions} />
            <LiabilityFooter
              closingBalance={closingBalance}
              totalTransactions={filteredTransactions.length}
              totalPayable={calculateSummary.totalPayable}
              totalPending={calculateSummary.totalPending}
              totalPaid={calculateSummary.totalPaid}
            />
          </>
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
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Transactions Found</h3>
            <p className="text-gray-500 mb-4">
              No employee PF payable transactions match your current filters.
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
      </div>
    </div>
  )
}

export default EmployeePFPayableLedgerPage
