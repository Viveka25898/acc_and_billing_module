import React, { useState } from 'react'
import BonusProvisionHeader from '../components/BonusProvisionHeader'
import BonusProvisionControls from '../components/BonusProvisionControls'
import BonusProvisionTable from '../components/BonusProvisionTable'
import BonusProvisionFooter from '../components/BonusProvisionFooter'
import { accountInfo, summaryData, ledgerData, footerData } from '../data/bonusProvisionData'

const BonusProvisionExpenseLedgerPage = () => {
  const [filters, setFilters] = useState({
    period: 'FY 2024-25',
    costCenter: 'All Cost Centers',
    transactionType: 'All Transactions',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-screen-xl mx-auto bg-white shadow border border-gray-300">
        <BonusProvisionHeader accountInfo={accountInfo} />
        <BonusProvisionControls filters={filters} onFilterChange={handleFilterChange} />
        <BonusProvisionTable summaryData={summaryData} ledgerData={ledgerData} />
        <BonusProvisionFooter footerData={footerData} />
      </div>
    </div>
  )
}

export default BonusProvisionExpenseLedgerPage
