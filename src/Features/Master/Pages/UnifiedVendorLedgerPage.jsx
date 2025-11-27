import React, { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { UnifiedVendorLedgerService } from '../utils/unifiedVendorLedgerService'
import HKVendorHeader from '../Process For HK Material/Components/HKVendorHeader'
import HKSummaryCards from '../Process For HK Material/Components/HKSummeryCards'
import HKFilterSection from '../Process For HK Material/Components/HKFilterSection'
import HKLedgerTable from '../Process For HK Material/Components/HKLedgerTable'
import HKFooterSummary from '../Process For HK Material/Components/HKFooterSummery'

const UnifiedVendorLedgerPage = () => {
  const { accountCode } = useParams()
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    entryType: '',
    status: '',
    category: '', // NEW: Filter by transaction category (HK, FA, Uniform, Rent)
  })

  // ✅ Load real unified data from transactions
  useEffect(() => {
    const loadLedgerData = async () => {
      try {
        setLoading(true)
        console.log('🔍 Loading unified vendor ledger for:', accountCode)

        // Use UnifiedVendorLedgerService instead of specific services
        const vendorInfo = UnifiedVendorLedgerService.getVendorAccountDetails(accountCode)
        const entries = UnifiedVendorLedgerService.getVendorLedgerEntries(accountCode)

        console.log('📊 Loaded vendor info:', vendorInfo)
        console.log('📋 Loaded entries:', entries.length)

        if (!vendorInfo) {
          setError('Vendor account not found')
          return
        }

        setLedgerData({
          vendorInfo,
          entries,
        })
      } catch (err) {
        console.error('❌ Error loading unified vendor ledger:', err)
        setError('Failed to load vendor ledger data')
      } finally {
        setLoading(false)
      }
    }

    if (accountCode) {
      loadLedgerData()
    }
  }, [accountCode])

  // ✅ Compute filtered entries with category filter
  const filteredEntries = useMemo(() => {
    if (!ledgerData?.entries) return []

    return ledgerData.entries.filter((entry) => {
      // Date filter
      const entryDate = entry.originalDate
        ? new Date(entry.originalDate)
        : UnifiedVendorLedgerService.parseDate(entry.date)
      const from = filters.fromDate ? new Date(filters.fromDate) : null
      const to = filters.toDate ? new Date(filters.toDate) : null

      const withinRange =
        (!from || !entryDate || entryDate >= from) && (!to || !entryDate || entryDate <= to)

      // Entry type filter (Invoice/Payment/Journal)
      const matchesType = !filters.entryType || entry.entryType === filters.entryType

      // Status filter
      const matchesStatus = !filters.status || entry.status === filters.status

      // ✅ NEW: Category filter (HK Material, Fixed Asset, Uniform, Rent, etc.)
      const matchesCategory = !filters.category || entry.expenseCategory === filters.category

      return withinRange && matchesType && matchesStatus && matchesCategory
    })
  }, [ledgerData, filters])

  // ✅ Compute totals dynamically
  const totals = useMemo(() => {
    if (!filteredEntries || filteredEntries.length === 0) {
      return {
        totalDebit: '0.00',
        totalCredit: '0.00',
        closingBalance: '0.00',
        balanceType: 'CR',
      }
    }

    let totalDebit = 0
    let totalCredit = 0
    let lastBalance = null
    let lastBalanceType = 'CR'

    filteredEntries.forEach((e) => {
      const debitVal = e.debit !== '-' ? parseFloat(e.debit.replace(/,/g, '')) : 0
      const creditVal = e.credit !== '-' ? parseFloat(e.credit.replace(/,/g, '')) : 0
      totalDebit += debitVal
      totalCredit += creditVal

      // Get the last balance
      if (e.balance) {
        lastBalance = e.balance
        lastBalanceType = e.balanceType || (e.balance.includes('CR') ? 'CR' : 'DR')
      }
    })

    // Calculate closing balance
    const closingBalance = totalCredit - totalDebit
    const closingBalanceType = closingBalance >= 0 ? 'CR' : 'DR'

    // Use last entry's balance if available, otherwise calculate
    const finalBalance = lastBalance
      ? lastBalance.split(' ')[0]
      : Math.abs(closingBalance).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })

    return {
      totalDebit: totalDebit.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalCredit: totalCredit.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      closingBalance: finalBalance,
      balanceType: lastBalanceType || closingBalanceType,
    }
  }, [filteredEntries])

  // ✅ Enhanced summary with transaction type breakdown
  const enhancedSummary = useMemo(() => {
    if (!ledgerData?.vendorInfo?.summary) return null

    const breakdown = ledgerData.vendorInfo.summary.transactionTypes || {}

    return {
      ...ledgerData.vendorInfo.summary,
      categoryBreakdown: `HK: ₹${breakdown.hkMaterial?.toLocaleString('en-IN') || '0'} | FA: ₹${breakdown.fixedAsset?.toLocaleString('en-IN') || '0'} | Uniform: ₹${breakdown.prepaidUniform?.toLocaleString('en-IN') || '0'} | Rent: ₹${breakdown.rent?.toLocaleString('en-IN') || '0'}`,
    }
  }, [ledgerData])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading unified vendor ledger...</p>
        </div>
      </div>
    )
  }

  if (error || !ledgerData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">Vendor Ledger Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || `No vendor ledger for account: ${accountCode}`}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto my-6 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* ✅ Header with vendor info */}
        <HKVendorHeader info={ledgerData.vendorInfo} balances={ledgerData.vendorInfo.balances} />

        {/* ✅ Summary cards with breakdown */}
        <HKSummaryCards summary={enhancedSummary} />

        {/* ✅ Enhanced filter section with category filter */}
        <div className="p-4 bg-gray-50 border-b">
          <HKFilterSection filters={filters} setFilters={setFilters} />

          {/* ✅ NEW: Category filter buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center mr-2">
              Transaction Type:
            </span>
            <button
              onClick={() => setFilters({ ...filters, category: '' })}
              className={`px-3 py-1 rounded text-sm ${
                !filters.category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({ledgerData.entries.length})
            </button>
            <button
              onClick={() => setFilters({ ...filters, category: 'HK Materials' })}
              className={`px-3 py-1 rounded text-sm ${
                filters.category === 'HK Materials'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              HK Materials
            </button>
            <button
              onClick={() => setFilters({ ...filters, category: 'Fixed Assets' })}
              className={`px-3 py-1 rounded text-sm ${
                filters.category === 'Fixed Assets'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Fixed Assets
            </button>
            <button
              onClick={() => setFilters({ ...filters, category: 'Prepaid Expenses' })}
              className={`px-3 py-1 rounded text-sm ${
                filters.category === 'Prepaid Expenses'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Uniforms
            </button>
            <button
              onClick={() => setFilters({ ...filters, category: 'Rent' })}
              className={`px-3 py-1 rounded text-sm ${
                filters.category === 'Rent'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Rent
            </button>
            <button
              onClick={() => setFilters({ ...filters, category: 'Other' })}
              className={`px-3 py-1 rounded text-sm ${
                filters.category === 'Other'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Other
            </button>
          </div>
        </div>

        {/* ✅ Ledger table with unified entries */}
        <HKLedgerTable entries={filteredEntries} />

        {/* ✅ Footer summary */}
        <HKFooterSummary totals={totals} />

        {/* ✅ Transaction breakdown info */}
        {ledgerData.vendorInfo.summary?.transactionTypes && (
          <div className="p-4 bg-blue-50 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Transaction Category Breakdown:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white p-2 rounded">
                <span className="text-gray-600">HK Materials:</span>
                <span className="font-semibold ml-2">
                  ₹
                  {ledgerData.vendorInfo.summary.transactionTypes.hkMaterial?.toLocaleString(
                    'en-IN'
                  ) || '0'}
                </span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="text-gray-600">Fixed Assets:</span>
                <span className="font-semibold ml-2">
                  ₹
                  {ledgerData.vendorInfo.summary.transactionTypes.fixedAsset?.toLocaleString(
                    'en-IN'
                  ) || '0'}
                </span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="text-gray-600">Uniforms:</span>
                <span className="font-semibold ml-2">
                  ₹
                  {ledgerData.vendorInfo.summary.transactionTypes.prepaidUniform?.toLocaleString(
                    'en-IN'
                  ) || '0'}
                </span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="text-gray-600">Rent:</span>
                <span className="font-semibold ml-2">
                  ₹
                  {ledgerData.vendorInfo.summary.transactionTypes.rent?.toLocaleString('en-IN') ||
                    '0'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnifiedVendorLedgerPage
