/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  FaBriefcase,
  FaChartLine,
  FaClock,
  FaCheck,
  FaUsers,
  FaSpinner,
  FaExclamationTriangle,
  FaSync,
} from 'react-icons/fa'
import {
  fetchRelieverVoucher,
  selectRelieverVoucherDetails,
  selectRelieverVoucherLoading,
  selectRelieverVoucherError,
} from '../../../store/slices/relieverSlice'

const RelieverPaymentEntryModal = ({
  isOpen,
  onClose,
  requestData,
  approvedRequests,
  accountingResult,
}) => {
  const dispatch = useDispatch()

  const [voucherDetails, setVoucherDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Parse requests from props
  const isMultipleRequests =
    (approvedRequests && approvedRequests.length > 1) ||
    (accountingResult?.voucherNo && String(accountingResult.voucherNo).includes('BATCH'))
  const requests = isMultipleRequests
    ? (approvedRequests || [])
    : approvedRequests && approvedRequests.length === 1
    ? approvedRequests
    : requestData
    ? [requestData]
    : []

  const totalAmount = requests.reduce((sum, req) => sum + parseFloat(req?.amount || 0), 0)

  // Fetch voucher details if they are not already complete in accountingResult
  const loadVoucherData = () => {
    // If it's multiple requests, we don't fetch from the API because there is no single voucher.
    // Instead, we just display the fallback generated details/GL entries.
    if (isMultipleRequests) {
      setVoucherDetails(accountingResult)
      setError(null)
      return
    }

    const voucherNo = accountingResult?.voucherNo || (requests[0]?.voucherNo)
    if (!voucherNo) return

    // If GL entries are already provided in the result, no need to fetch
    if (accountingResult?.glEntries && accountingResult?.glEntries.length > 0) {
      setVoucherDetails(accountingResult)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    dispatch(fetchRelieverVoucher(voucherNo))
      .unwrap()
      .then((data) => {
        setVoucherDetails(data)
      })
      .catch((err) => {
        console.error('Failed to fetch voucher details:', err)
        setError(err || 'Failed to load voucher details from API.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (isOpen) {
      loadVoucherData()
    } else {
      setVoucherDetails(null)
      setError(null)
    }
  }, [isOpen, accountingResult, dispatch])

  if (!isOpen) return null

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200'
    const s = status.toLowerCase()
    if (s.includes('posted') || s.includes('approved') || s.includes('success')) {
      return 'bg-green-50 text-green-700 border-green-200'
    }
    if (s.includes('pending')) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
    if (s.includes('reject')) {
      return 'bg-red-50 text-red-700 border-red-200'
    }
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
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

  // Generate fallback GL entries if not returned by API
  const generateFallbackGLEntries = (reqs) => {
    const glEntries = []
    let totalAmt = 0

    reqs.forEach((req) => {
      const amt = parseFloat(req?.amount || 0)
      totalAmt += amt

      glEntries.push({
        glCode: 'X2002002001',
        glName: 'RELIEVER PAYMENTS',
        debit: amt,
        credit: 0,
        narration: `Reliever payment - ${req.name || '-'}`,
        costCenter: req.site || '-',
        employeeId: req.idProof ? req.idProof.slice(-6) : '-',
      })
    })

    glEntries.push({
      glCode: 'L2001002',
      glName: 'EMPLOYEE RELIEVER ACCOUNT',
      debit: 0,
      credit: totalAmt,
      narration: `Reliever liability created - Batch approval`,
      costCenter: reqs[0]?.site || '-',
      employeeId: '-',
    })

    return glEntries
  }

  // Extract variables with fallbacks to '-' or local calculations
  const voucher = voucherDetails || {}
  const voucherNo = voucher.voucherNo || accountingResult?.voucherNo || '-'
  const transactionId = voucher.transactionId || accountingResult?.transactionId || '-'
  const voucherType = voucher.voucherType || 'Payment Voucher'
  const voucherDate = voucher.date || '-'
  const approvedByRaw = voucher.approvedBy || '-'
  const approvedBy = typeof approvedByRaw === 'object' && approvedByRaw !== null
    ? `${approvedByRaw.name || ''} ${approvedByRaw.employeeId ? `(${approvedByRaw.employeeId})` : ''}`.trim() || '-'
    : approvedByRaw
  const approvedDate = voucher.approvedDate || '-'
  const voucherStatus = voucher.status || 'Posted'

  // Safe string helper to avoid React child object crash
  const safeStr = (val) => {
    if (val === undefined || val === null) return '-'
    if (typeof val === 'object') {
      return val.name || val.employeeId || val.code || JSON.stringify(val)
    }
    return String(val)
  }

  // Extract relieverDetails
  const relieverDetails = voucher.relieverDetails || {}
  const relieverName = safeStr(relieverDetails.name || (requests[0]?.name || requests[0]?.relieverName))
  const relieverCode = safeStr(relieverDetails.relieverEmpCode || requests[0]?.relieverEmpCode)
  const replacedEmployee = safeStr(relieverDetails.replacedEmployee || relieverDetails.relieverFor || requests[0]?.relieverFor || requests[0]?.replacedEmployee)
  const site = safeStr(relieverDetails.site || requests[0]?.site)
  const days = safeStr(relieverDetails.days || requests[0]?.days)
  const ratePerDay = safeStr(relieverDetails.ratePerDay || requests[0]?.ratePerDay)

  // Map GL Entries from voucher details or fallback
  const rawGlEntries = voucher.glEntries || accountingResult?.glEntries || generateFallbackGLEntries(requests)
  const glEntries = rawGlEntries.map((entry, idx) => ({
    lineNo: entry.lineNo || (idx + 1),
    glCode: safeStr(entry.glCode),
    glName: safeStr(entry.glName || entry.glDescription),
    debit: parseFloat(entry.debit || entry.debitAmount || 0),
    credit: parseFloat(entry.credit || entry.creditAmount || 0),
    narration: safeStr(entry.narration),
    costCenter: safeStr(entry.costCenter || entry.site),
    employeeId: safeStr(entry.employeeId),
  }))

  const finalTotalDebit = voucher.totalDebit ? parseFloat(voucher.totalDebit) : glEntries.reduce((sum, entry) => sum + entry.debit, 0)
  const finalTotalCredit = voucher.totalCredit ? parseFloat(voucher.totalCredit) : glEntries.reduce((sum, entry) => sum + entry.credit, 0)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 px-6 py-5 flex justify-between items-center text-white shrink-0">
          <div>
            <div className="flex items-center gap-3">
              {isMultipleRequests ? (
                <FaUsers className="text-blue-200 text-2xl" />
              ) : (
                <FaCreditCard className="text-blue-200 text-2xl" />
              )}
              <h1 className="text-xl font-bold tracking-wide">
                {isMultipleRequests ? 'Reliever Payments Approved Successfully' : 'Reliever Payment Approved Successfully'}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(voucherStatus)} bg-white/10 text-white border-white/20`}>
                {voucherStatus}
              </span>
            </div>
            <p className="text-blue-100 text-xs mt-1 font-mono">
              Voucher: {voucherNo} | Transaction ID: {transactionId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1 bg-gray-50/50 space-y-6">
          
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
              <p className="text-gray-600 font-medium text-sm">Fetching voucher details from secure ledger...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto my-12 space-y-4">
              <FaExclamationTriangle className="text-red-500 text-4xl mx-auto" />
              <div>
                <h3 className="text-red-800 font-bold text-base">Unable to Fetch Voucher Details</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={loadVoucherData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <FaSync size={12} />
                Retry Loading
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (8 cols on large screens) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Main Information Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <FaUser className="text-indigo-600" size={16} />
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      {isMultipleRequests ? 'Batch Summary Details' : 'Reliever & Request Details'}
                    </h2>
                  </div>

                  {isMultipleRequests ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50/70 p-3 rounded-lg border border-gray-100 flex flex-col justify-between">
                        <span className="text-gray-500 text-xs">Total Requests Approved</span>
                        <span className="font-semibold text-gray-800 text-base mt-1">{requests.length} Payments</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-lg border border-gray-100 flex flex-col justify-between">
                        <span className="text-gray-500 text-xs">Total Amount Processed</span>
                        <span className="font-bold text-indigo-700 text-lg mt-1">₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs block">Reliever Name</span>
                        <span className="font-semibold text-gray-800">{relieverName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Employee Code</span>
                        <span className="font-semibold text-gray-800 font-mono">{relieverCode}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Replaced Employee</span>
                        <span className="font-semibold text-gray-800">{replacedEmployee}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Site Location</span>
                        <span className="font-semibold text-gray-800">{site}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Days Worked</span>
                        <span className="font-semibold text-gray-800">{days} day(s)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reliever Payments Table (only for multiple requests) */}
                {isMultipleRequests && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                        <FaFileAlt className="text-indigo-600" size={16} />
                        Consolidated Payment Details
                      </h3>
                    </div>
                    <div className="overflow-x-auto max-h-[300px]">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold sticky top-0">
                          <tr>
                            <th className="py-3 px-4">Reliever Name</th>
                            <th className="py-3 px-4">Site</th>
                            <th className="py-3 px-4 text-center">Days</th>
                            <th className="py-3 px-4 text-right">Amount</th>
                            <th className="py-3 px-4">Replaced Employee</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                          {requests.map((req, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3 px-4 font-semibold text-gray-900">{req.name || req.relieverName || '-'}</td>
                              <td className="py-3 px-4">{req.site || '-'}</td>
                              <td className="py-3 px-4 text-center">{req.days || 1}</td>
                              <td className="py-3 px-4 text-right font-medium">
                                ₹ {parseFloat(req.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-3 px-4 text-xs text-gray-500">{req.replacedEmployee || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-indigo-50/40 text-gray-900 font-bold border-t-2 border-indigo-100">
                          <tr>
                            <td colSpan="2" className="py-3 px-4">Total Consolidated</td>
                            <td className="py-3 px-4 text-center">
                              {requests.reduce((sum, req) => sum + (parseInt(req.days) || 1), 0)}
                            </td>
                            <td className="py-3 px-4 text-right text-indigo-700">
                              ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-4"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* General Ledger (GL) Entries Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                      <FaTag className="text-indigo-600" size={16} />
                      General Ledger Postings (Double-Entry)
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                        <tr className="border-b border-gray-100">
                          <th className="py-3 px-4 w-12 text-center">No</th>
                          <th className="py-3 px-4">GL Code</th>
                          <th className="py-3 px-4">Account Name</th>
                          <th className="py-3 px-4">Narration</th>
                          <th className="py-3 px-4 text-right">Debit (₹)</th>
                          <th className="py-3 px-4 text-right">Credit (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {glEntries.map((entry, index) => (
                          <tr key={index} className="hover:bg-gray-50/40 transition-colors">
                            <td className="py-3.5 px-4 text-center text-gray-400 font-mono">{entry.lineNo}</td>
                            <td className="py-3.5 px-4 font-mono text-indigo-600 font-medium">{entry.glCode}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-gray-800 block text-xs sm:text-sm">{entry.glName}</span>
                              <span className="text-gray-400 text-xs font-mono block mt-0.5">
                                Cost Center: {entry.costCenter} {entry.employeeId !== '-' && `| Emp: ${entry.employeeId}`}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-xs max-w-[200px] truncate" title={entry.narration}>
                              {entry.narration}
                            </td>
                            <td className="py-3.5 px-4 text-right font-semibold font-mono text-red-600">
                              {entry.debit > 0 ? `₹ ${entry.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                            </td>
                            <td className="py-3.5 px-4 text-right font-semibold font-mono text-green-600">
                              {entry.credit > 0 ? `₹ ${entry.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 text-gray-900 font-bold border-t border-gray-100">
                        <tr className="text-sm">
                          <td colSpan="4" className="py-3 px-4 text-right">Total Debit & Credit</td>
                          <td className="py-3 px-4 text-right font-mono text-red-600 border-r border-gray-100">
                            ₹ {finalTotalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-green-600">
                            ₹ {finalTotalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols on large screens) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Voucher Meta Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <FaBuilding className="text-indigo-600" size={16} />
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Accounting Details</h2>
                  </div>

                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between items-center py-1 border-b border-gray-50">
                      <span className="text-gray-500">Voucher Type</span>
                      <span className="font-semibold text-gray-800">{voucherType}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-50">
                      <span className="text-gray-500">Voucher Number</span>
                      <span className="font-mono font-semibold text-indigo-700">{voucherNo}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-50">
                      <span className="text-gray-500">Accounting Date</span>
                      <span className="font-semibold text-gray-800">{voucherDate !== '-' ? formatDate(voucherDate) : '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-50">
                      <span className="text-gray-500">Expense GL Code</span>
                      <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">X2002002001</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500">Liability GL Code</span>
                      <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">L2001002</span>
                    </div>
                  </div>
                </div>

                {/* Audit & Workflow Log */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <FaChartLine className="text-indigo-600" size={16} />
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Approval Audit</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs shrink-0">
                          <FaCheck size={10} />
                        </div>
                        <div className="w-0.5 flex-grow bg-gray-200 my-1"></div>
                      </div>
                      <div className="pb-4">
                        <h4 className="text-xs font-bold text-gray-800">Approved by Account Executive</h4>
                        <p className="text-gray-500 text-xs mt-0.5 truncate max-w-[220px]" title={approvedBy}>
                          {approvedBy}
                        </p>
                        <span className="text-[10px] text-gray-400 font-mono block mt-1">
                          {approvedDate !== '-' ? formatDate(approvedDate) : formatDate(new Date().toISOString())}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs shrink-0">
                          <FaClock size={10} />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">Liability Created in Sub-Ledger</h4>
                        <p className="text-gray-400 text-[10px] mt-0.5">Ready for processing in "Process Payments"</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Block */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FaBriefcase className="text-amber-600" size={14} />
                    Accounting System Notice
                  </h4>
                  <p className="text-amber-900 text-xs leading-relaxed">
                    This voucher records reliever expenses in the debit column and creates a corresponding reliever liability.
                    The sub-ledger balance will clear once actual payouts are posted via UTR details.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            Close Voucher
          </button>
        </div>

      </div>
    </div>
  )
}

export default RelieverPaymentEntryModal
