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

const ManagerApproval = () => {
  const dispatch = useDispatch()
  const requests = useSelector(selectManagerRequests)
  const loading = useSelector(selectLoading)
  const errors = useSelector(selectErrors)

  const [filters, setFilters] = useState({ name: '', employeeId: '', date: '', requestId: '' })
  const [modalData, setModalData] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [rejectRequestId, setRejectRequestId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  // ── Load requests on mount ─────────────────────────────────────────────────
  useEffect(() => {
    try {
      dispatch(fetchManagerApprovalRequests())
    } catch (error) {
      console.error('Failed to load manager approval requests:', error)
      toast.error('❌ Failed to load requests. Please refresh the page.')
    }
  }, [dispatch])

  // ── Toast on errors ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (errors.fetchManagerRequests) {
      toast.error(`❌ Failed to load requests: ${errors.fetchManagerRequests}`)
    }
    if (errors.approve) {
      toast.error(`❌ Approval error: ${errors.approve}`)
    }
    if (errors.reject) {
      toast.error(`❌ Rejection error: ${errors.reject}`)
    }
  }, [errors.fetchManagerRequests, errors.approve, errors.reject])

  // ── Format reasons (array or string) ───────────────────────────────────────
  const formatReasons = (reason, customReason) => {
    const reasons = []
    if (Array.isArray(reason)) {
      reasons.push(...reason.filter((r) => r && r.toString().trim()))
    } else if (typeof reason === 'string' && reason.trim()) {
      reasons.push(...reason.split(',').map((r) => r.trim()).filter((r) => r))
    } else if (reason) {
      reasons.push(reason.toString().trim())
    }
    if (customReason && customReason.toString().trim()) {
      reasons.push(customReason.toString().trim())
    }
    const unique = [...new Set(reasons.filter((r) => r))]
    return unique.length > 0 ? unique.join(', ') : 'No reason provided'
  }

  // ── Approve → dispatch thunk ────────────────────────────────────────────────
  const handleApprove = async (requestId) => {
    try {
      // ✅ Step 9.2: Validate requestId before dispatch
      if (!requestId || typeof requestId !== 'string') {
        toast.error('❌ Invalid request ID. Please refresh and try again.')
        return
      }

      // ✅ Step 9.2: Try-catch for approval
      const result = await dispatch(managerApprove({ requestId }))

      // ✅ Step 9.3: Check result and show appropriate message
      if (managerApprove.fulfilled.match(result)) {
        toast.success('✅ Request Approved – Forwarded to VP Operations')
        
        // Refresh queue to remove approved request
        try {
          dispatch(fetchManagerApprovalRequests())
        } catch (refreshError) {
          console.warn('Failed to refresh requests:', refreshError)
          // Don't fail the operation, user can refresh manually
        }
      } else if (managerApprove.rejected.match(result)) {
        // ✅ Step 9.3: Show server error with context
        const errorMsg = result.payload || 'Failed to approve request'
        toast.error(`❌ Approval failed: ${errorMsg}`)
      }
    } catch (error) {
      // ✅ Step 9.2: Catch unexpected errors
      console.error('Approval error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`❌ Error approving request: ${errorMessage}`)
    }
  }

  // ── Reject → dispatch thunk ─────────────────────────────────────────────────
  const handleReject = async () => {
    try {
      // ✅ Step 9.2: Client-side validation
      if (!remarks.trim()) {
        toast.error('❌ Please provide rejection remarks.')
        return
      }

      // ✅ Additional edge case checks
      if (!rejectRequestId || typeof rejectRequestId !== 'string') {
        toast.error('❌ Invalid request ID. Please refresh and try again.')
        return
      }

      // ✅ Validate remarks length
      if (remarks.trim().length < 5) {
        toast.error('❌ Rejection remarks must be at least 5 characters.')
        return
      }

      // ✅ Step 9.2: Try-catch for rejection
      const result = await dispatch(
        managerReject({ 
          requestId: rejectRequestId, 
          remarks: remarks.trim() 
        })
      )

      // ✅ Step 9.3: Check result and show appropriate message
      if (managerReject.fulfilled.match(result)) {
        // Success - clear form and refresh
        toast.success('✅ Request Rejected – Employee notified.')
        setRemarks('')
        setRejectRequestId(null)
        
        // Refresh queue
        try {
          dispatch(fetchManagerApprovalRequests())
        } catch (refreshError) {
          console.warn('Failed to refresh requests:', refreshError)
        }
      } else if (managerReject.rejected.match(result)) {
        // ✅ Step 9.3: Show server error with context
        const errorMsg = result.payload || 'Failed to reject request'
        toast.error(`❌ Rejection failed: ${errorMsg}`)
      }
    } catch (error) {
      // ✅ Step 9.2: Catch unexpected errors
      console.error('Rejection error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`❌ Error rejecting request: ${errorMessage}`)
    }
  }

  // ── Filters + Sorting ───────────────────────────────────────────────────────
  const filteredRequests = requests
    .filter(
      (req) =>
        req.employeeName.toLowerCase().includes(filters.name.toLowerCase()) &&
        req.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase()) &&
        (filters.date === '' || req.requestDate === filters.date) &&
        (filters.requestId === '' ||
          (req.requestId && req.requestId.toLowerCase().includes(filters.requestId.toLowerCase())))
    )
    .sort((a, b) => {
      const order = {
        'Pending Manager Approval': 1,
        'Rejected by Line Manager': 2,
        'Pending VP Approval': 3,
        'Pending AE Approval': 5,
        Approved: 6,
        'Rejected by AE': 7,
      }
      return (order[a.status] || 99) - (order[b.status] || 99)
    })

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const isActionAllowed = (req) =>
    req.status === 'Pending Manager Approval' ||
    (req.status === 'Rejected by Line Manager' && req.clarification)

  const isLoading = loading.fetchManagerRequests

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-6 shadow">
          <h1 className="text-xl sm:text-2xl font-bold text-white">✅ Advance Requests – Line Manager Approval</h1>
          <p className="text-green-100 text-sm mt-0.5">Review and approve/reject employee advance requests</p>
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

        {/* Table */}
        {!isLoading && paginatedRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No pending requests found.</p>
          </div>
        ) : !isLoading && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Request ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Emp ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">O/S Balance</th>
                    <th className="px-4 py-3 text-left font-semibold">Reason</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {paginatedRequests.map((req) => (
                    <tr key={req.requestId || req.submittedAt} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{req.requestId || '—'}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{req.employeeName}</td>
                      <td className="px-4 py-3 text-gray-600">{req.employeeId}</td>
                      <td className="px-4 py-3 font-semibold text-green-700">₹{Number(req.amount).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-600">{req.requestDate}</td>
                      <td className="px-4 py-3 text-gray-700">₹{(req.osBalance || 0).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setModalData({
                            reason: req.reason,
                            customReason: req.customReason,
                            formattedReason: formatReasons(req.reason, req.customReason),
                          })}
                          className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-100 transition"
                        >
                          <FaEye className="text-xs" /> View
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            req.status.includes('Rejected') ? 'bg-red-100 text-red-700' :
                            req.status.includes('Pending') ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {req.status}
                          </span>
                          {req.status === 'Rejected by Line Manager' && req.clarification && (
                            <button
                              onClick={() => setModalData({
                                reason: req.remarks || req.reason,
                                clarification: req.clarification,
                                formattedReason: formatReasons(req.remarks || req.reason, req.customReason),
                              })}
                              title="View Clarification"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaEye className="text-xs" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            disabled={!isActionAllowed(req) || loading.managerApprove}
                            onClick={() => handleApprove(req.requestId)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isActionAllowed(req) && !loading.managerApprove
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {loading.managerApprove ? '...' : 'Approve'}
                          </button>
                          <button
                            disabled={!isActionAllowed(req) || loading.managerReject}
                            onClick={() => setRejectRequestId(req.requestId)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isActionAllowed(req) && !loading.managerReject
                                ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 px-4 py-4 border-t border-green-100">
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
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reason Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Request Details</h3>
            {(modalData.reason || modalData.formattedReason) && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-semibold text-green-700 mb-1 text-sm">Reason(s)</h4>
                <p className="text-gray-700 text-sm">
                  {modalData.formattedReason || formatReasons(modalData.reason, modalData.customReason)}
                </p>
              </div>
            )}
            {modalData.clarification && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-semibold text-yellow-700 mb-1 text-sm">Employee Clarification</h4>
                <p className="text-gray-700 text-sm">{modalData.clarification}</p>
              </div>
            )}
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
      {rejectRequestId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">❌ Rejection Remarks</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejecting this request.</p>
            <textarea
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
              rows="3"
              placeholder="Enter reason for rejection..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setRejectRequestId(null); setRemarks('') }}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading.managerReject}
                className="px-5 py-2 rounded-lg text-sm bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading.managerReject ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerApproval