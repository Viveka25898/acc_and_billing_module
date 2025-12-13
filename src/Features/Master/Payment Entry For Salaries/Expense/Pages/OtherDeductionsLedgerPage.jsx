import React, { useState } from 'react'
import { accountInfo, filterOptions, ledgerData, summaryData } from '../data/othersDeductionsData'
import OtherDeductionsHeader from '../Components/OtherDeductionsHeader'
import OtherDeductionsFilter from '../Components/OtherdeductionsFilter'
import OtherDeductionsTable from '../Components/OtherDeductionsTable'
import OtherDeductionsFooter from '../Components/OtherDeductionsFooter'

const OtherDeductionsLedgerPage = () => {
  const [filters, setFilters] = useState({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    voucherType: 'all',
    costCenter: 'all',
    voucherSearch: '',
    status: 'all',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      voucherType: 'all',
      costCenter: 'all',
      voucherSearch: '',
      status: 'all',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OtherDeductionsHeader accountInfo={accountInfo} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <OtherDeductionsFilter
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        <OtherDeductionsTable summaryData={summaryData} ledgerData={ledgerData} />
        <OtherDeductionsFooter />
      </div>
    </div>
  )
}

export default OtherDeductionsLedgerPage
