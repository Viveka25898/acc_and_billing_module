import React, { useState, useMemo, useEffect } from 'react'
import { HKMaterialsExpenseLedgerService } from '../utils/hkMaterialExpenseLedgerService'

const HKMaterialsExpenseLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    entryType: '',
    vendorName: '',
  })
  const [showVendorSummary, setShowVendorSummary] = useState(false)

  useEffect(() => {
    const loadLedgerData = () => {
      try {
        setLoading(true)
        console.log('🔍 Loading HK Materials Expense ledger...')

        const accountDetails = HKMaterialsExpenseLedgerService.getAccountDetails()
        const entries = HKMaterialsExpenseLedgerService.getExpenseLedgerEntries()
        const vendorSummary = HKMaterialsExpenseLedgerService.getVendorWiseSummary()

        setLedgerData({
          accountDetails,
          entries,
          vendorSummary,
        })
      } catch (err) {
        console.error('❌ Error loading expense ledger:', err)
      } finally {
        setLoading(false)
      }
    }

    loadLedgerData()
  }, [])

  const filteredEntries = useMemo(() => {
    if (!ledgerData?.entries) return []

    return ledgerData.entries.filter((entry) => {
      const entryDate = entry.originalDate
        ? new Date(entry.originalDate)
        : HKMaterialsExpenseLedgerService.parseDate(entry.date)
      const from = filters.fromDate ? new Date(filters.fromDate) : null
      const to = filters.toDate ? new Date(filters.toDate) : null

      const withinRange =
        (!from || !entryDate || entryDate >= from) && (!to || !entryDate || entryDate <= to)

      const matchesType = !filters.entryType || entry.entryType === filters.entryType
      const matchesVendor =
        !filters.vendorName ||
        entry.vendorName.toLowerCase().includes(filters.vendorName.toLowerCase())

      return withinRange && matchesType && matchesVendor
    })
  }, [ledgerData, filters])

  const totals = useMemo(() => {
    if (!filteredEntries || filteredEntries.length === 0) {
      return {
        totalDebit: '0.00',
        totalCredit: '0.00',
        closingBalance: '0.00 DR',
      }
    }

    let totalDebit = 0
    let totalCredit = 0

    filteredEntries.forEach((e) => {
      const debitVal = e.debit !== '-' ? parseFloat(e.debit.replace(/,/g, '')) : 0
      const creditVal = e.credit !== '-' ? parseFloat(e.credit.replace(/,/g, '')) : 0
      totalDebit += debitVal
      totalCredit += creditVal
    })

    const closingBalance = totalDebit - totalCredit
    const balanceType = closingBalance >= 0 ? 'DR' : 'CR'

    return {
      totalDebit: totalDebit.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalCredit: totalCredit.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      closingBalance: `${Math.abs(closingBalance).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${balanceType}`,
    }
  }, [filteredEntries])

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    const csvContent = [
      [
        'Date',
        'Voucher No',
        'Type',
        'Particulars',
        'Vendor',
        'Invoice No',
        'Debit',
        'Credit',
        'Balance',
      ],
      ...filteredEntries.map((e) => [
        e.date,
        e.voucherNo,
        e.entryType,
        e.particulars,
        e.vendorName,
        e.invoiceNumber,
        e.debit,
        e.credit,
        e.balance,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `HK_Materials_Expense_Ledger_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HK Materials Expense ledger...</p>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">Expense Ledger Not Found</h2>
          <p className="text-gray-600">No expense data found for HK Materials</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 md:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">HK Materials Expense Ledger</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="opacity-80">GL Code:</span>
                    <span className="ml-2 font-semibold">
                      {ledgerData.accountDetails.accountCode}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-80">Account:</span>
                    <span className="ml-2 font-semibold">
                      {ledgerData.accountDetails.accountName}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-80">Type:</span>
                    <span className="ml-2 font-semibold">
                      {ledgerData.accountDetails.accountType}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-3xl font-bold">
                  ₹{ledgerData.accountDetails.balanceAmount?.toLocaleString('en-IN') || '0'}
                </div>
                <div className="text-sm opacity-90">
                  Current Balance ({ledgerData.accountDetails.balanceType})
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-gray-600 text-sm mb-1">Total Expenses</div>
              <div className="text-xl font-bold text-blue-600">
                {ledgerData.accountDetails.summary?.totalExpenses || '₹0'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-gray-600 text-sm mb-1">Total Reversals</div>
              <div className="text-xl font-bold text-red-600">
                {ledgerData.accountDetails.summary?.totalReversals || '₹0'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-gray-600 text-sm mb-1">Net Expense</div>
              <div className="text-xl font-bold text-green-600">
                {ledgerData.accountDetails.summary?.netExpense || '₹0'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-gray-600 text-sm mb-1">Transactions</div>
              <div className="text-xl font-bold text-purple-600">
                {ledgerData.accountDetails.summary?.transactionCount || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filters & Actions</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowVendorSummary(!showVendorSummary)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {showVendorSummary ? '📊 Hide' : '📊 Vendor Summary'}
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📥 Export CSV
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🖨️ Print
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
              <select
                value={filters.entryType}
                onChange={(e) => setFilters({ ...filters, entryType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="Expense">Expense</option>
                <option value="Reversal">Reversal</option>
                <option value="Journal">Journal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
              <input
                type="text"
                value={filters.vendorName}
                onChange={(e) => setFilters({ ...filters, vendorName: e.target.value })}
                placeholder="Search vendor..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {(filters.fromDate || filters.toDate || filters.entryType || filters.vendorName) && (
            <button
              onClick={() =>
                setFilters({ fromDate: '', toDate: '', entryType: '', vendorName: '' })
              }
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Vendor Summary Section */}
        {showVendorSummary && ledgerData.vendorSummary && (
          <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Vendor-wise Expense Summary
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Vendor Name
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Total Expense
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Transactions
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Invoices
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ledgerData.vendorSummary.map((vendor, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{vendor.vendorName}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
                        ₹{vendor.totalExpense.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">{vendor.transactionCount}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600">
                        {vendor.invoices.length > 0 ? vendor.invoices.join(', ') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ledger Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Voucher No
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Particulars
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Vendor
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Invoice No
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Debit
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Credit
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Balance
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Cost Center
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Customer
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Site
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    State
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition-colors">
                      <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {entry.date}
                      </td>
                      <td className="px-3 py-3 text-sm text-blue-600 font-mono">
                        {entry.voucherNo}
                      </td>
                      <td className="px-3 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            entry.entryType === 'Expense'
                              ? 'bg-blue-100 text-blue-800'
                              : entry.entryType === 'Reversal'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {entry.entryType}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">{entry.particulars}</td>
                      <td className="px-3 py-3 text-sm text-gray-700">{entry.vendorName}</td>
                      <td className="px-3 py-3 text-sm text-gray-600">{entry.invoiceNumber}</td>
                      <td className="px-3 py-3 text-sm text-right font-semibold text-green-600">
                        {entry.debit !== '-' ? `₹${entry.debit}` : '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-right font-semibold text-red-600">
                        {entry.credit !== '-' ? `₹${entry.credit}` : '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-right font-bold text-blue-700">
                        ₹{entry.balance}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {entry.costCenter || '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {entry.customer || '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {entry.site || '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {entry.state || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="px-3 py-8 text-center text-gray-500">
                      No transactions found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredEntries.length > 0 && (
                <tfoot className="bg-gradient-to-r from-gray-100 to-gray-200 font-bold">
                  <tr>
                    <td
                      colSpan="6"
                      className="px-3 py-4 text-right text-sm text-gray-800 uppercase"
                    >
                      Total:
                    </td>
                    <td className="px-3 py-4 text-right text-sm text-green-700">
                      ₹{totals.totalDebit}
                    </td>
                    <td className="px-3 py-4 text-right text-sm text-red-700">
                      ₹{totals.totalCredit}
                    </td>
                    <td className="px-3 py-4 text-right text-sm text-blue-800">
                      ₹{totals.closingBalance}
                    </td>
                    <td colSpan="4" className="px-3 py-4"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Showing {filteredEntries.length} of {ledgerData.entries.length} transactions
          </p>
          <p className="mt-1">Generated on {new Date().toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  )
}

export default HKMaterialsExpenseLedgerPage
