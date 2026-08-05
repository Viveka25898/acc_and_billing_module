import React, { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import LedgerHeader from '../Components/LedgerHeader'
import LedgerTable from '../Components/LedgerTable'
import Summary from '../Components/Summary'
import FilterSection from '../Components/FilterSection'
import { RelieverLedgerService } from '../../utils/relieverLedgerService'

const RelieverLiabilityLedgerPage = () => {
  const accountCode = 'L2001002'
  const [searchParams, setSearchParams] = useSearchParams()

  // Derive parameters from the URL
  const page = parseInt(searchParams.get('page') || '1', 10)
  const fromDate = searchParams.get('fromDate') || ''
  const toDate = searchParams.get('toDate') || ''
  const entryType = searchParams.get('entryType') || 'All'
  const status = searchParams.get('status') || 'All'
  const site = searchParams.get('site') || 'All'
  const reliever = searchParams.get('reliever') || 'All'
  const searchText = searchParams.get('searchText') || ''

  // Sync derived filters to local state so the input controls match the URL
  const [filters, setFilters] = useState({
    fromDate,
    toDate,
    entryType,
    status,
    site,
    reliever,
    searchText,
  })

  // Sync state if URL changes externally (like back/forward browser buttons)
  useEffect(() => {
    setFilters({
      fromDate,
      toDate,
      entryType,
      status,
      site,
      reliever,
      searchText,
    })
  }, [fromDate, toDate, entryType, status, site, reliever, searchText])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [headerData, setHeaderData] = useState(null)
  const [ledgerEntries, setLedgerEntries] = useState([])
  const [summaryData, setSummaryData] = useState({
    openingBalance: 0,
    totalDebit: 0,
    totalCredit: 0,
    closingBalance: 0,
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  // Load data whenever URL parameters change!
  useEffect(() => {
    loadLedgerData()
  }, [page, fromDate, toDate, entryType, status])

  // Split reliever name from narration
  const getRelieverNameFromNarration = (narration) => {
    if (!narration) return '-'
    const parts = narration.split(' - ')
    if (parts.length >= 2) {
      return parts[1].trim()
    }
    return '-'
  }

  const loadLedgerData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log(`🔄 Fetching reliever liability ledger from API for ${accountCode}, page: ${page}`)

      // Prepare request parameters
      const entriesParams = {
        page,
        limit: 20,
      }
      const footerParams = {}

      if (fromDate) {
        entriesParams.fromDate = fromDate
        footerParams.fromDate = fromDate
      }
      if (toDate) {
        entriesParams.toDate = toDate
        footerParams.toDate = toDate
      }
      if (entryType && entryType !== 'All') {
        entriesParams.entryType = entryType
      }
      if (status && status !== 'All') {
        entriesParams.status = status
      }

      // 1. Fetch Header Details (Fallback to safe defaults on failure)
      let rawHeader = null
      try {
        rawHeader = await RelieverLedgerService.getLiabilityHeaderApi(accountCode)
      } catch (err) {
        console.warn('⚠️ Header API failed, using fallback mock metadata:', err)
        rawHeader = {
          glCode: accountCode,
          ledgerName: 'Employee reliever account',
          parentAccount: 'L2001',
          accountType: 'Liability',
          financialYear: 'FY2024-25',
          openingBalance: '0.00',
        }
      }

      // 2. Fetch Entries and Footer summaries in parallel
      const [entriesRes, footerRes] = await Promise.all([
        RelieverLedgerService.getLiabilityEntriesApi(accountCode, entriesParams),
        RelieverLedgerService.getLiabilityFooterApi(accountCode, footerParams),
      ])

      // 3. Compile transaction rows from API entries response
      const rawEntries = entriesRes?.entries || []
      const mappedEntries = rawEntries.map((entry) => {
        const debitAmount = entry.debit ? parseFloat(entry.debit) : null
        const creditAmount = entry.credit ? parseFloat(entry.credit) : null
        const balanceAmount = entry.balance ? parseFloat(entry.balance) : null

        return {
          id: entry.id,
          date: entry.date || '-',
          voucherNo: entry.voucherNo || '-',
          type: entry.entryType || 'Payment',
          debit: debitAmount,
          credit: creditAmount,
          balance: balanceAmount,
          narration: entry.narration || '-',
          relieverName: getRelieverNameFromNarration(entry.narration),
          replacedEmployee: entry.replacedEmployee || '-',
          site: entry.site || '-',
          customer: entry.customer || '-',
          state: entry.state || '-',
          days: entry.days || '-',
          ratePerDay: entry.ratePerDay ? parseFloat(entry.ratePerDay) : (creditAmount || debitAmount || null),
          approvedBy: entry.approvedBy || '-',
          rowType: 'normal',
        }
      })

      // Calculate dynamic metadata counts based on mapped list
      const uniqueSites = new Set(mappedEntries.map((e) => e.site).filter((s) => s && s !== '-'))
      const uniqueRelivers = new Set(mappedEntries.map((e) => e.relieverName).filter((r) => r && r !== '-'))

      const compiledHeader = {
        ledgerCode: rawHeader.glCode || accountCode,
        accountName: rawHeader.ledgerName || 'Employee reliever account',
        accountType: `${rawHeader.accountType || 'Liability'} Account (Balance Sheet)`,
        description: 'Liability Created for Reliever Wages',
        period: rawHeader.financialYear || '-',
        financialYear: rawHeader.financialYear || '-',
        openingBalance: parseFloat(rawHeader.openingBalance || 0),
        openingBalanceDate: '-',
        totalSites: uniqueSites.size > 0 ? uniqueSites.size : '-',
        totalRelievers: uniqueRelivers.size > 0 ? uniqueRelivers.size : '-',
        totalTransactions: entriesRes?.pagination?.totalItems || mappedEntries.length || '-',
        status: 'Active',
        currency: 'INR (₹)',
        costCenter: mappedEntries[0]?.costCenter || 'Operations - Staff Management',
      }

      // 4. Update Header state
      setHeaderData(compiledHeader)

      // 5. Update Entries state
      setLedgerEntries(mappedEntries)

      // 6. Update Summary details from footer API response
      if (footerRes) {
        setSummaryData({
          openingBalance: 0,
          totalDebit: parseFloat(footerRes.totalPayments || 0),
          totalCredit: parseFloat(footerRes.totalClaims || 0),
          closingBalance: parseFloat(footerRes.closingOutstandingLiability || 0),
        })
      }

      // 7. Update pagination state
      if (entriesRes?.pagination) {
        setPagination(entriesRes.pagination)
      }
    } catch (err) {
      console.error('❌ Error loading reliever liability ledger data:', err)
      setError(err.message || 'Failed to fetch ledger details.')
    } finally {
      setLoading(false)
    }
  }

  // Filter transactions in frontend dynamically based on search filters (as supplementary support)
  const filteredTransactions = useMemo(() => {
    let filtered = [...ledgerEntries]

    // Local filters for real-time responsiveness on the current page
    if (site && site !== 'All') {
      filtered = filtered.filter((e) => e.site?.toLowerCase().includes(site.toLowerCase()))
    }
    if (reliever && reliever !== 'All') {
      filtered = filtered.filter((e) => e.relieverName?.toLowerCase().includes(reliever.toLowerCase()))
    }
    if (searchText.trim()) {
      const search = searchText.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.relieverName?.toLowerCase().includes(search) ||
          e.narration?.toLowerCase().includes(search) ||
          e.voucherNo?.toLowerCase().includes(search) ||
          e.site?.toLowerCase().includes(search)
      )
    }

    return filtered
  }, [ledgerEntries, site, reliever, searchText])

  // Trigger search fetch on filter click
  const handleApplyFilter = () => {
    const newParams = {
      page: '1',
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      entryType: filters.entryType,
      status: filters.status,
      site: filters.site,
      reliever: filters.reliever,
      searchText: filters.searchText,
    }

    // Clean up empty params
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] === '' || newParams[key] === 'All' || newParams[key] === null) {
        delete newParams[key]
      }
    })

    setSearchParams(newParams)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      const currentParams = Object.fromEntries([...searchParams.entries()])
      setSearchParams({
        ...currentParams,
        page: newPage.toString(),
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading && !headerData) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading reliever liability ledger data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Ledger</h3>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <button
            onClick={() => loadLedgerData()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
          >
            Retry Fetching
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          {headerData && <LedgerHeader ledgerInfo={headerData} />}

          {/* Filter Section */}
          <FilterSection
            filters={filters}
            onFilterChange={setFilters}
            onApplyFilter={handleApplyFilter}
            onClear={() => setSearchParams({ page: '1' })}
            onPrint={handlePrint}
          />

          {/* Action Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b flex justify-between items-center text-xs md:text-sm">
            <div className="text-gray-600 font-medium">
              Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalItems || filteredTransactions.length} entries)
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-green-600 text-xs font-semibold">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                Refreshing...
              </div>
            )}
          </div>

          {/* Ledger Table with Filtered Data */}
          <div className="bg-white">
            <LedgerTable transactions={filteredTransactions} />
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-white">
              <span className="text-xs md:text-sm text-gray-500 font-medium">
                Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalItems} entries)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={!pagination.hasPreviousPage || loading}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Summary Section with CR balance type designation */}
          <Summary summary={summaryData} balanceType="CR" />
        </div>
      </div>
    </div>
  )
}

export default RelieverLiabilityLedgerPage
