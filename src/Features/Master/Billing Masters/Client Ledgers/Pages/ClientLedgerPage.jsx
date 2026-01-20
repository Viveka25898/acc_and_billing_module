// Client Ledger Page - ABC Mall (D001)
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ClientLedgerHeader from '../Components/ClientLedgerHeader'
import ClientLedgerFilter from '../Components/ClientLedgerFilter'
import ClientLedgerTable from '../Components/ClientLedgerTable'
import ClientLedgerFooter from '../Components/ClientLedgerFooter'
import { ClientLedgerService } from '../../../../Billing/Services/ClientLedgerService'

const ClientLedgerPage = () => {
  const { clientCode } = useParams()
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filteredTransactions, setFilteredTransactions] = useState([])

  useEffect(() => {
    loadLedgerData()
  }, [clientCode])

  const loadLedgerData = () => {
    try {
      setLoading(true)

      // Load real ledger data using ClientLedgerService
      setTimeout(() => {
        const glCode = clientCode || 'D001'
        console.log('🔍 Loading client ledger for:', glCode)
        const data = ClientLedgerService.getClientLedgerWithTransactions(glCode)

        console.log('📊 Client Ledger Data:', data)

        if (!data || data.error) {
          console.error('❌ Error loading client ledger:', data?.error)
          setLedgerData(null)
          setFilteredTransactions([])
          setLoading(false)
          return
        }

        if (!data.entries || data.entries.length === 0) {
          console.warn('⚠️ No transactions found for client:', glCode)
        }

        // Helper function to format currency
        const formatCurrency = (amount) => {
          return `₹${Number(amount || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        }

        // Transform data to match expected format
        const transformedData = {
          headerInfo: {
            clientName: data.ledgerName,
            glAccountCode: data.glCode,
            accountName: data.accountName,
            branch: data.clientDetails?.branch || 'N/A',
            financialYear: data.financialYear,
            period: data.period,
            ledgerType: data.ledgerType,
            category: data.category,
          },
          ledgerDetails: {
            openingBalance: data.openingBalance,
            currentBalance: data.currentBalance,
            balanceType: data.balanceType,
            totalDebit: data.totalDebit,
            totalCredit: data.totalCredit,
            totalInvoices: data.entries.filter((e) => e.debit > 0).length,
            totalPayments: data.entries.filter((e) => e.credit > 0).length,
            currentOutstanding: formatCurrency(Math.abs(data.currentBalance)),
            entries: data.entries.map((entry) => ({
              date: new Date(entry.date).toLocaleDateString('en-GB'),
              voucherNo: entry.voucherNo,
              narration: entry.description,
              entryType: entry.voucherType,
              refNo: entry.invoiceNumber || entry.transactionId,
              debit: entry.debit,
              credit: entry.credit,
              balance: entry.balance,
            })),
          },
          summary: {
            totalDebit: formatCurrency(data.totalDebit),
            totalCredit: formatCurrency(data.totalCredit),
            closingBalance: formatCurrency(Math.abs(data.currentBalance)),
            netBalance: formatCurrency(Math.abs(data.currentBalance)),
            balanceType: data.balanceType,
            transactionCount: data.entries.length,
            avgTransactionValue: formatCurrency(
              data.entries.length > 0 ? data.totalDebit / data.entries.length : 0
            ),
            agingAnalysis: {
              current: formatCurrency(0),
              days_30: formatCurrency(0),
              days_60: formatCurrency(0),
              above_60: formatCurrency(0),
            },
          },
        }

        setLedgerData(transformedData)
        setFilteredTransactions(transformedData.ledgerDetails.entries)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('❌ Error loading client ledger:', error)
      setLedgerData(null)
      setLoading(false)
    }
  }

  const handleFilterChange = (filters) => {
    if (!ledgerData) return

    let filtered = [...ledgerData.ledgerDetails.entries]

    // Filter by entry type
    if (filters.entryType && filters.entryType !== 'All') {
      filtered = filtered.filter((entry) => entry.entryType === filters.entryType)
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.voucherNo.toLowerCase().includes(searchLower) ||
          entry.narration.toLowerCase().includes(searchLower) ||
          entry.refNo.toLowerCase().includes(searchLower)
      )
    }

    // Filter by date range
    if (filters.fromDate && filters.toDate) {
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.date.split('-').reverse().join('-'))
        const fromDate = new Date(filters.fromDate)
        const toDate = new Date(filters.toDate)
        return entryDate >= fromDate && entryDate <= toDate
      })
    }

    setFilteredTransactions(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Client Ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ledger Data Not Found</h2>
          <p className="text-gray-600">Unable to load client ledger data for {clientCode}.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <ClientLedgerHeader ledgerInfo={ledgerData.headerInfo} />
        <ClientLedgerFilter onFilterChange={handleFilterChange} />
        <ClientLedgerTable transactions={filteredTransactions} />
        <ClientLedgerFooter summary={ledgerData.summary} ledgerDetails={ledgerData.ledgerDetails} />
      </div>
    </div>
  )
}

export default ClientLedgerPage
