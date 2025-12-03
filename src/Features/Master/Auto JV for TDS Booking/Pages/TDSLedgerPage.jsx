import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RealLedgerService } from '../../utils/realLedgerService'
import TDSHeader from '../Components/TDSHeader'
import TDSSummaryCards from '../Components/TDSSummaryCards'
import TDSFilterSection from '../Components/TDSFilterSection'
import TDSLedgerTable from '../Components/TDSLedgerTable'
import TDSFooterSummary from '../Components/TDSFooterSummary'

const TDSLedgerPage = () => {
  const { sectionCode } = useParams()

  const [filters, setFilters] = useState({
    fromDate: '2025-01-01',
    toDate: new Date().toISOString().split('T')[0],
    entryType: '',
    vendor: '',
    quarter: '',
  })

  const [tdsData, setTdsData] = useState({
    sectionData: null,
    summaryData: null,
    ledgerEntries: [],
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTDSData()
  }, [sectionCode, filters])

  const loadTDSData = () => {
    setLoading(true)
    try {
      // Get TDS transactions using smart search
      const tdsTransactions = RealLedgerService.findTransactionsByGL('L2003001')

      // Filter by date
      let filteredTransactions = tdsTransactions.filter((txn) => {
        if (filters.fromDate && new Date(txn.date) < new Date(filters.fromDate)) {
          return false
        }
        if (filters.toDate && new Date(txn.date) > new Date(filters.toDate)) {
          return false
        }
        return true
      })

      // Convert to ledger entries format
      const ledgerEntries = RealLedgerService.convertTDSTransactionsToLedger(filteredTransactions)

      // Get section data
      const sectionData = RealLedgerService.getTDSSectionData(sectionCode)

      // Get summary data
      const summaryData = RealLedgerService.calculateTDSSummary(ledgerEntries)

      setTdsData({
        sectionData,
        summaryData,
        ledgerEntries,
      })
    } catch (error) {
      console.error('Error loading TDS data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleClearFilters = () => {
    setFilters({
      fromDate: '2025-01-01',
      toDate: new Date().toISOString().split('T')[0],
      entryType: '',
      vendor: '',
      quarter: '',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading TDS Ledger Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-screen-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <TDSHeader data={tdsData.sectionData} />

        {tdsData.summaryData && (
          <TDSSummaryCards data={tdsData.summaryData} sectionCode={sectionCode} />
        )}

        <TDSFilterSection
          filters={filters}
          setFilters={handleFilterChange}
          onClearFilters={handleClearFilters}
          showSectionFilter={!sectionCode}
        />

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              TDS Transactions ({tdsData.ledgerEntries.length})
            </h3>
            <button
              onClick={loadTDSData}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
            >
              Refresh Data
            </button>
          </div>

          {tdsData.ledgerEntries.length > 0 ? (
            <TDSLedgerTable entries={tdsData.ledgerEntries} />
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
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
              <p className="text-gray-600 mb-2">No TDS transactions found</p>
              <p className="text-gray-500 text-sm">
                Try adjusting your filters or check if any TDS transactions have been posted.
              </p>
            </div>
          )}
        </div>

        <TDSFooterSummary entries={tdsData.ledgerEntries} />
      </div>
    </div>
  )
}

export default TDSLedgerPage
