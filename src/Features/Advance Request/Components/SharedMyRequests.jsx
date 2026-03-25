/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import RequestFilter from '../RequestFilter'

// ── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const base = 'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold'
  if (status?.includes('Rejected')) return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>
  if (status?.includes('Pending')) return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>
  if (status === 'Approved') return <span className={`${base} bg-green-100 text-green-700`}>{status}</span>
  return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>
}

const formatReasons = (reason) => {
  if (Array.isArray(reason)) return reason.join(', ')
  return reason || '—'
}

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * SharedMyRequests — works for ALL roles (Employee, LM, VP, Manager, etc.)
 * @param {string} title - Page title shown in header
 */
const SharedMyRequests = ({ title = 'My Advance Requests' }) => {
  const [requests, setRequests] = useState([])
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showClarifyModal, setShowClarifyModal] = useState(false)
  const [clarificationText, setClarificationText] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)

  const itemsPerPage = 5
  const authUser = useSelector((state) => state.auth.user)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('advanceRequests')) || []
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const allUsers = JSON.parse(localStorage.getItem('users')) || []
    const fullUser = allUsers.find((u) => u.username === currentUser?.username)
    const empId = fullUser?.employeeId || fullUser?.empId || fullUser?.username
    const username = currentUser?.username?.toLowerCase()

    // Match by submittedBy OR employeeId — covers all roles
    const userRequests = stored
      .filter((r) => {
        const submittedBy = r.submittedBy?.toLowerCase()
        return (
          submittedBy === username ||
          r.employeeId === empId ||
          r.employeeId === username
        )
      })
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

    setRequests(userRequests)
  }, [authUser])

  const filteredRequests = requests.filter((r) => !dateFilter || r.requestDate === dateFilter)
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const openClarifyModal = (req) => {
    setSelectedRequest(req)
    setClarificationText('')
    setShowClarifyModal(true)
  }

  const submitClarification = () => {
    if (!clarificationText.trim()) {
      toast.error('Clarification cannot be empty.')
      return
    }
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || []
    const updated = allRequests.map((r) =>
      r.submittedAt === selectedRequest.submittedAt
        ? { ...r, clarification: clarificationText, status: 'Pending Manager Approval' }
        : r
    )
    localStorage.setItem('advanceRequests', JSON.stringify(updated))
    setRequests((prev) =>
      prev.map((r) =>
        r.submittedAt === selectedRequest.submittedAt
          ? { ...r, clarification: clarificationText, status: 'Pending Manager Approval' }
          : r
      )
    )
    setShowClarifyModal(false)
    toast.success('Clarification submitted successfully.')
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-5 shadow">
          <h1 className="text-xl sm:text-2xl font-bold text-white">📋 {title}</h1>
          <p className="text-green-100 text-sm mt-0.5">Track the status of your submitted advance requests</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3 mb-5">
          <RequestFilter currentDate={dateFilter} onDateChange={setDateFilter} />
        </div>

        {/* Table / Empty State */}
        {paginatedRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No advance requests found.</p>
            <p className="text-gray-400 text-sm mt-1">Submit a request to see it here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Request ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Reason</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Remarks</th>
                    <th className="px-4 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {paginatedRequests.map((req, index) => (
                    <tr key={index} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{req.requestId || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-green-700">₹{Number(req.amount).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-600">{req.requestDate}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate" title={formatReasons(req.reason)}>
                        {formatReasons(req.reason)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate" title={req.remarks}>
                        {req.remarks || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {req.status?.includes('Rejected') && !req.clarification ? (
                          <button
                            onClick={() => openClarifyModal(req)}
                            className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full hover:bg-yellow-200 transition font-medium"
                          >
                            Add Clarification
                          </button>
                        ) : req.clarification ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">✓ Clarified</span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { label: 'Total', count: requests.length, color: 'bg-gray-100 text-gray-700' },
            { label: 'Pending', count: requests.filter((r) => r.status?.includes('Pending')).length, color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Approved', count: requests.filter((r) => r.status === 'Approved').length, color: 'bg-green-100 text-green-700' },
            { label: 'Rejected', count: requests.filter((r) => r.status?.includes('Rejected')).length, color: 'bg-red-100 text-red-700' },
          ].map(({ label, count, color }) => (
            <div key={label} className={`${color} rounded-xl px-4 py-3 text-center`}>
              <p className="text-xl font-bold">{count}</p>
              <p className="text-xs font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clarification Modal */}
      {showClarifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Add Clarification</h3>
            <p className="text-sm text-gray-500 mb-4">Explain why your request should be reconsidered.</p>
            <textarea
              rows="4"
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none mb-4"
              placeholder="Enter clarification..."
              value={clarificationText}
              onChange={(e) => setClarificationText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClarifyModal(false)}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitClarification}
                className="px-5 py-2 rounded-lg text-sm bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SharedMyRequests
