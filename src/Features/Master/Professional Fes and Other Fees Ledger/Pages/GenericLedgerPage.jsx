/* eslint-disable no-unused-vars */
// src/features/Expense Ledger Pages/Pages/GenericExpenseLedger.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../Components/Header'
import { InfoBar } from '../Components/InfoBar'
import { LedgerTable } from '../Components/LedgerTable'
import { SummaryFooter } from '../Components/SummeryFooter'
import UnifiedFeesService from '../../utils/unifiesFeesSerice'
import SeparatedFeesService from '../../utils/SepertedFeesService'

export default function GenericExpenseLedger() {
  const { accountCode } = useParams()
  const [ledgerData, setLedgerData] = useState({ entries: [], summary: null })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    fromDate: '2025-01-01',
    toDate: new Date().toISOString().split('T')[0],
  })
  const [stats, setStats] = useState(null)
  const [dataSources, setDataSources] = useState([])

  useEffect(() => {
    loadLedgerData()
  }, [accountCode, filters])

  const loadLedgerData = () => {
    setLoading(true)
    try {
      console.log(`🔍 Loading SEPARATED ledger data for: ${accountCode}`)

      // Run debug first to see what's available
      SeparatedFeesService.debugFeeTransactions()

      // Get formatted data for the table
      const formattedEntries = SeparatedFeesService.getFormattedLedgerData(accountCode, filters)

      // Get summary information
      const summaryResult = SeparatedFeesService.getSeparatedFeesLedger(accountCode, filters)
      const { summary } = summaryResult || { summary: null }

      // Get statistics
      const feeStats = SeparatedFeesService.getFeesStatistics(accountCode)

      setLedgerData({
        entries: formattedEntries,
        summary: summary,
      })
      setStats(feeStats)

      console.log('📊 Loaded SEPARATED ledger data:', {
        accountCode,
        entriesCount: formattedEntries.length,
        hasSummary: !!summary,
        statistics: feeStats,
      })
    } catch (error) {
      console.error('Error loading ledger data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleRefresh = () => {
    loadLedgerData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Ledger Data...</p>
        </div>
      </div>
    )
  }

  // If no data and no summary, show empty state
  if ((!ledgerData.summary || ledgerData.entries.length === 0) && dataSources.length === 0) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Transactions Found</h2>
            <p className="text-gray-600 mb-6">
              No transactions found for{' '}
              {accountCode === 'X2002002002' ? 'Professional Fees' : 'Other Fees'}
            </p>

            {/* Debug information */}
            <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto text-left mb-6">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Debug Info:</strong>
              </p>
              <ul className="text-sm text-blue-700 list-disc pl-5">
                <li>Account Code: {accountCode}</li>
                <li>
                  Date Range: {filters.fromDate} to {filters.toDate}
                </li>
                <li>Entries found: {ledgerData.entries.length}</li>
                <li>Has summary: {ledgerData.summary ? 'Yes' : 'No'}</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg max-w-md mx-auto text-left mb-6">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Note:</strong> Your transactions might be recorded under:
              </p>
              <ul className="text-sm text-yellow-700 list-disc pl-5">
                <li>Other Fees (X2002002003)</li>
                <li>Indirect Expense accounts</li>
                <li>Different GL codes</li>
                <li>Check localStorage for transaction data</li>
              </ul>
            </div>

            <button
              onClick={handleRefresh}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    )
  }

  const companyInfo = {
    companyName: 'ABC Industries Pvt Ltd',
    glCode: accountCode,
    ledgerName:
      ledgerData.summary?.accountDetails?.name ||
      (accountCode === 'X2002002002' ? 'Professional Fees' : 'Other Fees'),
    financialYear: '2025-26',
    period: ledgerData.summary?.period || 'All Time',
    accountType: ledgerData.summary?.accountDetails?.category || 'Expense',
    accountNature: ledgerData.summary?.accountDetails?.nature || 'Debit',
    // Add data source info
    dataSources: dataSources,
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <Header
          ledgerName={companyInfo.ledgerName}
          onFilterChange={handleFilterChange}
          filters={filters}
          onRefresh={handleRefresh}
          transactionCount={ledgerData.entries.length}
        />

        <InfoBar info={companyInfo} />

        {/* Data Source Info */}
        {dataSources.length > 0 && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
            <div className="text-sm text-yellow-800">
              <strong>ℹ️ Data Sources:</strong> Showing transactions from:
              <div className="flex flex-wrap gap-2 mt-1">
                {dataSources.map((source, index) => (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs"
                  >
                    {source.glName} ({source.transactionCount} transactions)
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <LedgerTable data={ledgerData.entries} ledgerName={companyInfo.ledgerName} />

        {ledgerData.summary && (
          <SummaryFooter
            data={ledgerData.entries}
            summary={ledgerData.summary}
            ledgerName={companyInfo.ledgerName}
            statistics={stats}
          />
        )}
      </div>
    </div>
  )
}
