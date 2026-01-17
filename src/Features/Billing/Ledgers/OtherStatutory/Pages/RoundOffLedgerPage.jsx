// Round Off Ledger Page
import React, { useState, useEffect } from 'react'
import RoundOffLedgerHeader from '../Components/RoundOffLedgerHeader'
import HKChargesFilterSection from '../../HouseKeepingCharges/Components/HKChargesFilterSection'
import RoundOffTransactionTable from '../Components/RoundOffTransactionTable'
import HKChargesSummarySection from '../../HouseKeepingCharges/Components/HKChargesSummarySection'
import { roundOffLedgerData } from '../data/roundOffLedgerData'

const RoundOffLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLedgerData()
  }, [])

  const loadLedgerData = () => {
    try {
      setLoading(true)
      setTimeout(() => {
        setLedgerData(roundOffLedgerData)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('❌ Error loading Round Off ledger:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Round Off Ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600">Unable to load Round Off ledger data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <RoundOffLedgerHeader ledgerInfo={ledgerData.headerInfo} />
        <HKChargesFilterSection />
        <RoundOffTransactionTable transactions={ledgerData.ledgerDetails.entries} />
        <HKChargesSummarySection
          summary={ledgerData.headerInfo}
          ledgerDetails={ledgerData.ledgerDetails}
        />
      </div>
    </div>
  )
}

export default RoundOffLedgerPage
