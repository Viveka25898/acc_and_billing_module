import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HKMaterialsExpenseLedgerService } from '../utils/hkMaterialExpenseLedgerService'
import { FaFilter, FaTimes } from 'react-icons/fa'

const HKMaterialsExpenseLedgerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Derived filter and pagination states directly from URL search parameters
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 20

  const appliedFilters = useMemo(() => ({
    fromDate: searchParams.get('fromDate') || '',
    toDate: searchParams.get('toDate') || '',
    entryType: searchParams.get('entryType') || '',
    vendorName: searchParams.get('vendorName') || '',
  }), [searchParams])

  // Local buffered filters state for UI inputs
  const [localFilters, setLocalFilters] = useState({
    fromDate: appliedFilters.fromDate,
    toDate: appliedFilters.toDate,
    entryType: appliedFilters.entryType,
    vendorName: appliedFilters.vendorName,
  })

  // Keep local input values in sync with URL parameter updates (e.g. on clear)
  useEffect(() => {
    setLocalFilters({
      fromDate: appliedFilters.fromDate,
      toDate: appliedFilters.toDate,
      entryType: appliedFilters.entryType,
      vendorName: appliedFilters.vendorName,
    })
  }, [appliedFilters])

  const loadLedgerData = async (filtersObj, pageNum, limitNum) => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔍 Loading HK Materials Expense ledger from APIs with filters:', filtersObj, 'page:', pageNum, 'limit:', limitNum)
      const data = await HKMaterialsExpenseLedgerService.getHKMaterialsExpenseLedger({
        ...filtersObj,
        page: pageNum,
        limit: limitNum
      })
      setLedgerData(data)
    } catch (err) {
      console.error('❌ Error loading expense ledger:', err)
      setError(err.message || 'Failed to fetch HK Materials Expense Ledger. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Reload data whenever search query variables change reactively
  useEffect(() => {
    loadLedgerData(appliedFilters, page, limit)
  }, [appliedFilters, page, limit])

  const handleApplyFilters = () => {
    const params = {
      page: '1', // Reset to first page
      limit: String(limit),
    }
    if (localFilters.fromDate) params.fromDate = localFilters.fromDate
    if (localFilters.toDate) params.toDate = localFilters.toDate
    if (localFilters.entryType) params.entryType = localFilters.entryType
    if (localFilters.vendorName) params.vendorName = localFilters.vendorName

    setSearchParams(params)
  }

  const handleClearFilters = () => {
    setSearchParams({
      page: '1',
      limit: String(limit),
    })
  }

  // Compute filtered entries list (retrieved directly from live API results)
  const filteredEntries = useMemo(() => {
    return ledgerData?.entries || []
  }, [ledgerData])

  // Compute totals (retrieved directly from live API results)
  const totals = useMemo(() => {
    return ledgerData?.totals || {
      totalDebit: '0.00',
      totalCredit: '0.00',
      closingBalance: '0.00 DR',
    }
  }, [ledgerData])

  // Extract pagination info
  const pagination = useMemo(() => {
    return ledgerData?.pagination || {
      page: 1,
      limit: 20,
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    }
  }, [ledgerData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading HK Materials Expense ledger...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Ledger</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => loadLedgerData(appliedFilters, page, limit)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition"
          >
            Retry Fetching
          </button>
        </div>
      </div>
    )
  }

  const { accountDetails } = ledgerData

  // Calculations for pagination text
  const startItem = pagination.totalItems === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const endItem = Math.min(pagination.page * pagination.limit, pagination.totalItems)

  return (
    <div className="min-h-screen bg-gray-50 px-3 md:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section in Premium Green/White Style */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm mb-6 overflow-hidden">
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-3">HK Materials Expense Ledger</h1>
                {/* Displaying ALL keys/values from header response */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-2 text-xs">
                  <div>
                    <span className="opacity-80">GL Code:</span>
                    <span className="ml-2 font-semibold">{accountDetails.accountCode || '-'}</span>
                  </div>
                  <div>
                    <span className="opacity-80">Account Name:</span>
                    <span className="ml-2 font-semibold">{accountDetails.accountName || '-'}</span>
                  </div>
                  <div>
                    <span className="opacity-80">Account Type:</span>
                    <span className="ml-2 font-semibold">{accountDetails.accountType || '-'}</span>
                  </div>
                  <div>
                    <span className="opacity-80">Category:</span>
                    <span className="ml-2 font-semibold">{accountDetails.category || '-'}</span>
                  </div>
                  <div>
                    <span className="opacity-80">Parent Account:</span>
                    <span className="ml-2 font-semibold">{accountDetails.parentAccount || '-'}</span>
                  </div>
                </div>
              </div>
              <div className="md:text-right bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-2xl lg:text-3xl font-bold">
                  ₹{accountDetails.balanceAmount?.toLocaleString('en-IN') || '0.00'}
                </div>
                <div className="text-xs opacity-90 mt-0.5">
                  Current Balance ({accountDetails.balanceType || 'DR'})
                </div>
              </div>
            </div>
          </div>

          {/* Header Summary Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-green-50/30">
            <div className="bg-white p-4 rounded-xl border border-green-100/50 shadow-sm">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Expenses</div>
              <div className="text-lg md:text-xl font-black text-green-600">
                {accountDetails.summary?.totalExpenses || '-'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-green-100/50 shadow-sm">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Reversals</div>
              <div className="text-lg md:text-xl font-black text-red-500">
                {accountDetails.summary?.totalReversals || '-'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-green-100/50 shadow-sm">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Net Expense</div>
              <div className="text-lg md:text-xl font-black text-green-700">
                {accountDetails.summary?.netExpense || '-'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-green-100/50 shadow-sm">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Transactions</div>
              <div className="text-lg md:text-xl font-black text-purple-600">
                {accountDetails.summary?.transactionCount || '0'}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm mb-6 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Filters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* From Date */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">From Date</label>
              <input
                type="date"
                value={localFilters.fromDate}
                onChange={(e) => setLocalFilters({ ...localFilters, fromDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50"
              />
            </div>
            {/* To Date */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">To Date</label>
              <input
                type="date"
                value={localFilters.toDate}
                onChange={(e) => setLocalFilters({ ...localFilters, toDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50"
              />
            </div>
            {/* Entry Type */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Entry Type</label>
              <select
                value={localFilters.entryType}
                onChange={(e) => setLocalFilters({ ...localFilters, entryType: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50 cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="Expense">Expense</option>
                <option value="Reversal">Reversal</option>
                <option value="Journal">Journal</option>
              </select>
            </div>
            {/* Vendor Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Vendor Name</label>
              <input
                type="text"
                value={localFilters.vendorName}
                onChange={(e) => setLocalFilters({ ...localFilters, vendorName: e.target.value })}
                placeholder="Search vendor..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleApplyFilters}
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow transition duration-150"
            >
              <FaFilter className="w-3.5 h-3.5" /> Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-205 text-gray-700 font-semibold text-xs px-4 py-2 rounded-lg border border-gray-250 transition duration-150"
            >
              <FaTimes className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-green-600 text-white text-left font-semibold">
                <tr>
                  <th className="px-3 py-3 whitespace-nowrap">Date</th>
                  <th className="px-3 py-3 whitespace-nowrap">Voucher No</th>
                  <th className="px-3 py-3 text-center">Type</th>
                  <th className="px-3 py-3">Particulars</th>
                  <th className="px-3 py-3">Vendor</th>
                  <th className="px-3 py-3">Invoice No</th>
                  <th className="px-3 py-3 text-right">Debit (₹)</th>
                  <th className="px-3 py-3 text-right">Credit (₹)</th>
                  <th className="px-3 py-3 text-right">Balance (₹)</th>
                  <th className="px-3 py-3">Cost Center</th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Site</th>
                  <th className="px-3 py-3">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-green-50/20 transition duration-75">
                      <td className="px-3 py-3 text-gray-900 whitespace-nowrap">{entry.date || '-'}</td>
                      <td className="px-3 py-3 text-blue-600 font-semibold font-mono whitespace-nowrap">
                        {entry.voucherNo || '-'}
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${
                            entry.entryType === 'Expense'
                              ? 'bg-blue-100 text-blue-800'
                              : entry.entryType === 'Reversal'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {entry.entryType || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-900 min-w-[200px]">{entry.particulars || '-'}</td>
                      <td className="px-3 py-3 text-gray-700 min-w-[120px]">{entry.vendorName || '-'}</td>
                      <td className="px-3 py-3 text-gray-600 font-mono text-xs max-w-[120px] truncate">{entry.invoiceNumber || '-'}</td>
                      <td className="px-3 py-3 text-right font-bold text-green-700 whitespace-nowrap">
                        {entry.debit !== '-' ? `₹${entry.debit}` : '-'}
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-red-600 whitespace-nowrap">
                        {entry.credit !== '-' ? `₹${entry.credit}` : '-'}
                      </td>
                      <td className="px-3 py-3 text-right font-black text-gray-900 whitespace-nowrap">
                        ₹{entry.balance || '0.00 DR'}
                      </td>
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{entry.costCenter || '-'}</td>
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{entry.customer || '-'}</td>
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{entry.site || '-'}</td>
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{entry.state || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="px-3 py-12 text-center text-gray-400 italic">
                      No transaction entries found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredEntries.length > 0 && (
                <tfoot className="bg-green-50 font-bold border-t border-green-100 text-gray-900">
                  <tr>
                    <td colSpan="6" className="px-3 py-3.5 text-right text-gray-700 uppercase tracking-wider">
                      Total:
                    </td>
                    <td className="px-3 py-3.5 text-right text-green-700 whitespace-nowrap">
                      ₹{totals.totalDebit}
                    </td>
                    <td className="px-3 py-3.5 text-right text-red-600 whitespace-nowrap">
                      ₹{totals.totalCredit}
                    </td>
                    <td className="px-3 py-3.5 text-right text-green-800 whitespace-nowrap">
                      ₹{totals.closingBalance}
                    </td>
                    <td colSpan="4" className="px-3 py-3.5"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Interactive Pagination Controls block */}
          {pagination.totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">Show</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev)
                      next.set('limit', e.target.value)
                      next.set('page', '1') // Reset page index
                      return next
                    })
                  }}
                  className="border border-gray-250 bg-white rounded-lg text-xs font-semibold px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
                >
                  <option value={10}>10 entries</option>
                  <option value={20}>20 entries</option>
                  <option value={50}>50 entries</option>
                  <option value={100}>100 entries</option>
                </select>
                <span className="text-xs text-gray-500 font-semibold">
                  Showing {startItem} to {endItem} of {pagination.totalItems} entries
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setSearchParams((prev) => {
                    const next = new URLSearchParams(prev)
                    next.set('page', String(Math.max(page - 1, 1)))
                    return next
                  })}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                    pagination.hasPreviousPage
                      ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-250 shadow-sm cursor-pointer'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <span className="text-xs text-gray-600 font-bold px-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setSearchParams((prev) => {
                    const next = new URLSearchParams(prev)
                    next.set('page', String(Math.min(page + 1, pagination.totalPages)))
                    return next
                  })}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                    pagination.hasNextPage
                      ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-250 shadow-sm cursor-pointer'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>
            Showing {filteredEntries.length} of {pagination.totalItems} transaction entries
          </p>
          <p>Generated on {new Date().toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  )
}

export default HKMaterialsExpenseLedgerPage
