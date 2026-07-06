import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EmployeeHeader from '../Components/EmployeeHeader'
import FilterSection from '../Components/FilterSection'
import LedgerTable from '../Components/LedgerTable'
import FooterSummary from '../Components/FooterSummary'
import { EmployeeLedgerService } from '../../utils/employeeLedgerService'

const EmployeeLedgerPage = () => {
  const { accountCode } = useParams()
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    entryType: '',
    status: '',
  })

  const [accountData, setAccountData] = useState(null)
  const [ledgerEntries, setLedgerEntries] = useState([])
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

  const loadLedgerData = async (targetPage = page, activeFilters = filters) => {
    try {
      setLoading(true)
      setError(null)

      console.log(`🔄 Loading backend ledger for account: ${accountCode}, page: ${targetPage}`)

      // Prepare entries parameters
      const entriesParams = {
        page: targetPage,
        limit: 20,
      }
      const footerParams = {}

      if (activeFilters.fromDate) {
        entriesParams.fromDate = activeFilters.fromDate
        footerParams.fromDate = activeFilters.fromDate
      }
      if (activeFilters.toDate) {
        entriesParams.toDate = activeFilters.toDate
        footerParams.toDate = activeFilters.toDate
      }
      if (activeFilters.entryType) {
        entriesParams.entryType = activeFilters.entryType.toUpperCase()
      }
      if (activeFilters.status) {
        entriesParams.status = activeFilters.status.toUpperCase()
      }


      // 1. Fetch Header (Catch 500 error gracefully and fallback to dashes)
      let headerData = null
      try {
        headerData = await EmployeeLedgerService.getEmployeeHeader(accountCode)
      } catch (headerErr) {
        console.warn('⚠️ Header API failed (expected 500), using fallback empty values:', headerErr)
        headerData = {
          employeeId: '-',
          employeeName: '-',
          department: '-',
          reportingManager: '-',
          glAccountCode: accountCode,
          accountName: '-',
          financialYear: '-',
          period: '-',
          openingBalance: {
            amount: 0,
            date: '-',
            type: 'DR'
          }
        }
      }
      setAccountData(headerData)

      // 2. Fetch Entries and Footer in parallel
      const [entriesRes, summaryRes] = await Promise.all([
        EmployeeLedgerService.getEmployeeEntries(accountCode, entriesParams),
        EmployeeLedgerService.getEmployeeSummary(accountCode, footerParams)
      ])

      setLedgerEntries(entriesRes?.entries || [])
      setSummary(summaryRes)
      
      if (entriesRes?.pagination) {
        setPagination(entriesRes.pagination)
      }
    } catch (err) {
      console.error('❌ Error loading ledger data:', err)
      setError(err.message || 'Failed to load ledger data')
    } finally {
      setLoading(false)
    }
  }

  // Reload when the accountCode changes
  useEffect(() => {
    setPage(1)
    const resetFilters = {
      fromDate: '',
      toDate: '',
      entryType: '',
      status: '',
    }
    setFilters(resetFilters)
    loadLedgerData(1, resetFilters)
  }, [accountCode])

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
    loadLedgerData(1, newFilters)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    loadLedgerData(newPage, filters)
  }

  const handleRefresh = () => {
    loadLedgerData(page, filters)
  }

  if (loading && !accountData) {
    return (
      <div className="w-full min-h-screen bg-gray-100 p-2 md:p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ledger data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-2 md:p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <EmployeeHeader data={accountData} />
        
        <FilterSection filters={filters} setFilters={setFilters} onApply={handleApplyFilters} />

        <div className="px-3 md:px-5 py-2 bg-gray-50 border-b flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalItems} entries)
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-200">
            ⚠️ {error}
          </div>
        )}

        <div className="p-3 md:p-5 bg-white">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <span>Refreshing transaction list...</span>
            </div>
          ) : ledgerEntries.length > 0 ? (
            <>
              <LedgerTable entries={ledgerEntries} />
              
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
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg font-medium">No transactions found for this account</p>
              <p className="text-sm mt-2">
                Transactions will appear here when advances or settlements are posted.
              </p>
            </div>
          )}
        </div>

        {summary && <FooterSummary summary={summary} />}
      </div>
    </div>
  )
}

export default EmployeeLedgerPage
