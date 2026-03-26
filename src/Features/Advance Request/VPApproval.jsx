/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import ManagerFilter from './ManagerFilter'
import {
  fetchVPApprovalRequests,
  vpApprove,
  vpReject,
  selectVPRequests,
  selectIsBeforeDeadline,
  selectLoading,
  selectErrors,
} from '../../store/slices/advanceRequestSlice'

const VPApproval = () => {
  const dispatch = useDispatch()
  const requests = useSelector(selectVPRequests)
  const isBeforeDeadline = useSelector(selectIsBeforeDeadline)
  const loading = useSelector(selectLoading)
  const errors = useSelector(selectErrors)

  const loggedInUser = useSelector((state) => state.auth.user)

  const [filters, setFilters] = useState({ name: '', employeeId: '', date: '', requestId: '' })
  const [modalData, setModalData] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [rejectRequestId, setRejectRequestId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  // ── Load on mount ───────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchVPApprovalRequests())
  }, [dispatch])

  // ── Toast on errors ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (errors.fetchVPRequests) toast.error(errors.fetchVPRequests)
    if (errors.approve) toast.error(errors.approve)
    if (errors.reject) toast.error(errors.reject)
  }, [errors.fetchVPRequests, errors.approve, errors.reject])

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

  // ── Approve ─────────────────────────────────────────────────────────────────
  const handleApprove = async (requestId) => {
    const result = await dispatch(vpApprove({ requestId }))
    if (vpApprove.fulfilled.match(result)) {
      const msg = result.payload.vpApprovedBeforeDeadline
        ? 'Request Approved – Sent to AE (Same-day processing eligible)'
        : 'Request Approved – Sent to AE (Next working day – approved after deadline)'
      isBeforeDeadline ? toast.success(msg) : toast.warning(msg)
      dispatch(fetchVPApprovalRequests())
    }
  }

  // ── Reject ──────────────────────────────────────────────────────────────────
  const handleReject = async () => {
    if (!remarks.trim()) {
      toast.error('Please provide rejection remarks.')
      return
    }
    const result = await dispatch(vpReject({ requestId: rejectRequestId, remarks }))
    if (vpReject.fulfilled.match(result)) {
      toast.error('Request Rejected by VP Operations')
      setRemarks('')
      setRejectRequestId(null)
      dispatch(fetchVPApprovalRequests())
    }
  }

  // ── Filters + Sort ──────────────────────────────────────────────────────────
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
      const priority = { 'Pending VP Approval': 1, 'Rejected by VP Operations': 2, 'Pending AE Approval': 3 }
      const ap = priority[a.status] || 4
      const bp = priority[b.status] || 4
      return ap !== bp ? ap - bp : new Date(b.requestDate) - new Date(a.requestDate)
    })

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const isActionAllowed = (req) =>
    req.status === 'Pending VP Approval' ||
    (req.status === 'Rejected by VP Operations' && req.clarification)

  const isLoading = loading.fetchVPRequests

  return (
    <div className="px-4 py-6">
      <div className="max-w-full mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-5 shadow flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">✅ Advance Requests – VP Operations Approval</h1>
            <p className="text-green-100 text-sm mt-0.5">Review and approve/reject advance requests from employees and managers</p>
          </div>
          <div className={`text-sm px-4 py-1.5 rounded-full font-semibold border ${
            isBeforeDeadline ? 'bg-white text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
          }`}>
            {isBeforeDeadline ? '🟢 Before 11:59 – Same day processing' : '🔴 After 11:59 – Next day processing only'}
          </div>
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

        {/* Empty */}
        {!isLoading && paginatedRequests.length === 0 && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No requests pending VP approval.</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && paginatedRequests.length > 0 && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Request ID</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Name</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Emp ID</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Amount</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Date</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">O/S Bal</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Reason</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Submitted By</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Type</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {paginatedRequests.map((req) => (
                    <tr key={req.requestId || req.submittedAt} className="hover:bg-green-50 transition-colors">
                      <td className="px-3 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{req.requestId || '—'}</td>
                      <td className="px-3 py-3 font-medium text-gray-800 whitespace-nowrap">{req.employeeName}</td>
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{req.employeeId}</td>
                      <td className="px-3 py-3 font-semibold text-green-700 whitespace-nowrap">₹{Number(req.amount).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{req.requestDate}</td>
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap">₹{(req.osBalance || 0).toFixed(2)}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
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
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap text-xs">{req.submittedBy || req.employeeName}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          req.submittedByType === 'Manager' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {req.submittedByType || 'Employee'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            req.status.includes('Rejected') ? 'bg-red-100 text-red-700' :
                            req.status.includes('Pending') ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {req.status}
                          </span>
                          {req.status === 'Rejected by VP Operations' && req.clarification && (
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
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            disabled={!isActionAllowed(req) || loading.vpApprove}
                            onClick={() => handleApprove(req.requestId)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isActionAllowed(req) && !loading.vpApprove
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {loading.vpApprove ? '...' : 'Approve'}
                          </button>
                          <button
                            disabled={!isActionAllowed(req) || loading.vpReject}
                            onClick={() => setRejectRequestId(req.requestId)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isActionAllowed(req) && !loading.vpReject
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

      {/* Reason / Clarification Modal */}
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
            <h3 className="text-lg font-bold text-gray-800 mb-1">❌ VP Rejection Remarks</h3>
            <p className="text-sm text-gray-500 mb-4">Provide a detailed reason for rejecting this advance request.</p>
            <textarea
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
              rows="4"
              placeholder="Enter detailed reason for rejection..."
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
                disabled={loading.vpReject}
                className="px-5 py-2 rounded-lg text-sm bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading.vpReject ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VPApproval
