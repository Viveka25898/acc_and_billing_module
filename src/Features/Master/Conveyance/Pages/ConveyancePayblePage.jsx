/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import LedgerHeader from '../Components/LedgerHeader'
import FilterSection from '../Components/FilterSection'
import TransactionTable from '../Components/TransactionTable'
import SummarySection from '../Components/SummerySection'
import { ConveyancePayableService } from '../../utils/conveyancePayableService'

const ConveyancePayblePage = () => {
  const { glCode: paramGlCode } = useParams()
  const glCode = paramGlCode || 'L2001001'

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    entryType: 'All',
    status: 'All',
    search: '',
  })

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [transactions, setTransactions] = useState([])
  const [employeeInfo, setEmployeeInfo] = useState(null)
  const [summaryData, setSummaryData] = useState({
    totalClaims: 0,
    totalPayments: 0,
    totalVisits: 0,
    outstanding: 0,
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  useEffect(() => {
    loadConveyanceLedgerData(1, filters)
  }, [glCode])

  const loadConveyanceLedgerData = async (targetPage = page, activeFilters = filters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = {
        page: targetPage,
        limit: 20,
        ...activeFilters,
      }

      // Fetch Header, Entries, and Footer in parallel
      const [headerRes, entriesRes, footerRes] = await Promise.all([
        ConveyancePayableService.getHeader(glCode),
        ConveyancePayableService.getEntries(glCode, queryParams),
        ConveyancePayableService.getFooter(glCode, activeFilters),
      ])

      // Format Header Data
      const openingBalanceVal = parseFloat(headerRes.openingBalance || 0)
      const formattedOpeningBalance =
        openingBalanceVal === 0
          ? '₹0.00 (No Outstanding)'
          : `₹${Math.abs(openingBalanceVal).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} ${openingBalanceVal > 0 ? 'CR' : 'DR'}`

      setEmployeeInfo({
        name: headerRes.name || 'Conveyance payable',
        code: headerRes.glCode || glCode,
        glAccount: headerRes.glCode || glCode,
        department: headerRes.department || 'Finance',
        designation: headerRes.designation || 'Shared Liability Account',
        accountType: headerRes.accountType || 'Liability',
        financialYear: headerRes.financialYear || 'FY2024-25',
        period:
          headerRes.period !== '-'
            ? headerRes.period
            : `Apr-${new Date().getFullYear()} to ${new Date().toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric',
              })}`,
        openingBalance: formattedOpeningBalance,
      })

      // Set Entries & Pagination
      setTransactions(entriesRes.entries || [])
      if (entriesRes.pagination) {
        setPagination(entriesRes.pagination)
      }

      // Set Footer Summary
      setSummaryData({
        totalClaims: footerRes.totalClaims || 0,
        totalPayments: footerRes.totalPayments || 0,
        totalVisits: footerRes.totalVisits || 0,
        outstanding: footerRes.outstanding || 0,
      })
    } catch (err) {
      console.error('❌ Error loading conveyance payable ledger data:', err)
      setError(err.message || 'Failed to load Conveyance Payable ledger data from server.')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
    loadConveyanceLedgerData(1, newFilters)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    loadConveyanceLedgerData(newPage, filters)
  }

  const handleRefresh = () => {
    loadConveyanceLedgerData(page, filters)
  }

  const handleExportPDF = () => {
    console.log('Exporting Conveyance Payable PDF...')
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading && !employeeInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Conveyance Payable Ledger...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-red-600 font-bold text-lg">⚠️</span>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Header Metadata */}
          {employeeInfo && <LedgerHeader employeeInfo={employeeInfo} />}

          {/* Filters Bar */}
          <FilterSection
            filters={filters}
            onFilterChange={handleFilterChange}
            onExportPDF={handleExportPDF}
            onPrint={handlePrint}
          />

          {/* Refresh & Pagination Toolbar */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
            <div>
              Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalItems} total transactions)
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              <span>🔄</span> Refresh
            </button>
          </div>

          {/* Transactions List / Spinner */}
          {loading ? (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-500 font-medium">Fetching transaction records...</p>
            </div>
          ) : (
            <>
              <TransactionTable transactions={transactions} />

              {/* Server-Side Pagination Bar */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-white">
                  <span className="text-xs sm:text-sm text-gray-500">
                    Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={!pagination.hasPreviousPage && pagination.page <= 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <button
                      disabled={!pagination.hasNextPage && pagination.page >= pagination.totalPages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer Summary Cards */}
          <SummarySection summaryData={summaryData} />
        </div>
      </div>
    </div>
  )
}

export default ConveyancePayblePage
