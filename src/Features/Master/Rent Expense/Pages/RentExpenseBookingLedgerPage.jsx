// RentExpenseBookingLedgers.js - UPDATED
import React, { useState, useEffect } from 'react'
import { RentLedgerService } from '../../utils/rentLedgerService'
import RentLedgerHeader from '../Components/RentLedgerHeader'
import RentLedgerCard from '../Components/RentLedgerCard'
import FilterSection from '../Components/FilterSection'

const RentExpenseBookingLedgers = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    entryType: 'All',
    status: 'All',
  })

  // Load real data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const headerInfo = RentLedgerService.getBranchRentAccountDetails()
        const entries = RentLedgerService.getBranchRentLedgerEntries()

        setLedgerData({
          headerInfo,
          ledgerDetails: {
            entries,
            summary: {
              totalDebit: entries.reduce((sum, e) => sum + (e.debit || 0), 0),
              totalCredit: entries.reduce((sum, e) => sum + (e.credit || 0), 0),
              closingBalance: entries.length > 0 ? entries[entries.length - 1].balance : 0,
              balanceType: entries.length > 0 ? entries[entries.length - 1].balanceType : 'DR',
            },
          },
        })
      } catch (error) {
        console.error('Error loading rent expense ledger:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter logic
  const filteredEntries =
    ledgerData?.ledgerDetails.entries.filter((entry) => {
      const entryDate = new Date(entry.date)
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null
      const toDate = filters.toDate ? new Date(filters.toDate) : null

      const dateMatch = (!fromDate || entryDate >= fromDate) && (!toDate || entryDate <= toDate)

      const typeMatch =
        filters.entryType === 'All' ||
        (filters.entryType === 'Expenses Only' && entry.entryType === 'Expense') ||
        (filters.entryType === 'Payments Only' && entry.entryType === 'Payment')

      const statusMatch = filters.status === 'All' || entry.status === filters.status

      return dateMatch && typeMatch && statusMatch
    }) || []

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rent expense ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No rent expense data found</p>
        </div>
      </div>
    )
  }

  const filteredLedger = {
    ...ledgerData.ledgerDetails,
    entries: filteredEntries,
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 md:px-8 py-6">
      <div className="max-w-5xl mx-auto">
        <RentLedgerHeader data={ledgerData.headerInfo} />
        <FilterSection filters={filters} onFilterChange={setFilters} onPrint={handlePrint} />
        <RentLedgerCard ledger={filteredLedger} />
      </div>
    </div>
  )
}

export default RentExpenseBookingLedgers
