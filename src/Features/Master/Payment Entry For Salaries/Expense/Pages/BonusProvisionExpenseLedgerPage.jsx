/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import BonusHeader from '../Components/BonusHeader'
import MonthlyFilter from './../Components/BonusFilter'
import BonusTable from './../Components/BonusTable'
import Footer from '../Components/Footer'

const BonusExpenseLedgerPage = () => {
  const [allTransactions, setAllTransactions] = useState([])
  const [ledgerDetails, setLedgerDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    year: '2024-2025',
    month: 'All Months',
  })

  // Load real transactions from localStorage
  useEffect(() => {
    try {
      console.log('🔄 Loading Bonus ledger data...')
      const details = SalaryLedgerService.getLedgerDetails('X2001001007')
      setLedgerDetails(details)
      const transactions = SalaryLedgerService.getLedgerTransactions('X2001001007')
      setAllTransactions(transactions)
      console.log('✅ Loaded Bonus ledger:', { details, transactionCount: transactions.length })
      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading Bonus ledger:', error)
      setLoading(false)
    }
  }, [])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    console.log('Filters updated:', newFilters)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ledger data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-5xl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BonusHeader ledgerDetails={ledgerDetails} />
        <MonthlyFilter onFilterChange={handleFilterChange} />
        <BonusTable transactions={allTransactions} filters={filters} />
      </div>
      <Footer transactions={allTransactions} />
    </div>
  )
}

export default BonusExpenseLedgerPage
