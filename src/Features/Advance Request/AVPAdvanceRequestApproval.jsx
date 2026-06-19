/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import ManagerFilter from './ManagerFilter'
import {
  fetchManagerApprovalRequests,
  managerApprove,
  managerReject,
  selectManagerRequests,
  selectLoading,
  selectErrors,
} from '../../store/slices/advanceRequestSlice'

// Pending first → Approved (forwarded) → Rejected last
const STATUS_ORDER = {
  'PENDING_REGIONAL_HEAD': 1,
  'Pending AVP Approval':  2,
  'Rejected':              3,
}

const getStatusBadgeClass = (status = '') => {
  if (status === 'PENDING_REGIONAL_HEAD') return 'bg-yellow-100 text-yellow-700'
  if (status.toLowerCase().includes('rejected')) return 'bg-red-100 text-red-700'
  return 'bg-green-100 text-green-700'
}

const formatStatus = (status = '') => {
  if (status === 'PENDING_REGIONAL_HEAD') return 'Pending Approval'
  return status || '—'
}

// Format reason array/string into readable text
const formatReasons = (reason, customReason) => {
  const parts = []
  if (Array.isArray(reason)) parts.push(...reason.filter(Boolean))
  else if (typeof reason === 'string' && reason.trim()) parts.push(...reason.split(',').map((r) => r.trim()).filter(Boolean))
  else if (reason) parts.push(String(reason).trim())
  if (customReason && String(customReason).trim()) parts.push(String(customReason).trim())
  const unique = [...new Set(parts)]
  return unique.length > 0 ? unique.join(', ') : null
}

