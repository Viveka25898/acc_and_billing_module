// Round Off Revenue Ledger Page - R2001001
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RevenueLedgerHeader from '../Components/RevenueLedgerHeader'
import RevenueLedgerFilter from '../Components/RevenueLedgerFilter'
import RevenueLedgerTable from '../Components/RevenueLedgerTable'
import RevenueLedgerFooter from '../Components/RevenueLedgerFooter'
import { RevenueLedgerService } from '../../../../../Features/Billing/Services/RevenueLedgerService'

const RoundOffRevenueLedgerPage = () => {
  const { accountCode } = useParams()
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLedgerData()
  }, [accountCode])

  const loadLedgerData = async () => {
    try {
      setLoading(true)
      setError(null)

      await new Promise((resolve) => setTimeout(resolve, 300))

      const glCode = accountCode || 'R2001001'
      const data = RevenueLedgerService.getRevenueLedgerWithTransactions(glCode)

      if (!data || data.error) {
        throw new Error(data?.error || 'Failed to load round off ledger data')
      }

      const formatCurrency = (amount) => {
        return `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
          gstApplicable: data.gstApplicable,
        },
        ledgerDetails: {
          openingBalance: data.openingBalance,
          currentBalance: data.currentBalance,
          balanceType: data.balanceType,
          totalDebit: data.totalDebit,
          totalCredit: data.totalCredit,
          netRevenue: data.netRevenue,
          entries: data.entries.map((entry) => ({
            id: entry.transactionId || entry.voucherNo,
            date: new Date(entry.date).toLocaleDateString('en-GB'),
            voucher: entry.voucherNo,
            narration: entry.description,
            entryType: entry.voucherType,
            counterparty: entry.customer,
            refNo: entry.invoiceNumber,
            debit: entry.debit ? formatCurrency(entry.debit) : '-',
            credit: entry.credit ? formatCurrency(entry.credit) : '-',
            balance: formatCurrency(entry.balance),
            type: entry.voucherType || 'Sales Invoice',
            approvedBy: entry.createdBy || 'System',
            attachments: entry.irnNumber && entry.irnNumber !== '-' ? 1 : 0,
            costCenter: entry.costCenter || '-',
            customer: entry.customer || '-',
            site: entry.site || '-',
            state: entry.state || '-',
          })),
        },
        summary: {
          totalCredit: formatCurrency(data.totalCredit),
          totalDebit: formatCurrency(data.totalDebit),
          netRevenue: formatCurrency(data.netRevenue),
          transactionCount: data.entries.length,
          avgTransactionValue: formatCurrency(
            data.entries.length > 0 ? data.totalCredit / data.entries.length : 0
          ),
        },
      }

      setLedgerData(transformedData)
      setFilteredTransactions(transformedData.ledgerDetails.entries || [])
      setLoading(false)
    } catch (err) {
      console.error('❌ Error loading round off ledger:', err)
      setError('Failed to load round off ledger data. Please try again.')
      setLedgerData(null)
      setLoading(false)
    }
  }

  const handleFilterChange = (filters) => {
    try {
      if (!ledgerData) return

      let filtered = [...ledgerData.ledgerDetails.entries]

      if (filters.entryType && filters.entryType !== 'All') {
        filtered = filtered.filter((entry) => entry.entryType === filters.entryType)
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        filtered = filtered.filter(
          (entry) =>
            entry.voucher.toLowerCase().includes(searchLower) ||
            entry.narration.toLowerCase().includes(searchLower) ||
            entry.refNo.toLowerCase().includes(searchLower) ||
            entry.counterparty.toLowerCase().includes(searchLower)
        )
      }

      if (filters.fromDate && filters.toDate) {
        filtered = filtered.filter((entry) => {
          const entryDate = new Date(entry.date.split('-').reverse().join('-'))
          const fromDate = new Date(filters.fromDate)
          const toDate = new Date(filters.toDate)
          return entryDate >= fromDate && entryDate <= toDate
        })
      }

      setFilteredTransactions(filtered)
    } catch (err) {
      console.error('❌ Error applying filters:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Round Off Ledger...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 mb-4">Error loading ledger</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Ledger</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadLedgerData} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600 mt-2">
            Unable to load round off ledger data for {accountCode}.
          </p>
          <button
            onClick={loadLedgerData}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <RevenueLedgerHeader ledgerInfo={ledgerData.headerInfo} />
        <RevenueLedgerFilter onFilterChange={handleFilterChange} />
        <RevenueLedgerTable transactions={filteredTransactions} />
        <RevenueLedgerFooter
          summary={ledgerData.summary}
          ledgerDetails={ledgerData.ledgerDetails}
        />
      </div>
    </div>
  )
}

export default RoundOffRevenueLedgerPage
