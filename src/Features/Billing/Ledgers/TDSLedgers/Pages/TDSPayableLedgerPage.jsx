// TDS Payable Ledger Page
import React, { useState, useEffect } from 'react'
import TDSPayableLedgerHeader from '../Components/TDSPayableLedgerHeader'
import HKChargesFilterSection from '../../HouseKeepingCharges/Components/HKChargesFilterSection'
import TDSTransactionTable from '../Components/TDSTransactionTable'
import TDSSummaryFooter from '../Components/TDSSummaryFooter'
import { tdsPayableLedgerData } from '../data/tdsPayableLedgerData'

const TDSPayableLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLedgerData()
  }, [])

  const loadLedgerData = () => {
    try {
      setLoading(true)
      setTimeout(() => {
        setLedgerData(tdsPayableLedgerData)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('❌ Error loading TDS ledger:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading TDS Ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600">Unable to load TDS ledger data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <TDSPayableLedgerHeader ledgerInfo={ledgerData.headerInfo} />
        <HKChargesFilterSection />
        <TDSTransactionTable transactions={ledgerData.ledgerDetails.entries} />
        <TDSSummaryFooter
          summary={ledgerData.headerInfo}
          ledgerDetails={ledgerData.ledgerDetails}
        />
      </div>
    </div>
  )
}

export default TDSPayableLedgerPage
