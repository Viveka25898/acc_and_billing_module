import React, { useState, useEffect, useMemo } from 'react'
import SalaryLedgerService from '../../../utils/SalaryLedgerService'
import ProfessionalTaxHeader from './../Component/ProfessionalTaxHeader'
import ProfessionalTaxFilter from './../Component/ProfessionalTaxFilter'
import ProfessionalTaxTable from './../Component/ProfessionalTaxTable'

const ProfessionalTaxPayableLedgerPage = () => {
  const [allTransactions, setAllTransactions] = useState([])
  const [ledgerDetails, setLedgerDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    month: 'all',
    state: 'all',
    voucherType: 'all',
    status: 'all',
    voucherSearch: '',
  })

  // Load real transactions from localStorage
  useEffect(() => {
    try {
      console.log('🔄 Loading Professional Tax Payable ledger data...')
      const details = SalaryLedgerService.getLedgerDetails('L2002009')
      setLedgerDetails(details)
      const transactions = SalaryLedgerService.getLedgerTransactions('L2002009')
      setAllTransactions(transactions)
      console.log('✅ Loaded Professional Tax Payable ledger:', {
        details,
        transactionCount: transactions.length,
      })
      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading Professional Tax Payable ledger:', error)
      setLoading(false)
    }
  }, [])

  const summary = useMemo(() => {
    return SalaryLedgerService.getLedgerSummary(allTransactions, 'L2002009')
  }, [allTransactions])

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
