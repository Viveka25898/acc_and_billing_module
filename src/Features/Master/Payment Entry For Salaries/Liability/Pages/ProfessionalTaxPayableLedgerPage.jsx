import React, { useState } from 'react'
import ProfessionalTaxHeader from './../Component/ProfessionalTaxHeader'
import ProfessionalTaxFilter from './../Component/ProfessionalTaxFilter'
import ProfessionalTaxTable from './../Component/ProfessionalTaxTable'
import {
  accountInfo,
  filterOptions,
  ledgerData,
  summaryData,
} from '../data/professionalTaxPayableData'

const ProfessionalTaxPayableLedgerPage = () => {
  const [filters, setFilters] = useState({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    month: 'all',
    state: 'all',
    voucherType: 'all',
    status: 'all',
    voucherSearch: '',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalTaxHeader accountInfo={accountInfo} />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <ProfessionalTaxFilter
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />
        <ProfessionalTaxTable summaryData={summaryData} ledgerData={ledgerData} />
      </div>
    </div>
  )
}

export default ProfessionalTaxPayableLedgerPage
