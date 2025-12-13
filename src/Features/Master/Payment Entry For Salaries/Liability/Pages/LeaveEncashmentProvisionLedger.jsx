import React, { useState } from 'react'
import LeaveEncashmentHeader from './../Component/LeaveEncashmentHeader'
import LeaveEncashmentControls from '../Component/LeaveEncashmentControlls'
import LeaveEncashmentTable from '../Component/LeaveEncashmentTable'
import LeaveEncashmentFooter from './../Component/LeaveEncashmentFooter'

const LeaveEncashmentProvisionLedgerPage = () => {
  const [filters, setFilters] = useState({
    period: 'FY 2024-25',
    transactionType: 'All Transactions',
    fromDate: '2024-04-01',
    toDate: '2024-06-30',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-screen-xl mx-auto bg-white shadow-md border border-gray-200">
        <LeaveEncashmentHeader />
        <LeaveEncashmentControls filters={filters} onFilterChange={handleFilterChange} />
        <LeaveEncashmentTable />
        <LeaveEncashmentFooter />
      </div>
    </div>
  )
}

export default LeaveEncashmentProvisionLedgerPage
