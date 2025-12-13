/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Header from '../Component/LWFPayableLedgerHeader'
import AccountInfo from '../Component/LWFPayableAccountInfo'
import ControlsPanel from '../Component/LWFPayableControllsPanel'
import SummaryCards from '../Component/LWFPayableSummeryCards'
import LedgerTable from '../Component/LWFPayableLedgerTable'
import Footer from '../Component/LWFPayableFooter'

const LWFPayableLedgerPage = () => {
  const [filters, setFilters] = useState({
    period: 'fy-2024-25',
    state: 'all',
    status: 'all',
  })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    // Here you would typically filter your data based on the new filters
    console.log('Filters changed:', newFilters)
  }
  return (
    <div className="min-h-screen gradient-bg p-4 md:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Header />
        <AccountInfo />
        <ControlsPanel onFilterChange={handleFilterChange} />
        <SummaryCards />
        <LedgerTable />
        {/* <Footer /> */}
      </div>
    </div>
  )
}

export default LWFPayableLedgerPage
