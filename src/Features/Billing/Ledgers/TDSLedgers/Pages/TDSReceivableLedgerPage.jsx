// TDS Receivable Ledger Page
import React, { useState, useEffect } from 'react'
import TDSReceivableLedgerHeader from '../Components/TDSReceivableLedgerHeader'
import HKChargesFilterSection from '../../HouseKeepingCharges/Components/HKChargesFilterSection'
import TDSReceivableTransactionTable from '../Components/TDSReceivableTransactionTable'
import TDSReceivableSummaryFooter from '../Components/TDSReceivableSummaryFooter'
import { tdsReceivableLedgerData } from '../data/tdsReceivableLedgerData'

const TDSReceivableLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLedgerData()
  }, [])

  const loadLedgerData = () => {
    try {
      setLoading(true)
      setTimeout(() => {
        setLedgerData(tdsReceivableLedgerData)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('❌ Error loading TDS Receivable ledger:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading TDS Receivable Ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600">Unable to load TDS Receivable ledger data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <TDSReceivableLedgerHeader ledgerInfo={ledgerData.headerInfo} />
        <HKChargesFilterSection />
        <TDSReceivableTransactionTable transactions={ledgerData.ledgerDetails.entries} />
        <TDSReceivableSummaryFooter
          summary={ledgerData.headerInfo}
          ledgerDetails={ledgerData.ledgerDetails}
        />
      </div>
    </div>
  )
}

export default TDSReceivableLedgerPage
