// HouseKeeping Charges Ledger Page
import React, { useState, useEffect } from 'react'
import HKChargesLedgerHeader from '../Components/HKChargesLedgerHeader'
import HKChargesFilterSection from '../Components/HKChargesFilterSection'
import HKChargesTransactionTable from '../Components/HKChargesTransactionTable'
import HKChargesSummarySection from '../Components/HKChargesSummarySection'
import { hkChargesLedgerData } from '../data/hkChargesLedgerData'

const HKChargesLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLedgerData()
  }, [])

  const loadLedgerData = () => {
    try {
      setLoading(true)
      // Simulate API call - In production, fetch from backend
      setTimeout(() => {
        setLedgerData(hkChargesLedgerData)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('❌ Error loading HK Charges ledger:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HK Charges Ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600">Unable to load HK Charges ledger data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <HKChargesLedgerHeader ledgerInfo={ledgerData.headerInfo} />
        <HKChargesFilterSection />
        <HKChargesTransactionTable transactions={ledgerData.ledgerDetails.entries} />
        <HKChargesSummarySection
          summary={ledgerData.headerInfo}
          ledgerDetails={ledgerData.ledgerDetails}
        />
      </div>
    </div>
  )
}

export default HKChargesLedgerPage
