import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EmployeeHeader from '../Components/EmployeeHeader'
import FilterSection from '../Components/FilterSection'
import LedgerTable from '../Components/LedgerTable'
import FooterSummary from '../Components/FooterSummary'
import { LedgerService } from '../../utils/ledgerService'

const EmployeeLedgerPage = () => {
  // Get accountCode from URL params (e.g., /ledger/A3002-EMP-001)
  const { accountCode } = useParams()
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    fromDate: '2024-04-01',
    toDate: '2025-03-31',
    entryType: '',
    status: '',
    searchText: '',
  })

  const [accountData, setAccountData] = useState(null)
  const [ledgerEntries, setLedgerEntries] = useState([])
  const [filteredEntries, setFilteredEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load ledger data on mount or when accountCode changes
  useEffect(() => {
    loadLedgerData()
  }, [accountCode])

  // Apply filters when entries or filter criteria change
  useEffect(() => {
    applyFilters()
  }, [ledgerEntries, filters])

  const loadLedgerData = () => {
    try {
      setLoading(true)
      setError(null)

      console.log(`🔄 Loading ledger for account: ${accountCode}`)

      // Get account details
      const details = LedgerService.getAccountDetails(accountCode)

      if (!details) {
        setError(`Account ${accountCode} not found`)
        setLoading(false)
        return
      }

      setAccountData(details)

      // Get ledger entries
      const entries = LedgerService.getLedgerEntries(accountCode)
      setLedgerEntries(entries)

      console.log(`✅ Loaded ${entries.length} entries for ${accountCode}`)
    } catch (error) {
      console.error('❌ Error loading ledger data:', error)
      setError('Failed to load ledger data')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    try {
      let filtered = [...ledgerEntries]

      // Filter by date range
      if (filters.fromDate || filters.toDate) {
        filtered = LedgerService.filterByDateRange(filtered, filters.fromDate, filters.toDate)
      }

      // Filter by entry type
      if (filters.entryType) {
        filtered = LedgerService.filterByEntryType(filtered, filters.entryType)
      }

      // Search filter
      if (filters.searchText) {
        filtered = LedgerService.searchEntries(filtered, filters.searchText)
      }

      setFilteredEntries(filtered)
    } catch (error) {
      console.error('Error applying filters:', error)
      setFilteredEntries(ledgerEntries)
    }
  }

  const handleRefresh = () => {
    loadLedgerData()
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 p-2 md:p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ledger data...</p>
        </div>
      </div>
    )
  }

  if (error || !accountData) {
    return (
      <div className="w-full min-h-screen bg-gray-100 p-2 md:p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Account Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || `The account ${accountCode} does not exist in the system.`}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-2 md:p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with account details */}
        <EmployeeHeader data={accountData} />

        {/* Filter Section */}
        <FilterSection filters={filters} setFilters={setFilters} />

        {/* Action Bar */}
        <div className="px-3 md:px-5 py-2 bg-gray-50 border-b flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredEntries.length} of {ledgerEntries.length} transactions
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Table Container with Scroll */}
        <div className="p-3 md:p-5">
          {filteredEntries.length > 0 ? (
            <LedgerTable entries={filteredEntries} />
          ) : ledgerEntries.length > 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg font-medium">No transactions match your filters</p>
              <p className="text-sm mt-2">Try adjusting your filter criteria</p>
              <button
                onClick={() =>
                  setFilters({
                    fromDate: '2024-04-01',
                    toDate: '2025-03-31',
                    entryType: '',
                    status: '',
                    searchText: '',
                  })
                }
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg font-medium">No transactions found for this account</p>
              <p className="text-sm mt-2">
                Transactions will appear here when advances are approved.
              </p>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {filteredEntries.length > 0 && <FooterSummary entries={filteredEntries} />}
      </div>
    </div>
  )
}

export default EmployeeLedgerPage
