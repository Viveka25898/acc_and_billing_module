/* eslint-disable no-unused-vars */
import React from 'react'
import {
  FaCalendarAlt,
  FaUser,
  FaCreditCard,
  FaFileAlt,
  FaBuilding,
  FaTag,
  FaRupeeSign,
  FaTimes,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaChartLine,
  FaClock,
  FaCheck,
  FaUsers,
  FaMapMarkerAlt,
} from 'react-icons/fa'

const RelieverPaymentEntryModal = ({
  isOpen,
  onClose,
  requestData,
  approvedRequests,
  accountingResult,
}) => {
  if (!isOpen) return null

  // Determine if this is single or multiple requests
  const isMultipleRequests = approvedRequests && approvedRequests.length > 0
  const requests = isMultipleRequests ? approvedRequests : requestData ? [requestData] : []

  if (requests.length === 0) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Pending Account Executive Approval':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Rejected by VP Operations':
      case 'Rejected by Account Executive':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Pending VP Operations Approval':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
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

  // Generate GL entries for all approved reliever requests with correct GL CODES
  const generateAllGLEntries = (requests) => {
    const glEntries = []
    let totalAmount = 0

    requests.forEach((request, index) => {
      const amount = parseFloat(request.amount)
      totalAmount += amount

      // DEBIT: Reliever Payments Expense
      glEntries.push({
        glCode: 'X2002002001', // RELIEVER PAYMENTS
        glDescription: 'RELIEVER PAYMENTS',
        debitAmount: amount,
        creditAmount: 0,
        employeeName: request.name,
        employeeId: request.id?.slice(-6) || 'N/A',
        site: request.site,
        days: request.days || 1,
        ratePerDay: request.ratePerDay || amount,
      })
    })

    // CREDIT: Employee Reliever Account (Liability)
    glEntries.push({
      glCode: 'L2001002', // EMPLOYEE RELIEVER ACCOUNT
      glDescription: 'EMPLOYEE RELIEVER ACCOUNT',
      debitAmount: 0,
      creditAmount: totalAmount,
      employeeName: null,
      employeeId: null,
      site: null,
    })

    return glEntries
  }

  const glEntries = generateAllGLEntries(requests)
  const totalAmount = requests.reduce((sum, req) => sum + parseFloat(req.amount), 0)

  // Get accounting details from accountingResult
  const voucherNo =
    accountingResult?.voucherNo ||
    `REL/${requests[0]?.site || 'GEN'}/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`
  const transactionId = accountingResult?.transactionId || `TXN_REL_${Date.now()}`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-blue-500">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                {isMultipleRequests ? (
                  <>
                    <FaUsers className="text-blue-600" />
                    Reliever Payments - Approved Successfully
                    <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-lg text-sm">
                      <FaCheck className="inline mr-1" size={12} />
                      {requests.length} Payments Approved
                    </span>
                  </>
                ) : (
                  <>
                    <FaCreditCard className="text-blue-600" />
                    Reliever Payment - Approved Successfully
                    <span
                      className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(requests[0].status)}`}
                    >
                      <FaCheck className="inline mr-1" size={12} />
                      Accounting Entries Posted
                    </span>
                  </>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                {isMultipleRequests
                  ? `Batch Approval - ${requests.length} reliever payments approved and liability created`
                  : `Voucher: ${voucherNo} | Transaction: ${transactionId?.slice(0, 12)}...`}
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
              {/* Batch Summary (for multiple requests) or Reliever Information (for single) */}
              {isMultipleRequests ? (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUsers className="text-blue-600" size={20} />
                    Batch Approval Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Payments:</span>
                      <span className="font-medium">{requests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium text-lg">₹ {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voucher Number:</span>
                      <span className="font-medium font-mono text-blue-600">{voucherNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Liability Created:</span>
                      <span className="font-medium text-green-600">
                        ₹ {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-600" size={20} />
                    Reliever Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{requests[0].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voucher No:</span>
                      <span className="font-medium font-mono text-blue-600">{voucherNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Site:</span>
                      <span className="font-medium">{requests[0].site}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days Worked:</span>
                      <span className="font-medium">{requests[0].days || 1} day(s)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Request Details Table (for multiple) or Request Details (for single) */}
              {isMultipleRequests ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-blue-600" size={20} />
                    Payment Details
                  </h2>
                  <div className="overflow-x-auto max-h-80 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="text-left p-2 border">Reliever Name</th>
                          <th className="text-left p-2 border">Site</th>
                          <th className="text-center p-2 border">Days</th>
                          <th className="text-right p-2 border">Amount</th>
                          <th className="text-left p-2 border">Replaced Employee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2 border font-medium">{req.name}</td>
                            <td className="p-2 border">{req.site}</td>
                            <td className="p-2 border text-center">{req.days || 1}</td>
                            <td className="p-2 border text-right font-medium">
                              ₹ {parseFloat(req.amount).toLocaleString()}
                            </td>
                            <td className="p-2 border text-xs">{req.replacedEmployee || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-100">
                        <tr>
                          <td colSpan="2" className="p-2 border font-bold">
                            TOTAL
                          </td>
                          <td className="p-2 border text-center font-bold">
                            {requests.reduce((sum, req) => sum + (req.days || 1), 0)}
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
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-600" size={20} />
                    Payment Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium font-mono text-sm">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-medium">{requests[0].accountNo || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IFSC Code:</span>
                      <span className="font-medium">{requests[0].ifscCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved At:</span>
                      <span className="font-medium text-sm text-green-600">
                        {formatDate(new Date().toISOString())}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* GL Entries Table - UPDATED WITH CORRECT GL CODES */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTag className="text-blue-600" size={20} />
                  General Ledger Entries
                </h2>
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-1 text-xs font-semibold text-gray-700">
                          GL Code
                        </th>
                        <th className="text-left py-2 px-1 text-xs font-semibold text-gray-700">
                          Account Name
                        </th>
                        <th className="text-left py-2 px-1 text-xs font-semibold text-gray-700">
                          Reliever/Site
                        </th>
                        <th className="text-right py-2 px-1 text-xs font-semibold text-gray-700">
                          Debit (₹)
                        </th>
                        <th className="text-right py-2 px-1 text-xs font-semibold text-gray-700">
                          Credit (₹)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {glEntries.map((entry, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-2 px-1 text-xs font-mono font-medium text-blue-700">
                            {entry.glCode}
                          </td>
                          <td className="py-2 px-1 text-xs">
                            {entry.glDescription}
                            {entry.days && (
                              <span className="text-gray-500 text-xs ml-1">
                                ({entry.days} day{entry.days > 1 ? 's' : ''})
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-1 text-xs">
                            {entry.employeeName ? (
                              <div>
                                <div className="font-medium">{entry.employeeName}</div>
                                <div className="text-gray-500 text-xs">{entry.site}</div>
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="py-2 px-1 text-xs text-right font-medium">
                            {entry.debitAmount > 0 ? (
                              <span className="text-red-600">
                                ₹ {entry.debitAmount.toLocaleString()}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="py-2 px-1 text-xs text-right font-medium">
                            {entry.creditAmount > 0 ? (
                              <span className="text-green-600">
                                ₹ {entry.creditAmount.toLocaleString()}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr className="border-t-2 border-gray-400">
                        <td colSpan="3" className="py-2 px-1 text-xs font-bold text-gray-800">
                          TOTALS
                        </td>
                        <td className="py-2 px-1 text-xs font-bold text-right text-red-600">
                          ₹{' '}
                          {glEntries
                            .reduce((sum, entry) => sum + entry.debitAmount, 0)
                            .toLocaleString()}
                        </td>
                        <td className="py-2 px-1 text-xs font-bold text-right text-green-600">
                          ₹{' '}
                          {glEntries
                            .reduce((sum, entry) => sum + entry.creditAmount, 0)
                            .toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  <div>
                    <strong>GL Codes Used:</strong>
                  </div>
                  <div>
                    • <strong>X2002002001</strong> - RELIEVER PAYMENTS (Expense Account)
                  </div>
                  <div>
                    • <strong>L2001002</strong> - EMPLOYEE RELIEVER ACCOUNT (Liability Account)
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Amount Details */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaRupeeSign className="text-blue-600" size={20} />
                  Amount Details
                </h2>
                <div className="space-y-3">
                  {isMultipleRequests ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Payments:</span>
                        <span className="font-medium">{requests.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Days Worked:</span>
                        <span className="font-medium">
                          {requests.reduce((sum, req) => sum + (req.days || 1), 0)} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Amount:</span>
                        <span className="font-medium">
                          ₹ {(totalAmount / requests.length).toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Amount:</span>
                        <span className="font-medium">
                          ₹ {parseFloat(requests[0].amount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Days Worked:</span>
                        <span className="font-medium">{requests[0].days || 1} day(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rate per Day:</span>
                        <span className="font-medium">
                          ₹{' '}
                          {requests[0].ratePerDay
                            ? requests[0].ratePerDay.toLocaleString()
                            : parseFloat(requests[0].amount).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                  <hr className="border-blue-300" />
                  <div className="flex justify-between text-lg font-bold text-blue-800">
                    <span>Total Liability Created:</span>
                    <span>₹ {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Accounting Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBuilding className="text-blue-600" size={20} />
                  Accounting Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voucher Type:</span>
                    <span className="font-medium">Journal Voucher</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expense Account:</span>
                    <span className="font-medium font-mono">X2002002001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Liability Account:</span>
                    <span className="font-medium font-mono">L2001002</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Liability Created</span>
                  </div>
                  {accountingResult?.message && (
                    <div className="bg-green-50 p-2 rounded border border-green-200">
                      <p className="text-green-800 text-sm">{accountingResult.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Accounting Workflow */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaChartLine className="text-blue-600" size={20} />
                  Accounting Workflow
                </h2>
                <div className="space-y-4">
                  {/* GL Posting */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheck className="text-green-600" size={14} />
                      <span className="font-semibold text-green-700">GL Entries Posted</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Voucher: {voucherNo}</div>
                      <div>Transaction: {transactionId?.slice(0, 12)}...</div>
                      <div className="text-green-600">
                        Status: Successfully posted to General Ledger
                      </div>
                    </div>
                  </div>

                  {/* Ledger Updates */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheck className="text-green-600" size={14} />
                      <span className="font-semibold text-green-700">Ledger Balances Updated</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>• Reliever Payments (X2002002001) - Debit increased</div>
                      <div>• Employee Reliever Account (L2001002) - Credit increased</div>
                      <div>• All entries balanced and validated</div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaClock className="text-blue-600" size={14} />
                      <span className="font-semibold text-blue-700">Next Steps</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>• Payment ready for processing in "Process Payments"</div>
                      <div>• Liability created in Employee Reliever Account</div>
                      <div>• Actual payment will be made later with UTR</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Notes */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-yellow-600" size={20} />
                  Accounting Notes
                </h2>
                <div className="text-sm text-gray-700 space-y-2">
                  <div>
                    • <strong>Debit:</strong> X2002002001 - Reliever Payments Expense recognized
                  </div>
                  <div>
                    • <strong>Credit:</strong> L2001002 - Employee Reliever Liability created
                  </div>
                  <div>• Transaction follows double-entry accounting principles</div>
                  <div>• All entries are audit-compliant with proper narration</div>
                  {isMultipleRequests && (
                    <div className="font-medium text-blue-600">
                      • Batch accounting: {requests.length} individual payments consolidated
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-4 border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RelieverPaymentEntryModal
