/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { fetchPaymentEntry } from '../services/advanceRequestService'
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
} from 'react-icons/fa'

const AdvanceRequestPaymentEntryModal = ({ isOpen, onClose, requestData, approvedRequests }) => {
  const [paymentEntries, setPaymentEntries] = useState([])
  const [loading, setLoading] = useState(false)

  // Determine if this is single or multiple requests
  const isMultipleRequests = approvedRequests && approvedRequests.length > 0
  const requests = useMemo(() => {
    return isMultipleRequests ? approvedRequests : requestData ? [requestData] : []
  }, [isMultipleRequests, approvedRequests, requestData])

  useEffect(() => {
    if (isOpen && requests.length > 0) {
      const needsLoad = requests.some(r => !r.accountingDetails)
      if (!needsLoad) {
        setPaymentEntries(requests.map(r => ({ data: { accountingDetails: r.accountingDetails } })))
        setLoading(false)
        return
      }

      const loadPaymentEntries = async () => {
        setLoading(true)
        try {
          const promises = requests.map(r => r.accountingDetails ? Promise.resolve({ data: { accountingDetails: r.accountingDetails } }) : fetchPaymentEntry(r.id))
          const responses = await Promise.all(promises)
          setPaymentEntries(responses)
        } catch (error) {
          console.error('Failed to load payment entries:', error)
          toast.error(error.message || 'Failed to load payment entries.')
        } finally {
          setLoading(false)
        }
      }
      loadPaymentEntries()
    } else {
      setPaymentEntries([])
    }
  }, [isOpen, requests])

  if (!isOpen) return null
  if (requests.length === 0) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Rejected by AE':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Pending AE Approval':
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

  // Construct glEntries from backend payment-entry data
  const glEntries = []
  paymentEntries.forEach((entryResponse, index) => {
    const request = requests[index] || {}
    const dataPayload = entryResponse?.data ?? entryResponse
    const details = dataPayload?.accountingDetails || dataPayload

    if (!details) return

    const employeeGLCode = details.employeeGLCode || details.employeeGlCode || details.employee_gl_code || details.employee_code || request.employeeGLCode || 'N/A'
    const bankGLCode = details.bankGLCode || details.bankGlCode || details.bank_gl_code || details.bank_code || request.bankGLCode || 'N/A'
    const voucherNo = details.voucherNo || details.voucher_no || request.voucherNo || 'N/A'
    const transactionId = details.transactionId || details.transaction_id || request.transactionId || 'N/A'

    const debitAmt = parseFloat(details.debitAmount || details.debit_amount || details.debit || details.amount || request.amount || 0)
    const creditAmt = parseFloat(details.creditAmount || details.credit_amount || details.credit || details.amount || request.amount || 0)
    const empName = request.employeeName || 'Employee'
    const bankName = request.bankName || 'Bank Account'

    // Debit entry
    glEntries.push({
      glCode: employeeGLCode,
      glDescription: `Employee Advance - ${empName}`,
      narration: details.narration || `Advance paid to ${empName} - Voucher: ${voucherNo}`,
      debitAmount: debitAmt,
      creditAmount: 0,
      voucherNo: voucherNo,
      transactionId: transactionId,
    })

    // Credit entry
    glEntries.push({
      glCode: bankGLCode,
      glDescription: `${bankName} - Payment`,
      narration: details.narration || `Advance payment via ${bankName} - Txn ID: ${transactionId}`,
      debitAmount: 0,
      creditAmount: creditAmt,
      voucherNo: voucherNo,
      transactionId: transactionId,
    })
  })

  const totalAmount = requests.reduce((sum, req) => sum + parseFloat(req.amount), 0)

  const uniqueVouchers = Array.from(
    new Set(
      paymentEntries
        .map((e) => {
          const dataPayload = e?.data ?? e
          const details = dataPayload?.accountingDetails || dataPayload
          return details?.voucherNo || details?.voucher_no
        })
        .filter(Boolean)
    )
  )

  const uniqueTransactions = Array.from(
    new Set(
      paymentEntries
        .map((e) => {
          const dataPayload = e?.data ?? e
          const details = dataPayload?.accountingDetails || dataPayload
          return details?.transactionId || details?.transaction_id
        })
        .filter(Boolean)
    )
  )

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
                    Multiple Advance Requests - Approved
                    <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-lg text-sm">
                      <FaCheck className="inline mr-1" size={12} />
                      {requests.length} Requests Approved
                    </span>
                  </>
                ) : (
                  <>
                    <FaCreditCard className="text-blue-600" />
                    Advance Request - Approved
                    <span
                      className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(requests[0].status)}`}
                    >
                      <FaCheck className="inline mr-1" size={12} />
                      {requests[0].status}
                    </span>
                  </>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                {isMultipleRequests
                  ? `Batch Approval - ${requests.length} requests processed`
                  : `Request ID: ${requests[0].requestId || 'AUTO-' + requests[0].submittedAt?.slice(-8)}`}
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
              {/* Selected Bank Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-300">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  Selected Bank Account
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="font-bold text-blue-700">
                      {requests[0].bankName || 'Bank Account'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GL Code:</span>
                    <span className="font-mono font-bold text-green-700">
                      {requests[0].bankCode || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type:</span>
                    <span className="font-medium">
                      Company Bank Account
                    </span>
                  </div>
                  {loading ? (
                    <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-blue-200 pt-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
                      <span>Loading voucher IDs...</span>
                    </div>
                  ) : (
                    <>
                      {uniqueVouchers.length > 0 && (
                        <div className="flex justify-between border-t border-blue-200 pt-2">
                          <span className="text-gray-600 font-semibold">Voucher No:</span>
                          <span className="font-mono font-bold text-blue-700">
                            {uniqueVouchers.join(', ')}
                          </span>
                        </div>
                      )}
                      {uniqueTransactions.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-semibold">Transaction ID:</span>
                          <span className="font-mono font-bold text-indigo-700 text-right max-w-[200px] truncate">
                            {uniqueTransactions.join(', ')}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Batch Summary (for multiple requests) or Employee Information (for single) */}
              {isMultipleRequests ? (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUsers className="text-blue-600" size={20} />
                    Batch Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Requests:</span>
                      <span className="font-medium">{requests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium text-lg">₹ {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approval Date:</span>
                      <span className="font-medium">{formatDate(requests[0].approvedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved By:</span>
                      <span className="font-medium">{requests[0].aeApprovedBy}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaUser className="text-blue-600" size={20} />
                      Employee Information
                    </h2>
                    {(() => {
                      const firstEntry = paymentEntries[0]?.data?.accountingDetails || paymentEntries[0]?.accountingDetails || paymentEntries[0]
                      const employeeGLCode = firstEntry?.employeeGLCode || 'N/A'
                      return (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">
                              {requests[0].employeeName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Employee ID:</span>
                            <span className="font-medium">{requests[0].employeeId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Region:</span>
                            <span className="font-medium">{requests[0].region || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">GL Code:</span>
                            <span className="font-mono font-bold text-green-700">
                              {employeeGLCode}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Outstanding Balance:</span>
                            <span className="font-medium">
                              ₹ {Number(requests[0].osBalance || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </>
              )}

              {/* Requests Details Table (for multiple) or Request Details (for single) */}
              {isMultipleRequests ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-blue-600" size={20} />
                    Request Details
                  </h2>
                  <div className="overflow-x-auto max-h-80 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="text-left p-2 border">Employee</th>
                          <th className="text-left p-2 border">GL Code</th>
                          <th className="text-right p-2 border">Amount</th>
                          <th className="text-left p-2 border">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req, index) => {
                          const details = paymentEntries[index]?.data?.accountingDetails || paymentEntries[index]?.accountingDetails || paymentEntries[index]
                          const employeeGLCode = details?.employeeGLCode || details?.employeeGlCode || details?.employee_gl_code || details?.employee_code || req.employeeGLCode || 'N/A'
                          return (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-2 border font-medium">
                                {req.employeeName}
                              </td>
                              <td className="p-2 border font-mono text-xs text-blue-600">
                                {employeeGLCode}
                              </td>
                              <td className="p-2 border text-right font-medium">
                                ₹ {parseFloat(req.amount).toLocaleString()}
                              </td>
                              <td className="p-2 border text-xs">
                                {(() => {
                                  const reasonsList = [];
                                  if (req.reasons && Array.isArray(req.reasons) && req.reasons.length > 0) {
                                    reasonsList.push(...req.reasons);
                                  } else if (req.reason) {
                                    reasonsList.push(req.reason);
                                  }
                                  if (req.customReason) {
                                    reasonsList.push(req.customReason);
                                  }
                                  return reasonsList.filter(Boolean).join(', ') || 'N/A';
                                })()}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot className="bg-gray-100">
                        <tr>
                          <td colSpan="2" className="p-2 border font-bold">
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
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-600" size={20} />
                    Request Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request Date:</span>
                      <span className="font-medium">{requests[0].requestDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted At:</span>
                      <span className="font-medium text-sm">
                        {formatDate(requests[0].submittedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reason:</span>
                      <span className="font-medium text-sm">
                        {(() => {
                          const r = requests[0];
                          const reasonsList = [];
                          if (r.reasons && Array.isArray(r.reasons) && r.reasons.length > 0) {
                            reasonsList.push(...r.reasons);
                          } else if (r.reason) {
                            reasonsList.push(r.reason);
                          }
                          if (r.customReason) {
                            reasonsList.push(r.customReason);
                          }
                          return reasonsList.filter(Boolean).join(', ') || 'N/A';
                        })()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved At:</span>
                      <span className="font-medium text-sm text-green-600">
                        {formatDate(requests[0].approvedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* GL Entries Table - REAL DATA */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-300">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTag className="text-green-600" size={20} />
                  GL Entries & Accounting (REAL DATA)
                </h2>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                    <p className="text-xs text-gray-500 font-medium">Fetching voucher details...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">
                          GL Code
                        </th>
                        <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">
                          Description
                        </th>
                        <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">
                          Narration
                        </th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-gray-700">
                          Debit
                        </th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-gray-700">
                          Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {glEntries.map((entry, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-2 px-2 text-xs font-bold text-blue-700 font-mono">
                            {entry.glCode}
                          </td>
                          <td className="py-2 px-2 text-xs font-medium">{entry.glDescription}</td>
                          <td className="py-2 px-2 text-xs text-gray-600">{entry.narration}</td>
                          <td className="py-2 px-2 text-xs text-right font-medium">
                            {entry.debitAmount > 0
                              ? `₹ ${entry.debitAmount.toLocaleString()}`
                              : '-'}
                          </td>
                          <td className="py-2 px-2 text-xs text-right font-medium">
                            {entry.creditAmount > 0
                              ? `₹ ${entry.creditAmount.toLocaleString()}`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-green-100">
                      <tr className="border-t-2 border-green-400">
                        <td colSpan="3" className="py-2 px-2 text-xs font-bold text-gray-800">
                          TOTALS
                        </td>
                        <td className="py-2 px-2 text-xs font-bold text-right text-green-700">
                          ₹{' '}
                          {glEntries
                            .reduce((sum, entry) => sum + entry.debitAmount, 0)
                            .toLocaleString()}
                        </td>
                        <td className="py-2 px-2 text-xs font-bold text-right text-red-700">
                          ₹{' '}
                          {glEntries
                            .reduce((sum, entry) => sum + entry.creditAmount, 0)
                            .toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

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
                        <span className="text-gray-600">Number of Requests:</span>
                        <span className="font-medium">{requests.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Amount:</span>
                        <span className="font-medium">
                          ₹ {(totalAmount / requests.length).toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requested Amount:</span>
                      <span className="font-medium">
                        ₹ {parseFloat(requests[0].amount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="font-medium">₹ 0</span>
                  </div>
                  <hr className="border-blue-300" />
                  <div className="flex justify-between text-lg font-bold text-blue-800">
                    <span>Total Approved Amount:</span>
                    <span>₹ {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Approval Workflow */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaChartLine className="text-blue-600" size={20} />
                  Approval Workflow
                </h2>
                <div className="space-y-4">
                  {requests.some((req) => req.isVPRequest) && (
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FaCheck className="text-green-600" size={14} />
                        <span className="font-semibold text-green-700">VP Approvals</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>VP Requests: {requests.filter((req) => req.isVPRequest).length}</div>
                        <div>
                          Before Deadline:{' '}
                          {
                            requests.filter(
                              (req) => req.isVPRequest && req.vpApprovedBeforeDeadline
                            ).length
                          }
                        </div>
                        <div>
                          After Deadline:{' '}
                          {
                            requests.filter(
                              (req) => req.isVPRequest && !req.vpApprovedBeforeDeadline
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheck className="text-green-600" size={14} />
                      <span className="font-semibold text-green-700">
                        AE {isMultipleRequests ? 'Batch ' : ''}Approval
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Approved by: {requests[0].aeApprovedBy || 'Account Executive'}</div>
                      <div>Time: {formatDate(requests[0].approvedAt)}</div>
                      <div
                        className={
                          requests[0].aeApprovedBeforeDeadline ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        Status:{' '}
                        {requests[0].aeApprovedBeforeDeadline
                          ? 'Approved before 19:59 (Same-day processing)'
                          : 'Approved after 19:59 (Next-day processing)'}
                      </div>
                      {isMultipleRequests && <div>Batch Size: {requests.length} requests</div>}
                    </div>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaClock className="text-blue-600" size={14} />
                      <span className="font-semibold text-blue-700">Next Steps</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>
                        • {isMultipleRequests ? 'All requests' : 'Request'} included in bank upload
                        file
                      </div>
                      <div>
                        • {isMultipleRequests ? 'Payments' : 'Payment'} will be processed via NEFT
                      </div>
                      <div>
                        • Amount{isMultipleRequests ? 's' : ''} will be credited to employee account
                        {isMultipleRequests ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Notes */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-yellow-600" size={20} />
                  Processing Notes
                </h2>
                <div className="text-sm text-gray-700 space-y-2">
                  <div>
                    • {isMultipleRequests ? 'These advances' : 'This advance'} will be deducted from
                    future salary payments
                  </div>
                  <div>
                    • Employee{isMultipleRequests ? 's' : ''} outstanding balance
                    {isMultipleRequests ? 's' : ''} will be updated after processing
                  </div>
                  <div>
                    • Transaction reference{isMultipleRequests ? 's' : ''} will be provided once
                    bank processing is complete
                  </div>
                  {isMultipleRequests && (
                    <div className="font-medium text-blue-600">
                      • Batch processing: All {requests.length} requests processed simultaneously
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

export default AdvanceRequestPaymentEntryModal
