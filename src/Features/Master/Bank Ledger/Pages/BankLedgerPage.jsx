import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import BankLedgerHeader from '../Components/BankLedgerHeader'
import FilterSection from '../Components/FilterSection'
import TransactionTable from '../Components/TransactionTable'
import SummarySection from '../Components/SummerySection'
import { BankLedgerService } from '../../utils/BankLedgerService'

const BankLedgerPage = () => {
  const { accountCode } = useParams()
  const [bankDetails, setBankDetails] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  const [page, setPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState({
    fromDate: '',
    toDate: '',
    transactionType: 'All Transactions',
  })

  const loadBankLedgerData = async (targetPage = page, currentFilters = activeFilters) => {
    try {
      setLoading(true)
      setError(null)
      console.log(`🏦 Fetching live bank ledger: ${accountCode}, page: ${targetPage}`)

      // Prepare filters
      const entriesParams = {
        page: targetPage,
        limit: 20,
      }
      const footerParams = {}

      if (currentFilters.fromDate) {
        entriesParams.fromDate = currentFilters.fromDate
        footerParams.fromDate = currentFilters.fromDate
      }
      if (currentFilters.toDate) {
        entriesParams.toDate = currentFilters.toDate
        footerParams.toDate = currentFilters.toDate
      }

      if (currentFilters.transactionType === 'Receipts Only') {
        entriesParams.entryType = 'RECEIPT'
      } else if (currentFilters.transactionType === 'Payments Only') {
        entriesParams.entryType = 'PAYMENT'
      }

      // Parallel API calls
      const [details, entriesRes, summaryData] = await Promise.all([
        BankLedgerService.getBankAccountDetails(accountCode),
        BankLedgerService.getBankTransactions(accountCode, entriesParams),
        BankLedgerService.getBankSummary(accountCode, footerParams)
      ])

      setBankDetails(details)
      setTransactions(entriesRes?.entries || [])
      setSummary(summaryData)
      
      if (entriesRes?.pagination) {
        setPagination(entriesRes.pagination)
      }
    } catch (err) {
      console.error('❌ Error fetching bank ledger data:', err)
      setError(err.message || 'Failed to load ledger data.')
    } finally {
      setLoading(false)
    }
  }

  // Load on initial render and route change
  useEffect(() => {
    setPage(1)
    const initialFilters = {
      fromDate: '',
      toDate: '',
      transactionType: 'All Transactions',
    }
    setActiveFilters(initialFilters)
    loadBankLedgerData(1, initialFilters)
  }, [accountCode])

  const handleApplyFilters = (newFilters) => {
    setActiveFilters(newFilters)
    setPage(1)
    loadBankLedgerData(1, newFilters)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    loadBankLedgerData(newPage, activeFilters)
  }

  if (loading && !bankDetails) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bank ledger...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <BankLedgerHeader bankDetails={bankDetails} />
          
          <FilterSection onApply={handleApplyFilters} />
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-200">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <span>Refreshing transaction list...</span>
            </div>
          ) : (
            <>
              <TransactionTable transactions={transactions} />
              
              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-white">
                  <span className="text-sm text-slate-500">
                    Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalItems} entries)
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={!pagination.hasPreviousPage}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      disabled={!pagination.hasNextPage}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <SummarySection summary={summary} />
        </div>
      </div>
    </div>
  )
}

export default BankLedgerPage
