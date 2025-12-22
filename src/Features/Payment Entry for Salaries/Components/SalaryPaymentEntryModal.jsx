/* eslint-disable no-unused-vars */
import React from 'react'
import {
  FaFileAlt,
  FaTag,
  FaTimes,
  FaBriefcase,
  FaChartLine,
  FaClock,
  FaCheck,
  FaUsers,
  FaMoneyCheckAlt,
} from 'react-icons/fa'

const SalaryPaymentEntryModal = ({ isOpen, onClose, onConfirm, batchData, approvedBatches }) => {
  if (!isOpen) return null

  // Determine if this is single or multiple batches
  const isMultipleBatches = approvedBatches && approvedBatches.length > 0
  const batches = isMultipleBatches ? approvedBatches : batchData ? [batchData] : []

  if (batches.length === 0) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-IN')
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  // Generate GL entries for all approved batches - USING REAL GL CODES
  const generateAllGLEntries = (batches) => {
    const glEntries = []
    let totalAmount = 0

    batches.forEach((batch, index) => {
      const amount = parseFloat(batch.totalSalary || batch.totalAmount)
      totalAmount += amount

      // Debit entry for Salary Payable (liability reduction)
      glEntries.push({
        glCode: 'L2002001',
        glDescription: `SALARY PAYABLE - ${batch.batchId || batch.id}`,
        costCenter: 'HEAD OFFICE',
        department: 'Payroll',
        debitAmount: amount,
        creditAmount: 0,
        batchId: batch.batchId || batch.id,
        narration: `Net Salary Paid - ${batch.employeeCount} employees`,
      })
    })

    // Single credit entry for Punjab Bank account
    glEntries.push({
      glCode: 'A3004001002',
      glDescription: 'Punjab Bank',
      costCenter: 'HEAD OFFICE',
      department: 'Payroll',
      debitAmount: 0,
      creditAmount: totalAmount,
      batchId: null,
      narration: 'Salary payment via Punjab Bank',
    })

    return glEntries
  }

  const glEntries = generateAllGLEntries(batches)
  const totalAmount = batches.reduce(
    (sum, batch) => sum + parseFloat(batch.totalSalary || batch.totalAmount),
    0
  )
  const totalEmployees = batches.reduce(
    (sum, batch) => sum + (batch.employeeCount || batch.employeeDetails?.length || 0),
    0
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-green-500">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                {isMultipleBatches ? (
                  <>
                    <FaUsers className="text-green-600" />
                    Multiple Salary Batches - Approved
                  </>
                ) : (
                  <>
                    <FaMoneyCheckAlt className="text-green-600" />
                    Salary Payment Batch - Approved
                  </>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                {isMultipleBatches
                  ? `Batch Payment Entry - ${batches.length} salary batches processed`
                  : `Batch ID: ${batches[0].id} | Period: ${batches[0].payrollPeriod}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close Modal"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Batch Summary */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUsers className="text-green-600" size={20} />
                  Payment Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Batches:</span>
                    <span className="font-medium">{batches.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Employees:</span>
                    <span className="font-medium">{totalEmployees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-lg">₹ {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date:</span>
                    <span className="font-medium">{formatDate()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{batches[0].bankFile?.TYPE || 'NEFT'}</span>
                  </div>
                </div>
              </div>

              {/* Batch Details Table */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaFileAlt className="text-green-600" size={20} />
                  Batch Details
                </h2>
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="text-left p-2 border">Batch ID</th>
                        <th className="text-left p-2 border">Submitted By</th>
                        <th className="text-center p-2 border">Employees</th>
                        <th className="text-right p-2 border">Amount</th>
                        <th className="text-left p-2 border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map((batch, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 border font-medium">{batch.batchId || batch.id}</td>
                          <td className="p-2 border">{batch.submittedBy || 'Payroll Team'}</td>
                          <td className="p-2 border text-center">
                            {batch.employeeCount || batch.employeeDetails?.length || 0}
                          </td>
                          <td className="p-2 border text-right font-medium">
                            ₹ {parseFloat(batch.totalSalary || batch.totalAmount).toLocaleString()}
                          </td>
                          <td className="p-2 border text-xs">
                            <span className={`px-2 py-1 rounded ${getStatusColor(batch.status)}`}>
                              {batch.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <td colSpan="3" className="p-2 border font-bold">
                          TOTAL
                        </td>
                        <td className="p-2 border text-right font-bold">
                          ₹ {totalAmount.toLocaleString()}
                        </td>
                        <td className="p-2 border"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* GL Entries Table */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTag className="text-green-600" size={20} />
                  GL Entries & Accounting
                </h2>
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-1 text-xs font-semibold text-gray-700">
                          GL Code
                        </th>
                        <th className="text-left py-2 px-1 text-xs font-semibold text-gray-700">
                          Description
                        </th>
                        <th className="text-left py-2 px-1 text-xs font-semibold text-gray-700">
                          Narration
                        </th>
                        <th className="text-right py-2 px-1 text-xs font-semibold text-gray-700">
                          Debit
                        </th>
                        <th className="text-right py-2 px-1 text-xs font-semibold text-gray-700">
                          Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {glEntries.map((entry, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-2 px-1 text-xs font-medium text-green-700">
                            {entry.glCode}
                          </td>
                          <td className="py-2 px-1 text-xs">{entry.glDescription}</td>
                          <td className="py-2 px-1 text-xs text-gray-600">{entry.narration}</td>
                          <td className="py-2 px-1 text-xs text-right font-medium">
                            {entry.debitAmount > 0
                              ? `₹ ${entry.debitAmount.toLocaleString()}`
                              : '-'}
                          </td>
                          <td className="py-2 px-1 text-xs text-right font-medium">
                            {entry.creditAmount > 0
                              ? `₹ ${entry.creditAmount.toLocaleString()}`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr className="border-t-2 border-gray-400">
                        <td colSpan="3" className="py-2 px-1 text-xs font-bold text-gray-800">
                          TOTALS
                        </td>
                        <td className="py-2 px-1 text-xs font-bold text-right">
                          ₹{' '}
                          {glEntries
                            .reduce((sum, entry) => sum + entry.debitAmount, 0)
                            .toLocaleString()}
                        </td>
                        <td className="py-2 px-1 text-xs font-bold text-right">
                          ₹{' '}
                          {glEntries
                            .reduce((sum, entry) => sum + entry.creditAmount, 0)
                            .toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Payment Details */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMoneyCheckAlt className="text-green-600" size={20} />
                  Bank Transfer Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Type:</span>
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Debit GL Code:</span>
                    <span className="font-medium text-sm">L2002001 (SALARY PAYABLE)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credit GL Code:</span>
                    <span className="font-medium text-sm">A3004001002 (Punjab Bank)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium">INR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="font-medium">₹ 0</span>
                  </div>
                  <hr className="border-green-300" />
                  <div className="flex justify-between text-lg font-bold text-green-800">
                    <span>Net Amount:</span>
                    <span>₹ {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Processing Workflow */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaChartLine className="text-green-600" size={20} />
                  Processing Workflow
                </h2>
                <div className="space-y-4">
                  {/* Payroll Generation */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheck className="text-green-600" size={14} />
                      <span className="font-semibold text-green-700">Payroll Generated</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Batches: {batches.length}</div>
                      <div>Total Employees: {totalEmployees}</div>
                      <div>Generated by: Payroll Team</div>
                    </div>
                  </div>

                  {/* AE Approval */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheck className="text-green-600" size={14} />
                      <span className="font-semibold text-green-700">
                        AE {isMultipleBatches ? 'Batch ' : ''}Approval
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Approved by: Account Executive</div>
                      <div>Time: {formatDate()}</div>
                      <div>Status: Approved for payment processing</div>
                      {isMultipleBatches && <div>Batch Size: {batches.length} salary batches</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Summary */}
              {!isMultipleBatches && batches[0].employeeDetails && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUsers className="text-blue-600" size={20} />
                    Employee Summary
                  </h2>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    <div className="text-sm">
                      <div className="font-medium mb-2">Top 5 Payments:</div>
                      {batches[0].employeeDetails
                        .sort((a, b) => parseFloat(b['DEBIT AMT']) - parseFloat(a['DEBIT AMT']))
                        .slice(0, 5)
                        .map((emp, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-1 border-b border-blue-200"
                          >
                            <span className="text-xs">
                              {emp['NARRATION/NAME (NOT MORE THAN 20)']}
                            </span>
                            <span className="text-xs font-medium">
                              ₹ {parseFloat(emp['DEBIT AMT']).toLocaleString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-4 border-t flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p className="font-medium">
                ⚠️ Note: Approving this payment will post the transaction to the ledger and cannot
                be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              {onConfirm && (
                <button
                  onClick={onConfirm}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaCheck />
                  Confirm & Approve
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalaryPaymentEntryModal
