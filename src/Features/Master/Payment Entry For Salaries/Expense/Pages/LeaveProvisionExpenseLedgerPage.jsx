/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {
  accountInfo,
  actuarialAssumptions,
  complianceRequirements,
  ledgerData,
  summaryData,
} from '../data/leaveProvisionData'
import LeaveProvisionHeader from '../Components/LeaveProvisionHeader'
import AccountInfoLeaveProvision from '../Components/AccountInfoLeaveProvision'
import ControlsPanelLeaveProvision from '../Components/ControlsPannelLeaveProvision'
import SummaryCardsLeaveProvision from '../Components/SummeryCardsLeaveProvision'
import LedgerTableLeaveProvision from '../Components/LedgerTableLeaveProvision'
import LeaveProvisionFooter from '../Components/LeaveProisionFooter'

const LeaveProvisionExpenseLedgerPage = () => {
  const [filters, setFilters] = useState({
    period: 'fy-2024-25',
    department: 'all',
    fromDate: '2024-04-01',
    toDate: '2024-09-30',
    ledgerView: 'monthly', // monthly, quarterly, yearly
    showActuarialDetails: false,
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format with filters:`, filters)
    // Implement actual export logic
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-screen-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <LeaveProvisionHeader />
        <AccountInfoLeaveProvision accountInfo={accountInfo} />
        <ControlsPanelLeaveProvision
          filters={filters}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          onPrint={handlePrint}
        />
        {/* <SummaryCardsLeaveProvision summaryData={summaryData} filters={filters} /> */}
        <LedgerTableLeaveProvision
          ledgerData={ledgerData}
          filters={filters}
          actuarialAssumptions={actuarialAssumptions}
        />
      </div>
    </div>
  )
}

export default LeaveProvisionExpenseLedgerPage
