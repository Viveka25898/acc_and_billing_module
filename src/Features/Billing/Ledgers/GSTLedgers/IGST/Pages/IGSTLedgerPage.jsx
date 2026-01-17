// IGST Payable Ledger Page
import React, { useState, useEffect } from 'react'
import IGSTLedgerHeader from '../Components/IGSTLedgerHeader'
import HKChargesFilterSection from '../../../HouseKeepingCharges/Components/HKChargesFilterSection'
import CGSTTransactionTable from '../../CGST/Components/CGSTTransactionTable'
import CGSTSummaryFooter from '../../CGST/Components/CGSTSummaryFooter'
import { igstLedgerData } from '../data/igstLedgerData'

const IGSTLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLedgerData()
  }, [])

  const loadLedgerData = () => {
    try {
      setLoading(true)
      setTimeout(() => {
        setLedgerData(igstLedgerData)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('❌ Error loading IGST ledger:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading IGST Ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600">Unable to load IGST ledger data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <IGSTLedgerHeader ledgerInfo={ledgerData.headerInfo} />
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

export default IGSTLedgerPage
