// Client Ledger Page - ABC Mall (D001)
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ClientLedgerHeader from '../Components/ClientLedgerHeader'
import ClientLedgerFilter from '../Components/ClientLedgerFilter'
import ClientLedgerTable from '../Components/ClientLedgerTable'
import ClientLedgerFooter from '../Components/ClientLedgerFooter'
import {
  abcMallLedgerData,
  getClientLedgerData,
  initializeABCMallLedger,
} from '../data/clientLedgerData'

const ClientLedgerPage = () => {
  const { clientCode } = useParams()
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filteredTransactions, setFilteredTransactions] = useState([])

  useEffect(() => {
    loadLedgerData()
  }, [clientCode])

  const loadLedgerData = () => {
    try {
      setLoading(true)

      // Initialize ABC Mall ledger if not exists
      initializeABCMallLedger()

      // Load ledger data from localStorage
      setTimeout(() => {
        const data = getClientLedgerData(clientCode || 'D001') || abcMallLedgerData
        setLedgerData(data)
        setFilteredTransactions(data.ledgerDetails.entries)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('❌ Error loading client ledger:', error)
      setLoading(false)
    }
  }

  const handleFilterChange = (filters) => {
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
          entry.voucherNo.toLowerCase().includes(searchLower) ||
          entry.narration.toLowerCase().includes(searchLower) ||
          entry.refNo.toLowerCase().includes(searchLower)
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
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Client Ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600">Unable to load client ledger data for {clientCode}.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <ClientLedgerHeader ledgerInfo={ledgerData.headerInfo} />
        <ClientLedgerFilter onFilterChange={handleFilterChange} />
        <ClientLedgerTable transactions={filteredTransactions} />
        <ClientLedgerFooter summary={ledgerData.summary} ledgerDetails={ledgerData.ledgerDetails} />
      </div>
    </div>
  )
}

export default ClientLedgerPage
