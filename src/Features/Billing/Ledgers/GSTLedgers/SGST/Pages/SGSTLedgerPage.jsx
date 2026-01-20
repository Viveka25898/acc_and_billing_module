// SGST Payable Ledger Page
import React, { useState, useEffect } from 'react'
import SGSTLedgerHeader from '../Components/SGSTLedgerHeader'
import HKChargesFilterSection from '../../../HouseKeepingCharges/Components/HKChargesFilterSection'
import CGSTTransactionTable from '../../CGST/Components/CGSTTransactionTable'
import CGSTSummaryFooter from '../../CGST/Components/CGSTSummaryFooter'
import { GSTLedgerService } from '../../../../Services/GSTLedgerService'

const SGSTLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLedgerData()
  }, [])

  const loadLedgerData = async () => {
    try {
      setLoading(true)
      setError(null)

      await new Promise((resolve) => setTimeout(resolve, 500))

      const glCode = 'L3002' // SGST PAYABLE
      const data = GSTLedgerService.getGSTLedgerWithTransactions(glCode)

      if (!data || data.error) {
        throw new Error(data?.error || 'Failed to load SGST ledger data')
      }

      // Helper function to format currency
      const formatCurrency = (amount) => {
        return `₹${Number(amount || 0).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      }

      const transformedData = {
        headerInfo: {
          ledgerName: data.ledgerName,
          glAccountCode: data.glCode,
          accountName: data.accountName,
          financialYear: data.financialYear,
          period: data.period,
          ledgerType: data.ledgerType,
          category: data.category,
          gstType: data.gstType,
          rate: data.rate,
          openingBalance: formatCurrency(data.openingBalance),
          currentBalance: formatCurrency(data.currentBalance),
          balanceType: data.balanceType,
        },
        ledgerDetails: {
          openingBalance: data.openingBalance,
          currentBalance: data.currentBalance,
          balanceType: data.balanceType,
          totalDebit: data.totalDebit,
          totalCredit: data.totalCredit,
          outstandingLiability: data.outstandingLiability,
          entries: data.entries.map((entry) => ({
            date: new Date(entry.date).toLocaleDateString('en-GB'),
            voucher: entry.voucherNo,
            voucherNo: entry.voucherNo,
            narration: entry.description,
            entryType: entry.voucherType || 'Journal',
            counterparty: entry.customer || '-',
            refNo: entry.invoiceNumber,
            invoiceNo: entry.invoiceNumber || '-',
            debit: entry.debit,
            credit: entry.credit,
            balance: entry.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            gstRate: '9%',
            taxableAmount: '-',
            siteLocation: entry.costCenter || 'HEAD OFFICE',
            status: entry.status || 'Posted',
            attachments: 0,
          })),
        },
        summary: {
          totalCredit: formatCurrency(data.totalCredit),
          totalDebit: formatCurrency(data.totalDebit),
          outstandingLiability: formatCurrency(data.outstandingLiability),
          transactionCount: data.entries.length,
          avgTransactionValue: formatCurrency(
            data.entries.length > 0 ? data.totalCredit / data.entries.length : 0
          ),
        },
      }

      setLedgerData(transformedData)
      setLoading(false)
    } catch (err) {
      console.error('❌ Error loading SGST ledger:', err)
      setError('Failed to load SGST ledger data. Please try again.')
      setLedgerData(null)
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
          <p className="text-gray-600">{error || 'Unable to load SGST ledger data.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
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
