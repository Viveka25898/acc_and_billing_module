import React, { useState } from 'react'
import { accountInfo, filterOptions, ledgerData, summaryData } from '../data/pfEmployeePayableData'
import EmployeePFHeader from './../Component/EmployeePFHeader'
import EmployeePFFilter from './../Component/EmployeePFFilter'
import EmployeePFTable from './../Component/EmployeePFTable'

const EmployeePFPayableLedgerPage = () => {
  const [filters, setFilters] = useState({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    month: 'all',
    voucherType: 'all',
    status: 'all',
    voucherSearch: '',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeePFHeader accountInfo={accountInfo} />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <EmployeePFFilter
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />
        <EmployeePFTable summaryData={summaryData} ledgerData={ledgerData} />
      </div>
    </div>
  )
}

export default EmployeePFPayableLedgerPage
