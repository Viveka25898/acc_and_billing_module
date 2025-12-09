import React, { useState, useMemo } from 'react'
import { esicPayableData } from '../data/esicPayableData'
import ESICPayableHeader from '../Component/ESICPayableHeader'
import ESICPayableFilterBar from '../Component/ESICPayableFilterBar'
import ESICPayableLedgerTable from '../Component/ESICPayableLedgerTable'
import ESICPayableFooter from '../Component/ESICPayableFooter'

const ESICPayableLedgerPage = () => {
  const [filters, setFilters] = useState({
    month: 'All',
    paymentStatus: 'All',
    voucherType: 'All',
    showOnly: 'all',
    minWages: '',
    maxWages: '',
    challanSearch: '',
  })

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return esicPayableData.transactions.filter((transaction) => {
      // Month filter
      if (filters.month !== 'All' && transaction.esicMonth !== filters.month) return false

      // Payment Status filter
      if (filters.paymentStatus !== 'All' && transaction.paymentStatus !== filters.paymentStatus)
        return false

      // Voucher Type filter
      if (filters.voucherType !== 'All' && transaction.voucherType !== filters.voucherType)
        return false

      // Show Only filter
      if (filters.showOnly === 'credit' && transaction.credit === '-') return false
      if (filters.showOnly === 'debit' && transaction.debit === '-') return false

      // ESI Wages range filter
      if (filters.minWages && transaction.esiWages !== '-') {
        const esiWages = parseInt(transaction.esiWages.replace(/[^0-9]/g, '') || '0')
        if (esiWages < parseInt(filters.minWages)) return false
      }

      if (filters.maxWages && transaction.esiWages !== '-') {
        const esiWages = parseInt(transaction.esiWages.replace(/[^0-9]/g, '') || '0')
        if (esiWages > parseInt(filters.maxWages)) return false
      }

      // Challan/TRRN search filter
      if (
        filters.challanSearch &&
        !transaction.trrnNo.toLowerCase().includes(filters.challanSearch.toLowerCase()) &&
        !transaction.esicChallanNo.toLowerCase().includes(filters.challanSearch.toLowerCase())
      )
        return false

      return true
    })
  }, [filters])

  // Calculate summary statistics
  const calculateSummary = useMemo(() => {
    const totalDebit = filteredTransactions.reduce(
      (sum, t) => sum + parseInt(t.debit.replace(/[^0-9]/g, '') || 0),
      0
    )

    const totalCredit = filteredTransactions.reduce(
      (sum, t) => sum + parseInt(t.credit.replace(/[^0-9]/g, '') || 0),
      0
    )

    // Calculate pending liabilities (credit entries that haven't been paid)
    const pendingTransactions = filteredTransactions.filter(
      (t) => t.paymentStatus === 'Accrued' || t.paymentStatus === 'Overdue'
    )
    const pendingLiabilities = pendingTransactions.reduce(
      (sum, t) => sum + parseInt(t.credit.replace(/[^0-9]/g, '') || 0),
      0
    )

    // Calculate penalties
    const penaltyTransactions = filteredTransactions.filter(
      (t) =>
        t.paymentStatus === 'Late Paid' ||
        (t.penaltyAmount && t.penaltyAmount !== '-' && t.penaltyAmount !== '₹ 0')
    )
    const penaltiesIncurred = penaltyTransactions.reduce(
      (sum, t) => sum + parseInt(t.penaltyAmount?.replace(/[^0-9]/g, '') || 0),
      0
    )

    return {
      totalDebit,
      totalCredit,
      pendingLiabilities,
      penaltiesIncurred,
    }
  }, [filteredTransactions])

  // Get closing balance from the last transaction
  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[filteredTransactions.length - 1].balance
      : '₹ 0.00'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <ESICPayableHeader
          accountInfo={esicPayableData.accountInfo}
          complianceInfo={esicPayableData.complianceInfo}
          journalEntries={esicPayableData.journalEntries}
        />

        <ESICPayableFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          months={esicPayableData.months}
          paymentStatuses={esicPayableData.paymentStatuses}
          voucherTypes={esicPayableData.voucherTypes}
        />

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              ESIC Payable Transactions ({filteredTransactions.length} records)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Liability account showing amounts payable to ESIC @ 3.25% of ESI wages
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setFilters({
                  month: 'All',
                  paymentStatus: 'All',
                  voucherType: 'All',
                  showOnly: 'all',
                  minWages: '',
                  maxWages: '',
                  challanSearch: '',
                })
              }
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All Filters
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Add ESIC Liability Entry
            </button>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <ESICPayableLedgerTable transactions={filteredTransactions} />
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No ESIC payable transactions found.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
          </div>
        )}

        <ESICPayableFooter
          closingBalance={closingBalance}
          totalTransactions={filteredTransactions.length}
          totalDebit={calculateSummary.totalDebit}
          totalCredit={calculateSummary.totalCredit}
          pendingLiabilities={calculateSummary.pendingLiabilities}
          penaltiesIncurred={calculateSummary.penaltiesIncurred}
          complianceInfo={esicPayableData.complianceInfo}
          journalEntries={esicPayableData.journalEntries}
        />
      </div>
    </div>
  )
}

export default ESICPayableLedgerPage
