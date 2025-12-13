/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { FiChevronDown, FiChevronRight, FiEye, FiDownload, FiFilter } from 'react-icons/fi'

const LedgerTableLeaveProvision = ({ ledgerData, filters, actuarialAssumptions }) => {
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })

  const toggleRowExpand = (id) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const formatCurrency = (amount) => {
    if (!amount || amount === '-') return amount
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(parseFloat(amount.replace(/,/g, '')))
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Leave Provision Ledger Details</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
            <FiFilter /> Advanced Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            <FiDownload /> Export Details
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Voucher Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Employee Stats
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Debit (Provision)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Credit (Reversal)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Running Balance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledgerData.map((row) => {
              if (row.isHeader) {
                return (
                  <tr key={row.id} className="bg-amber-50">
                    <td colSpan="7" className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiChevronDown className="w-4 h-4" />
                          <span className="font-bold text-amber-800">{row.month}</span>
                          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                            {row.financialPeriod}
                          </span>
                        </div>
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          View Month Details
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }

              return (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">{row.date}</div>
                      <div className="text-xs text-gray-500">{row.postingDate}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">
                        {row.voucherNo} - {row.voucherType}
                      </div>
                      <div className="text-gray-600 mt-1">{row.particulars}</div>
                      {row.details && (
                        <div className="text-xs text-gray-500 mt-1">{row.details}</div>
                      )}
                      <div className="text-xs text-blue-600 mt-1">{row.journalRef}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-gray-500">Employees</div>
                          <div className="font-medium">{row.employeeCount}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Leave Days</div>
                          <div className="font-medium">{row.leaveDays}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {row.debit !== '-' && (
                        <div className="font-bold text-red-600">{formatCurrency(row.debit)}</div>
                      )}
                      {row.debit === '-' && <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {row.credit !== '-' && (
                        <div className="font-bold text-green-600">{formatCurrency(row.credit)}</div>
                      )}
                      {row.credit === '-' && <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-bold text-blue-700">
                        {formatCurrency(row.runningBalance)}
                      </div>
                      <div className="text-xs text-gray-500">{row.status}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => toggleRowExpand(row.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <FiEye className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row Details */}
                  {expandedRows.has(row.id) && (
                    <tr className="bg-blue-50">
                      <td colSpan="7" className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-bold text-sm mb-2">Transaction Details</h4>
                            <div className="text-xs space-y-1">
                              <div>
                                <span className="font-medium">Cost Center:</span> {row.costCenter}
                              </div>
                              <div>
                                <span className="font-medium">Approved By:</span> {row.approvedBy}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                  {row.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm mb-2">Calculation Basis</h4>
                            {row.actuarialReference && (
                              <div className="text-xs space-y-1">
                                <div>
                                  <span className="font-medium">Actuarial Ref:</span>{' '}
                                  {row.actuarialReference}
                                </div>
                                <div>
                                  <span className="font-medium">Provision Rate:</span>{' '}
                                  {row.provisionRate}
                                </div>
                                <div>
                                  <span className="font-medium">Basis:</span> {row.calculationBasis}
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm mb-2">Compliance Info</h4>
                            <div className="text-xs">
                              <div className="mb-2">
                                <span className="font-medium">Accounting Standard:</span> AS 15
                              </div>
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200">
                                  View Journal
                                </button>
                                <button className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200">
                                  Download Attachment
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Actuarial Assumptions Panel */}
    </div>
  )
}

export default LedgerTableLeaveProvision
