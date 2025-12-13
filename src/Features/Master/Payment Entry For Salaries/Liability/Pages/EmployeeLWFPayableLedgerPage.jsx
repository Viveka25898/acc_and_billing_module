import React, { useState } from 'react'
import { accountInfo, filterOptions, ledgerData, summaryData } from '../data/employeeLWFPayableData'
import EmployeeLWFHeader from '../Component/EmployeeLWFHeader'
import EmployeeLWFFilter from './../Component/EmployeeLWFFilter'
import EmployeeLWFTable from './../Component/EmployeeLWFTable'

const EmployeeLWFPayableLedgerPage = () => {
  const [filters, setFilters] = useState({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    period: 'all',
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
      <EmployeeLWFHeader accountInfo={accountInfo} />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <EmployeeLWFFilter
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />
        <EmployeeLWFTable summaryData={summaryData} ledgerData={ledgerData} />
      </div>
    </div>
  )
}

export default EmployeeLWFPayableLedgerPage
