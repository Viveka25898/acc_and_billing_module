// House Keeping Charges Revenue Ledger Page - R1001001
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RevenueLedgerHeader from '../Components/RevenueLedgerHeader'
import RevenueLedgerFilter from '../Components/RevenueLedgerFilter'
import RevenueLedgerTable from '../Components/RevenueLedgerTable'
import RevenueLedgerFooter from '../Components/RevenueLedgerFooter'
import {
  houseKeepingRevenueData,
  getRevenueLedgerData,
  initializeHouseKeepingRevenueLedger,
} from '../data/houseKeepingRevenueData'

const HouseKeepingRevenueLedgerPage = () => {
  const { accountCode } = useParams()
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLedgerData()
  }, [accountCode])

  const loadLedgerData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Initialize House Keeping Revenue ledger if not exists
      initializeHouseKeepingRevenueLedger()

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Load ledger data from localStorage
      const data = getRevenueLedgerData(accountCode || 'R1001001') || houseKeepingRevenueData
      setLedgerData(data)
      setFilteredTransactions(data.ledgerDetails.entries)
      setLoading(false)
    } catch (err) {
      console.error('❌ Error loading revenue ledger:', err)
      setError('Failed to load revenue ledger data. Please try again.')
      setLoading(false)
    }
  }

  const handleFilterChange = (filters) => {
    try {
      if (!ledgerData) return

      let filtered = [...ledgerData.ledgerDetails.entries]

      // Filter by entry type
      if (filters.entryType && filters.entryType !== 'All') {
        filtered = filtered.filter((entry) => entry.entryType === filters.entryType)
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        filtered = filtered.filter(
          (entry) =>
            entry.voucher.toLowerCase().includes(searchLower) ||
            entry.narration.toLowerCase().includes(searchLower) ||
            entry.refNo.toLowerCase().includes(searchLower) ||
            entry.counterparty.toLowerCase().includes(searchLower)
        )
      }

      // Filter by date range
      if (filters.fromDate && filters.toDate) {
        filtered = filtered.filter((entry) => {
          const entryDate = new Date(entry.date.split('-').reverse().join('-'))
          const fromDate = new Date(filters.fromDate)
          const toDate = new Date(filters.toDate)
          return entryDate >= fromDate && entryDate <= toDate
        })
      }

      setFilteredTransactions(filtered)
    } catch (err) {
      console.error('❌ Error applying filters:', err)
      setError('Failed to apply filters. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Revenue Ledger...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the data</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Ledger</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadLedgerData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600 mt-2">
            Unable to load revenue ledger data for {accountCode}.
          </p>
          <button
            onClick={loadLedgerData}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <RevenueLedgerHeader ledgerInfo={ledgerData.headerInfo} />
        <RevenueLedgerFilter onFilterChange={handleFilterChange} />
        <RevenueLedgerTable transactions={filteredTransactions} />
        <RevenueLedgerFooter
          summary={ledgerData.summary}
          ledgerDetails={ledgerData.ledgerDetails}
        />
      </div>
    </div>
  )
}

export default HouseKeepingRevenueLedgerPage
