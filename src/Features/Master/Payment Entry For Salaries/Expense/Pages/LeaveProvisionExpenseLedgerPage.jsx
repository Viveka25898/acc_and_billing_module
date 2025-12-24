/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import LeaveProvisionHeader from '../Components/LeaveProvisionHeader'
import AccountInfoLeaveProvision from '../Components/AccountInfoLeaveProvision'
import ControlsPanelLeaveProvision from '../Components/ControlsPannelLeaveProvision'
import SummaryCardsLeaveProvision from '../Components/SummeryCardsLeaveProvision'
import LedgerTableLeaveProvision from '../Components/LedgerTableLeaveProvision'
import LeaveProvisionFooter from '../Components/LeaveProisionFooter'

const LeaveProvisionExpenseLedgerPage = () => {
  const [allTransactions, setAllTransactions] = useState([])
  const [ledgerDetails, setLedgerDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    period: 'fy-2024-25',
    department: 'all',
    fromDate: '2024-04-01',
    toDate: '2024-09-30',
    ledgerView: 'monthly',
    showActuarialDetails: false,
  })

  // Load real transactions from localStorage
  useEffect(() => {
    try {
      console.log('🔄 Loading Leave Wages ledger data...')
      const details = SalaryLedgerService.getLedgerDetails('X2001001005')
      setLedgerDetails(details)
      const transactions = SalaryLedgerService.getLedgerTransactions('X2001001005')
      setAllTransactions(transactions)
      console.log('✅ Loaded Leave Wages ledger:', {
        details,
        transactionCount: transactions.length,
      })
      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading Leave Wages ledger:', error)
      setLoading(false)
    }
  }, [])

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
