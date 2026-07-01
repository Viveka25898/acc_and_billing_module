import React, { useState } from 'react'
import { AiOutlineEye } from 'react-icons/ai'
import ManagerClarificationModal from '../Components/ManagerClarificationModal'

// ── Helpers & Constants ───────────────────────────────────────────────────────
const SETTLEMENT_STATUS = {
  PENDING_AM: 'PENDING_AM',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

const getStatusLabel = (status) => {
  if (status === SETTLEMENT_STATUS.PENDING_AM) return 'Pending Account Manager Approval'
  if (status === SETTLEMENT_STATUS.APPROVED) return 'Approved'
  if (status === SETTLEMENT_STATUS.REJECTED) return 'Rejected'
  return status
}

const getStatusBadgeClass = (status = '') => {
  if (status === SETTLEMENT_STATUS.PENDING_AM) return 'bg-indigo-100 text-indigo-700 border-indigo-200'
  if (status === SETTLEMENT_STATUS.REJECTED)   return 'bg-red-100 text-red-700 border-red-200'
  if (status === SETTLEMENT_STATUS.APPROVED)   return 'bg-green-100 text-green-700 border-green-200'
  return 'bg-blue-100 text-blue-700 border-blue-200'
}

const STATUS_ORDER = {
  [SETTLEMENT_STATUS.PENDING_AM]: 1,
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_SETTLEMENTS = [
  {
    id: 'd6a041e7-4573-4279-b860-9d9eea392f8a',
    settlementNo: 'SET-20260701042427469163',
    status: 'PENDING_AM',
    employeeId: 79,
    region: 'NORTH',
    outstandingBalanceBefore: 1500.00,
    totalAmount: 900.00,
    submittedAt: '2026-07-01T04:24:27.469Z',
    rejectionReason: null,
    clarification: null,
  },
  {
    id: 'df6ca6ab-dc3f-42e2-af7f-a36a9ff876e1',
    settlementNo: 'SET-20260701042425685253',
    status: 'PENDING_AM',
    employeeId: 104,
    region: 'WEST',
    outstandingBalanceBefore: 0.00,
    totalAmount: 1250.00,
    submittedAt: '2026-07-01T04:24:25.685Z',
    rejectionReason: null,
    clarification: 'Verified original bills attached.',
    rejectedBy: 'Account Executive',
    clarificationAt: '2026-07-01T04:30:12.000Z',
    updatedAt: '2026-07-01T04:35:10.000Z'
  },
  {
    id: '0222aa96-d70b-4e83-a8a7-55cc969af31d',
    settlementNo: 'SET-20260701042423346192',
    status: 'PENDING_AM',
    employeeId: 112,
    region: 'SOUTH',
    outstandingBalanceBefore: 500.00,
    totalAmount: 450.00,
    submittedAt: '2026-07-01T04:24:23.346Z',
    rejectionReason: null,
    clarification: null,
  }
]

const AMAdvanceSettlementApprovalPage = () => {
  // ── Local Mock UI States ────────────────────────────────────────────────────
  const [queue, setQueue] = useState(MOCK_SETTLEMENTS)
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState('')
  const [rejectId, setRejectId] = useState(null)
  const [approvingId, setApprovingId] = useState(null)
  const [filters, setFilters] = useState({ employee: '', status: 'All', date: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClarificationReq, setSelectedClarificationReq] = useState(null)
  const ITEMS_PER_PAGE = 5

  const shouldShowClarification = (req) => {
    return !!req.clarification
  }

  // ─── Approve Handler (Mock) ────────────────────────────────────────────────
  const handleApprove = async (id) => {
    try {
      setApprovingId(id)
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      // Update local state queue
      setQueue((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: SETTLEMENT_STATUS.APPROVED } : s))
      )
      
      alert(`✅ Settlement approved successfully! (Forwarded for GL Processing)`)
    } catch (err) {
      console.error(err)
    } finally {
      setApprovingId(null)
      setLoading(false)
    }
  }

  // ─── Reject Handler (Mock) ─────────────────────────────────────────────────
  const handleReject = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      setQueue((prev) =>
        prev.map((s) =>
          s.id === rejectId
            ? { ...s, status: SETTLEMENT_STATUS.REJECTED, rejectionReason: remarks }
            : s
        )
      )

      alert('✅ Settlement rejected. Employee will be notified.')
      setRemarks('')
      setRejectId(null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isActionAllowed = (s) => s.status === SETTLEMENT_STATUS.PENDING_AM

  // ─── Client-side filtering ────────────────────────────────────────────────
  const filteredQueue = queue
    .filter((s) => {
      const empSearch = (filters.employee || '').toLowerCase()
      const matchesEmployee = !empSearch
        || String(s.employeeId ?? '').includes(empSearch)
        || (s.region ?? '').toLowerCase().includes(empSearch)

      const matchesStatus =
        filters.status === 'All' ||
        (filters.status === 'Pending'  && getStatusLabel(s.status).toLowerCase().includes('pending')) ||
        (filters.status === 'Approved' && s.status === SETTLEMENT_STATUS.APPROVED) ||
        (filters.status === 'Rejected' && s.status === SETTLEMENT_STATUS.REJECTED)

      const matchesDate =
        !filters.date ||
        (s.submittedAt && new Date(s.submittedAt).toISOString().split('T')[0] === filters.date)

      return matchesEmployee && matchesStatus && matchesDate
    })
    .sort((a, b) => (STATUS_ORDER[a.status] || 99) - (STATUS_ORDER[b.status] || 99))

  const totalPages      = Math.ceil(filteredQueue.length / ITEMS_PER_PAGE) || 1
  const paginatedQueue  = filteredQueue.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="px-4 py-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-6 shadow">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            ✅ Advance Settlements – Account Manager Approval
          </h1>
          <p className="text-green-100 text-sm mt-0.5">
            Review and approve / reject settlement requests for your queue (Mock UI)
          </p>
        </div>

        {/* ── Filters ────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">

            {/* Employee ID / Region search */}
            <div className="w-full sm:w-1/3">
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Employee ID / Region
              </label>
              <input
                type="text"
                value={filters.employee}
                onChange={(e) => { setFilters((f) => ({ ...f, employee: e.target.value })); setCurrentPage(1) }}
                placeholder="Search by employee ID or region"
                className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Status filter */}
            <div className="w-full sm:w-1/3">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setCurrentPage(1) }}
                className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Date filter */}
            <div className="w-full sm:w-1/3">
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Submission Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => { setFilters((f) => ({ ...f, date: e.target.value })); setCurrentPage(1) }}
                className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
        </div>

        {/* ── Table ────────────────────────────────────────────────────────── */}
        {filteredQueue.length === 0 ? (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No settlement requests found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">

                <thead>
                  <tr className="bg-green-600 text-white text-left">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">#</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Employee ID</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Region</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Excel File</th>
                    <th className="px-4 py-3 font-semibold">Attachments</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Amount</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Remarks</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-green-50">
                  {paginatedQueue.map((req, index) => {
                    const actionable    = isActionAllowed(req)
                    const isThisApproving = approvingId === req.id
                    const dateStr = req.submittedAt
                      ? new Date(req.submittedAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })
                      : null

                    return (
                      <tr key={req.id || req.settlementId} className="hover:bg-green-50 transition-colors">

                        {/* # */}
                        <td className="px-4 py-3 text-gray-600 font-medium">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>

                        {/* Employee ID */}
                        <td className="px-4 py-3 text-gray-800 font-medium">
                          {req.employeeId || '—'}
                        </td>

                        {/* Region */}
                        <td className="px-4 py-3 text-gray-700">
                          {req.region || '—'}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {dateStr || '—'}
                        </td>

                        {/* Excel File */}
                        <td className="px-4 py-3 text-gray-400">—</td>

                        {/* Attachments */}
                        <td className="px-4 py-3 text-gray-400">—</td>

                        {/* Amount */}
                        <td className="px-4 py-3 font-semibold text-green-700 whitespace-nowrap">
                          {req.totalAmount != null
                            ? `₹${Number(req.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                            : '—'
                          }
                        </td>

                        {/* Status badge */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col items-start gap-1">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeClass(req.status)}`}>
                              {getStatusLabel(req.status) || '—'}
                            </span>
                            {shouldShowClarification(req) && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-xs text-amber-600 font-medium">Clarification</span>
                                <button
                                  onClick={() => setSelectedClarificationReq(req)}
                                  className="text-green-600 hover:text-green-800 transition p-0.5 rounded hover:bg-green-100/50 flex items-center justify-center"
                                  title="View Clarification & Rejection Details"
                                >
                                  <AiOutlineEye size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Remarks */}
                        <td className="px-4 py-3 max-w-[160px]">
                          {req.rejectionReason
                            ? (
                              <span
                                className="text-red-600 text-xs leading-snug line-clamp-2"
                                title={req.rejectionReason}
                              >
                                {req.rejectionReason}
                              </span>
                            )
                            : <span className="text-gray-400">—</span>
                          }
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">

                            {/* Approve */}
                            <button
                              disabled={!actionable || isThisApproving}
                              onClick={() => handleApprove(req.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition min-w-[70px] flex items-center justify-center gap-1 ${
                                actionable && !isThisApproving
                                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {isThisApproving ? '...' : 'Approve'}
                            </button>

                            {/* Reject */}
                            <button
                              disabled={!actionable}
                              onClick={() => { setRejectId(req.id); setRemarks('') }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition min-w-[60px] ${
                                actionable
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

            {/* ── Pagination ── */}
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

      {/* ── Reject Modal ─────── */}
      {rejectId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">❌ Rejection Remarks</h3>
            <p className="text-sm text-gray-500 mb-4">
              Provide a clear reason for rejecting this settlement.
            </p>
            <textarea
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
              rows="3"
              placeholder="Enter reason for rejection (min. 5 characters)..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setRejectId(null); setRemarks('') }}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={remarks.trim().length < 5}
                className="px-5 py-2 rounded-lg text-sm bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Clarification Modal ────────────────────────────────────────────── */}
      <ManagerClarificationModal
        isOpen={selectedClarificationReq !== null}
        onClose={() => setSelectedClarificationReq(null)}
        data={selectedClarificationReq ? {
          rejectionHistory: selectedClarificationReq.rejectionReason ? {
            by: selectedClarificationReq.rejectedBy || 'Account Manager',
            date: selectedClarificationReq.updatedAt || selectedClarificationReq.submittedAt,
            comments: selectedClarificationReq.rejectionReason
          } : null,
          clarificationHistory: selectedClarificationReq.clarification ? {
            by: 'Employee/OE',
            date: selectedClarificationReq.clarificationAt || selectedClarificationReq.updatedAt,
            comments: selectedClarificationReq.clarification
          } : null,
          status: getStatusLabel(selectedClarificationReq.status),
          ...selectedClarificationReq
        } : null}
        onApprove={() => {
          if (selectedClarificationReq) {
            handleApprove(selectedClarificationReq.id)
            setSelectedClarificationReq(null)
          }
        }}
        onReject={() => {
          if (selectedClarificationReq) {
            setRejectId(selectedClarificationReq.id)
            setRemarks('')
            setSelectedClarificationReq(null)
          }
        }}
      />
    </div>
  )
}

export default AMAdvanceSettlementApprovalPage
