// Service Tax Payable Ledger Page
import React, { useState, useEffect } from 'react'
import ServiceTaxLedgerHeader from '../Components/ServiceTaxLedgerHeader'
import HKChargesFilterSection from '../../HouseKeepingCharges/Components/HKChargesFilterSection'
import ServiceTaxTransactionTable from '../Components/ServiceTaxTransactionTable'
import ServiceTaxSummaryFooter from '../Components/ServiceTaxSummaryFooter'
import { serviceTaxLedgerData } from '../data/serviceTaxLedgerData'

const ServiceTaxLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLedgerData()
  }, [])

  const loadLedgerData = () => {
    try {
      setLoading(true)
      setTimeout(() => {
        setLedgerData(serviceTaxLedgerData)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('❌ Error loading Service Tax ledger:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Service Tax Ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600">Unable to load Service Tax ledger data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <ServiceTaxLedgerHeader ledgerInfo={ledgerData.headerInfo} />
        <HKChargesFilterSection />
        <ServiceTaxTransactionTable transactions={ledgerData.ledgerDetails.entries} />
        <ServiceTaxSummaryFooter
          summary={ledgerData.headerInfo}
          ledgerDetails={ledgerData.ledgerDetails}
        />
      </div>
    </div>
  )
}

export default ServiceTaxLedgerPage