const ManagerApproval = () => {
  const dispatch = useDispatch()
  const requests = useSelector(selectManagerRequests)
  const loading  = useSelector(selectLoading)
  const errors   = useSelector(selectErrors)

  const [filters, setFilters]         = useState({ name: '', employeeId: '', date: '', requestId: '' })
  const [modalData, setModalData]     = useState(null)
  const [remarks, setRemarks]         = useState('')
  const [rejectId, setRejectId]       = useState(null)   // UUID
  const [approvingId, setApprovingId] = useState(null)   // per-row spinner
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  // Load queue on mount
  useEffect(() => {
    const load = async () => {
      try {
        await dispatch(fetchManagerApprovalRequests()).unwrap()
      } catch (err) {
        toast.error(`❌ Failed to load approval queue: ${err}`)
      }
    }
    load()
  }, [dispatch])

  // Toast on Redux errors
  useEffect(() => { if (errors.fetchManagerRequests) toast.error(`❌ ${errors.fetchManagerRequests}`) }, [errors.fetchManagerRequests])
  useEffect(() => { if (errors.approve) toast.error(`❌ Approval failed: ${errors.approve}`) }, [errors.approve])
  useEffect(() => { if (errors.reject)  toast.error(`❌ Rejection failed: ${errors.reject}`)  }, [errors.reject])

  // Approve — uses UUID id
  const handleApprove = async (id) => {
    try {
      if (!id) { toast.error('❌ Invalid request. Please refresh.'); return }
      setApprovingId(id)
      await dispatch(managerApprove({ id, comments: 'Approved by Regional Head' })).unwrap()
      toast.success('✅ Request approved — forwarded to AVP Operations')
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Approval failed. Please try again.'
      toast.error(`❌ ${msg}`)
    } finally {
      setApprovingId(null)
    }
  }

  // Reject — uses UUID id, single remarks for both comments + rejection_reason
  const handleReject = async () => {
    try {
      if (!rejectId) { toast.error('❌ Invalid request. Please refresh.'); return }
      if (!remarks.trim()) { toast.error('❌ Please provide rejection remarks.'); return }
      if (remarks.trim().length < 5) { toast.error('❌ Remarks must be at least 5 characters.'); return }

      await dispatch(managerReject({
        id:              rejectId,
        comments:        remarks.trim(),
        rejectionReason: remarks.trim(),
      })).unwrap()

      toast.success('✅ Request rejected — employee will be notified.')
      setRemarks('')
      setRejectId(null)
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Rejection failed. Please try again.'
      toast.error(`❌ ${msg}`)
    }
  }

  const isActionAllowed = (req) => req.status === 'PENDING_REGIONAL_HEAD'

  // Filter with optional chaining — missing fields show — in UI but won't crash filter
  const filteredRequests = requests
    .filter((req) =>
      (req.employeeName || '').toLowerCase().includes(filters.name.toLowerCase()) &&
      (req.employeeId   || '').toLowerCase().includes(filters.employeeId.toLowerCase()) &&
      (!filters.date || (req.requestDate || '') === filters.date) &&
      (req.requestId    || '').toLowerCase().includes(filters.requestId.toLowerCase())
    )
    .sort((a, b) => (STATUS_ORDER[a.status] || 99) - (STATUS_ORDER[b.status] || 99))

  const totalPages        = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const isLoading = loading.fetchManagerRequests

  return (
    <div className="px-4 py-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-6 shadow">
          <h1 className="text-xl sm:text-2xl font-bold text-white">✅ Advance Requests – Regional Head Approval</h1>
          <p className="text-green-100 text-sm mt-0.5">Review and approve / reject advance requests for your region</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3 mb-5">
          <ManagerFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredRequests.length === 0 && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No requests found.</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && paginatedRequests.length > 0 && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-green-600 text-white text-left">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Request ID</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Employee ID</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">O/S Balance</th>
                    <th className="px-4 py-3 font-semibold">Reason</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {paginatedRequests.map((req) => {
                    const actionable  = isActionAllowed(req)
                    const isApproving = approvingId === req.id
                    const formattedReason = formatReasons(req.reason, req.customReason)

                    return (
                      <tr key={req.id} className="hover:bg-green-50 transition-colors">

                        {/* Request ID */}
                        <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                          {req.requestId || '—'}
                        </td>

                        {/* Name */}
                        <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                          {req.employeeName || '—'}
                        </td>

                        {/* Employee ID */}
                        <td className="px-4 py-3 text-gray-600">
                          {req.employeeId || '—'}
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 font-semibold text-green-700 whitespace-nowrap">
                          {req.amount ? `₹${Number(req.amount).toLocaleString('en-IN')}` : '—'}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {req.requestDate || '—'}
                        </td>

                        {/* O/S Balance */}
                        <td className="px-4 py-3 text-gray-700">
                          {req.osBalance != null ? `₹${Number(req.osBalance).toFixed(2)}` : '—'}
                        </td>

                        {/* Reason — view button if data exists, else — */}
                        <td className="px-4 py-3">
                          {formattedReason ? (
                            <button
                              onClick={() => setModalData({ formattedReason })}
                              className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-100 transition"
                            >
                              <FaEye className="text-xs" /> View
                            </button>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeClass(req.status)}`}>
                            {formatStatus(req.status)}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            {/* Approve */}
                            <button
                              disabled={!actionable || isApproving || loading.managerApprove}
                              onClick={() => handleApprove(req.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition min-w-[70px] flex items-center justify-center gap-1 ${
                                actionable && !isApproving && !loading.managerApprove
                                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {isApproving ? (
                                <>
                                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                  </svg>
                                  ...
                                </>
                              ) : 'Approve'}
                            </button>

                            {/* Reject */}
                            <button
                              disabled={!actionable || loading.managerReject}
                              onClick={() => { setRejectId(req.id); setRemarks('') }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition min-w-[60px] ${
                                actionable && !loading.managerReject
                                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 px-4 py-4 border-t border-green-100 flex-wrap">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-sm border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ‹ Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-semibold transition ${
                      page === currentPage
                        ? 'bg-green-600 text-white shadow'
                        : 'bg-white text-green-700 border border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reason View Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Request Reason</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-gray-700 text-sm">{modalData.formattedReason}</p>
            </div>
            <div className="text-right mt-5">
              <button
                onClick={() => setModalData(null)}
                className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">❌ Rejection Remarks</h3>
            <p className="text-sm text-gray-500 mb-4">Provide a clear reason for rejecting this request.</p>
            <textarea
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
              rows="3"
              placeholder="Enter reason for rejection (min. 5 characters)..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setRejectId(null); setRemarks('') }}
                disabled={loading.managerReject}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading.managerReject || remarks.trim().length < 5}
                className="px-5 py-2 rounded-lg text-sm bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading.managerReject ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Rejecting...
                  </>
                ) : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerApproval
