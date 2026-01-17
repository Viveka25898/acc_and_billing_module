// CGST Payable Ledger Page
import React, { useState, useEffect } from 'react'
import CGSTLedgerHeader from '../Components/CGSTLedgerHeader'
import HKChargesFilterSection from '../../../HouseKeepingCharges/Components/HKChargesFilterSection'
import CGSTTransactionTable from '../Components/CGSTTransactionTable'
import CGSTSummaryFooter from '../Components/CGSTSummaryFooter'
import { cgstLedgerData } from '../data/cgstLedgerData'

const CGSTLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLedgerData()
  }, [])

  const loadLedgerData = () => {
    try {
      setLoading(true)
      setTimeout(() => {
        setLedgerData(cgstLedgerData)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('❌ Error loading CGST ledger:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CGST Ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600">Unable to load CGST ledger data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <CGSTLedgerHeader ledgerInfo={ledgerData.headerInfo} />
        <HKChargesFilterSection />
        <CGSTTransactionTable transactions={ledgerData.ledgerDetails.entries} />
        <CGSTSummaryFooter
          summary={ledgerData.headerInfo}
          ledgerDetails={ledgerData.ledgerDetails}
        />
      </div>
    </div>
  )
}

export default CGSTLedgerPage
