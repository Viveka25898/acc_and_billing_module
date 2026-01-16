// SGST Payable Ledger Page
import React, { useState, useEffect } from 'react'
import SGSTLedgerHeader from '../Components/SGSTLedgerHeader'
import HKChargesFilterSection from '../../../HouseKeepingCharges/Components/HKChargesFilterSection'
import CGSTTransactionTable from '../../CGST/Components/CGSTTransactionTable'
import CGSTSummaryFooter from '../../CGST/Components/CGSTSummaryFooter'
import { sgstLedgerData } from '../data/sgstLedgerData'

const SGSTLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLedgerData()
  }, [])

  const loadLedgerData = () => {
    try {
      setLoading(true)
      setTimeout(() => {
        setLedgerData(sgstLedgerData)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('❌ Error loading SGST ledger:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading SGST Ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600">Unable to load SGST ledger data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <SGSTLedgerHeader ledgerInfo={ledgerData.headerInfo} />
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

export default SGSTLedgerPage
