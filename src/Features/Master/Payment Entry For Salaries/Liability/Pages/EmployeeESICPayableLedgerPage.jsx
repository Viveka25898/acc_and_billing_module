import React, { useState } from 'react'
import {
  accountInfo,
  filterOptions,
  ledgerData,
  summaryData,
} from '../data/esicEmployeePayableData'
import EmployeeESICHeader from '../Component/EmployeeESICHeader'
import EmployeeESICFilter from '../Component/EmployeeESICFilter'
import EmployeeESICTable from '../Component/EmployeeESICTable'

const EmployeeESICPayableLedgerPage = () => {
  const [filters, setFilters] = useState({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    period: 'all',
    voucherType: 'all',
    status: 'all',
    voucherSearch: '',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeESICHeader accountInfo={accountInfo} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <EmployeeESICFilter
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />
        <EmployeeESICTable summaryData={summaryData} ledgerData={ledgerData} />
      </div>
    </div>
  )
}

export default EmployeeESICPayableLedgerPage
