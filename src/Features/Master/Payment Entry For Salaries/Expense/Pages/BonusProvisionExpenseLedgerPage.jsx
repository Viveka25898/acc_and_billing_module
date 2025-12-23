/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import BonusHeader from '../Components/BonusHeader'
import MonthlyFilter from './../Components/BonusFilter'
import BonusTable from './../Components/BonusTable'
import JournalEntry from './../Components/BonusJournalEntry'
import Footer from '../Components/Footer'

const BonusExpenseLedgerPage = () => {
  const [filters, setFilters] = useState({
    year: '2024-2025',
    month: 'All Months',
  })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    // In a real application, this would trigger data refetching
    console.log('Filters updated:', newFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-5xl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BonusHeader />
        <MonthlyFilter onFilterChange={handleFilterChange} />
        <BonusTable />
        {/* <JournalEntry /> */}
      </div>
      <Footer />
    </div>
  )
}

export default BonusExpenseLedgerPage
