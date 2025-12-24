/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import EmployeePFHeader from './../Component/EmployeePFHeader'
import EmployeePFFilter from './../Component/EmployeePFFilter'
import EmployeePFTable from './../Component/EmployeePFTable'

const EmployeePFPayableLedgerPage = () => {
  const [allTransactions, setAllTransactions] = useState([])
  const [ledgerDetails, setLedgerDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    month: 'all',
    voucherType: 'all',
    status: 'all',
    voucherSearch: '',
  })

  // Load real transactions from localStorage
  useEffect(() => {
    try {
      console.log('🔄 Loading Employee PF Payable ledger data...')
      const details = SalaryLedgerService.getLedgerDetails('L2002006')
      setLedgerDetails(details)
      const transactions = SalaryLedgerService.getLedgerTransactions('L2002006')
      setAllTransactions(transactions)
      console.log('✅ Loaded Employee PF Payable ledger:', {
        details,
        transactionCount: transactions.length,
      })
      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading Employee PF Payable ledger:', error)
      setLoading(false)
    }
  }, [])

  const summary = useMemo(() => {
    return SalaryLedgerService.getLedgerSummary(allTransactions, 'L2002006')
  }, [allTransactions])

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
