import React, { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import LedgerHeader from '../Components/LedgerHeader'
import LedgerTable from '../Components/LedgerTable'
import Summary from '../Components/Summary'
import FilterSection from '../Components/FilterSection'
import { RelieverLedgerService } from '../../utils/relieverLedgerService'

const RelieverPaymentPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const accountCode = searchParams.get('accountCode') || 'X1001001003'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const fromDate = searchParams.get('fromDate') || ''
  const toDate = searchParams.get('toDate') || ''
  const entryType = searchParams.get('entryType') || 'All'
  const status = searchParams.get('status') || 'All'
  const site = searchParams.get('site') || 'All'
  const reliever = searchParams.get('reliever') || 'All'
  const searchText = searchParams.get('searchText') || ''

  // Sync derived filters to local state so inputs reflect URL
  const [filters, setFilters] = useState({
    fromDate,
    toDate,
    entryType,
    status,
    site,
    reliever,
    searchText,
  })

  // Sync state if URL changes externally (browser back/forward)
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

  // Load ledger data whenever relevant parameters change
  useEffect(() => {
    loadLedgerData()
  }, [accountCode, page, fromDate, toDate, entryType, status])

  // Extract reliever name from narration if formatted with " - "
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

      console.log(`≡ƒöä Fetching reliever payment ledger from API for ${accountCode}, page: ${page}`)

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

      // 1. Fetch Header Details (with fallback to default reliever metadata)
      let rawHeader = null
      try {
        rawHeader = await RelieverLedgerService.getPaymentHeaderApi(accountCode)
      } catch (err) {
        console.warn('⚠️ Header API failed, using fallback metadata:', err)
        rawHeader = RelieverLedgerService.getRelieverAccountDetails(accountCode)
      }

      // 2. Fetch Entries and Footer summaries in parallel (with fallback to local storage entries)
      let entriesRes = null
      let footerRes = null
      try {
        const [eRes, fRes] = await Promise.all([
          RelieverLedgerService.getPaymentEntriesApi(accountCode, entriesParams),
          RelieverLedgerService.getPaymentFooterApi(accountCode, footerParams),
        ])
        entriesRes = eRes
        footerRes = fRes
      } catch (err) {
        console.warn('⚠️ Entries/Footer API failed, using fallback local entries:', err)
        const localEntries = RelieverLedgerService.getRelieverLedgerEntries(accountCode)
        const localSummary = RelieverLedgerService.getSummaryData(localEntries)
        entriesRes = {
          entries: localEntries,
          pagination: {
            page: 1,
            totalPages: 1,
            totalItems: localEntries.length,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }
        footerRes = {
          totalDebit: localSummary.totalDebit,
          totalCredit: localSummary.totalCredit,
          closingBalance: localSummary.closingBalance,
        }
      }

      // 3. Compile transaction rows from entries response
      const rawEntries = entriesRes?.entries || []
      const mappedEntries = rawEntries.map((entry, idx) => {
        const debitAmount =
          entry.debit !== undefined && entry.debit !== null && entry.debit !== '-'
            ? parseFloat(entry.debit)
            : null
        const creditAmount =
          entry.credit !== undefined && entry.credit !== null && entry.credit !== '-'
            ? parseFloat(entry.credit)
            : null
        const balanceAmount =
          entry.balance !== undefined && entry.balance !== null && entry.balance !== '-'
            ? parseFloat(entry.balance)
            : null

        return {
          id: entry.id || entry.transactionId || idx + 1,
          date: entry.date || '-',
          voucherNo: entry.voucherNo || '-',
          type: entry.entryType || entry.type || (debitAmount ? 'Payment' : 'Receipt'),
          debit: debitAmount,
          credit: creditAmount,
          balance: balanceAmount,
          narration: entry.narration || '-',
          relieverName: entry.relieverName || getRelieverNameFromNarration(entry.narration),
          replacedEmployee: entry.replacedEmployee || entry.employeeName || '-',
          site: entry.site || '-',
          customer: entry.customer || entry.clientName || '-',
          state: entry.state || '-',
          days: entry.days || 1,
          ratePerDay: entry.ratePerDay
            ? parseFloat(entry.ratePerDay)
            : debitAmount || creditAmount || null,
          approvedBy: entry.approvedBy || '-',
          rowType: entry.rowType || 'normal',
        }
      })

      // Calculate dynamic counts
      const uniqueSites = new Set(mappedEntries.map((e) => e.site).filter((s) => s && s !== '-'))
      const uniqueRelievers = new Set(
        mappedEntries.map((e) => e.relieverName).filter((r) => r && r !== '-')
      )

      const compiledHeader = {
        ledgerCode:
          rawHeader?.glCode ||
          rawHeader?.ledgerCode ||
          rawHeader?.expenseHeadCode ||
          accountCode,
        accountName:
          rawHeader?.ledgerName ||
          rawHeader?.accountName ||
          rawHeader?.expenseHeadName ||
          'RELIEVER PAYMENTS',
        accountType: rawHeader?.accountType
          ? rawHeader.accountType.includes('Account')
            ? rawHeader.accountType
            : `${rawHeader.accountType} Account (Profit & Loss)`
          : 'Expense Account (Profit & Loss)',
        description: rawHeader?.description || 'Temporary Staff Replacement Payments',
        period:
          rawHeader?.period ||
          rawHeader?.financialYear ||
          RelieverLedgerService.getCurrentFinancialPeriod(),
        financialYear:
          rawHeader?.financialYear || RelieverLedgerService.getCurrentFinancialYear(),
        openingBalance:
          typeof rawHeader?.openingBalance === 'number'
            ? rawHeader.openingBalance
            : parseFloat(rawHeader?.openingBalance || 0),
        openingBalanceDate:
          rawHeader?.openingBalanceDate || RelieverLedgerService.getOpeningBalanceDate(),
        totalSites: uniqueSites.size > 0 ? uniqueSites.size : rawHeader?.totalSites || 8,
        totalRelievers:
          uniqueRelievers.size > 0 ? uniqueRelievers.size : rawHeader?.totalRelievers || 15,
        totalTransactions: entriesRes?.pagination?.totalItems || mappedEntries.length,
        status: rawHeader?.status || 'Active',
        currency: rawHeader?.currency || 'INR (₹)',
        costCenter: rawHeader?.costCenter || 'Operations - Staff Management',
        budgetAllocated: rawHeader?.budgetAllocated || '₹200,000.00',
        budgetUtilized: rawHeader?.budgetUtilized || '62.5%',
      }

      setHeaderData(compiledHeader)
      setLedgerEntries(mappedEntries)

      if (footerRes) {
        setSummaryData({
          openingBalance: parseFloat(compiledHeader.openingBalance || 0),
          totalDebit: parseFloat(footerRes.totalDebit || footerRes.totalPayments || 0),
          totalCredit: parseFloat(footerRes.totalCredit || footerRes.totalClaims || 0),
          closingBalance: parseFloat(
            footerRes.closingBalance || footerRes.closingOutstandingLiability || 0
          ),
        })
      } else {
        const computed = RelieverLedgerService.getSummaryData(mappedEntries)
        setSummaryData(computed)
      }

      if (entriesRes?.pagination) {
        setPagination({
          page: entriesRes.pagination.currentPage || entriesRes.pagination.page || page,
          limit: entriesRes.pagination.limit || entriesRes.pagination.recordsPerPage || 20,
          totalItems:
            entriesRes.pagination.totalItems ||
            entriesRes.pagination.totalRecords ||
            mappedEntries.length,
          totalPages: entriesRes.pagination.totalPages || 1,
          hasNextPage:
            entriesRes.pagination.hasNextPage ??
            page < (entriesRes.pagination.totalPages || 1),
          hasPreviousPage: entriesRes.pagination.hasPreviousPage ?? page > 1,
        })
      }
    } catch (err) {
      console.error('❌ Error loading reliever payment ledger data:', err)
      setError(err.message || 'Failed to fetch reliever payment ledger details.')
    } finally {
      setLoading(false)
    }
  }

  // Frontend filter refinement for instant responsiveness
  const filteredTransactions = useMemo(() => {
    let filtered = [...ledgerEntries]

    if (site && site !== 'All') {
      filtered = filtered.filter((e) => e.site?.toLowerCase().includes(site.toLowerCase()))
    }
    if (reliever && reliever !== 'All') {
      filtered = filtered.filter((e) =>
        e.relieverName?.toLowerCase().includes(reliever.toLowerCase())
      )
    }
    if (searchText.trim()) {
      const search = searchText.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.relieverName?.toLowerCase().includes(search) ||
          e.narration?.toLowerCase().includes(search) ||
          e.voucherNo?.toLowerCase().includes(search) ||
          e.site?.toLowerCase().includes(search) ||
          e.customer?.toLowerCase().includes(search)
      )
    }

    return filtered
  }, [ledgerEntries, site, reliever, searchText])

  // Dynamic summary based on filtered transactions
  const filteredSummary = useMemo(() => {
    if (filteredTransactions.length === ledgerEntries.length) {
      return summaryData
    }
    const computed = RelieverLedgerService.getSummaryData(filteredTransactions)
    return {
      ...computed,
      openingBalance: summaryData.openingBalance,
    }
  }, [filteredTransactions, ledgerEntries, summaryData])

  const handleApplyFilter = () => {
    const newParams = {
      accountCode,
      page: '1',
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      entryType: filters.entryType,
      status: filters.status,
      site: filters.site,
      reliever: filters.reliever,
      searchText: filters.searchText,
    }

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
          <p className="mt-4 text-gray-600 font-medium">Loading reliever payment ledger data...</p>
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
            onClear={() => setSearchParams({ accountCode, page: '1' })}
            onPrint={handlePrint}
          />

          {/* Action Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b flex justify-between items-center text-xs md:text-sm">
            <div className="text-gray-600 font-medium">
              Showing Page <strong>{pagination.page}</strong> of{' '}
              <strong>{pagination.totalPages}</strong> (
              {pagination.totalItems || filteredTransactions.length} entries)
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
                Showing Page <strong>{pagination.page}</strong> of{' '}
                <strong>{pagination.totalPages}</strong> ({pagination.totalItems} entries)
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

          {/* Summary Section (Reliever Payments is an Expense Account, so default balance is DR) */}
          <Summary summary={filteredSummary} balanceType="DR" />
        </div>
      </div>
    </div>
  )
}

export default RelieverPaymentPage
