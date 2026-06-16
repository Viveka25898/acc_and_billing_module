/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import RequestFilter from '../RequestFilter'
import {
  fetchMyRequests,
  submitClarificationThunk,
  selectMyRequests,
  selectPagination,
  selectLoading,
  selectErrors,
} from '../../../store/slices/advanceRequestSlice'

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 5
const CLARIFY_MIN_CHARS = 10
const CLARIFY_MAX_CHARS = 500

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Color-coded pill badge for request status */
const StatusBadge = ({ status }) => {
  const base = 'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap'
  if (!status) return <span className={`${base} bg-gray-100 text-gray-500`}>—</span>
  if (status.includes('Rejected')) return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>
  if (status.includes('Pending')) return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>
  if (status === 'Approved') return <span className={`${base} bg-green-100 text-green-700`}>{status}</span>
  return <span className={`${base} bg-blue-100 text-blue-700`}>{status}</span>
}

/** Join reason array into comma-separated string */
const formatReasons = (reason) => {
  if (!reason) return '—'
  if (Array.isArray(reason)) return reason.length > 0 ? reason.join(', ') : '—'
  return String(reason)
}

/** Format amount in Indian locale */
const formatAmount = (amount) => {
  const num = parseFloat(amount)
  if (isNaN(num)) return amount || '—'
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** Format ISO date string to DD-MM-YYYY */
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    // requestDate from API is already YYYY-MM-DD — format nicely
    const [yyyy, mm, dd] = dateStr.split('-')
    if (yyyy && mm && dd) return `${dd}-${mm}-${yyyy}`
  } catch (_) { /* fallback */ }
  return dateStr
}

/** Skeleton loader row for table */
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-3 bg-gray-200 rounded w-full" />
      </td>
    ))}
  </tr>
)

/** Full-page error state with retry */
const ErrorState = ({ message, onRetry }) => (
  <div className="bg-white rounded-xl border border-red-100 shadow-sm py-14 text-center px-4">
    <p className="text-4xl mb-3">⚠️</p>
    <p className="text-red-600 font-semibold text-base mb-1">Failed to load requests</p>
    <p className="text-gray-400 text-sm mb-5">{message || 'An unexpected error occurred.'}</p>
    <button
      onClick={onRetry}
      className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
    >
      🔄 Retry
    </button>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const SharedMyRequests = ({ title = 'My Advance Requests' }) => {
  const dispatch = useDispatch()
  const requests = useSelector(selectMyRequests)
  const pagination = useSelector(selectPagination)
  const loading = useSelector(selectLoading)
  const errors = useSelector(selectErrors)

  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showClarifyModal, setShowClarifyModal] = useState(false)
  const [clarificationText, setClarificationText] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)

  // ── Derived flags ────────────────────────────────────────────────────────────
  const isLoading = loading.fetchMyRequests
  const isClarifying = loading.clarification
  const fetchError = errors.fetchMyRequests
  const charCount = clarificationText.trim().length
  const isCharValid = charCount >= CLARIFY_MIN_CHARS && charCount <= CLARIFY_MAX_CHARS
  const isSubmitDisabled = isClarifying || !isCharValid

  // ── Fetch on mount ───────────────────────────────────────────────────────────
  const loadRequests = useCallback(() => {
    dispatch(fetchMyRequests())
  }, [dispatch])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  // ── Date filter resets pagination ────────────────────────────────────────────
  const handleDateChange = (val) => {
    setDateFilter(val)
    setCurrentPage(1)
  }

  // ── Client-side filtering + pagination ──────────────────────────────────────
  const filteredRequests = requests.filter((r) => !dateFilter || r.requestDate === dateFilter)
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status?.includes('Pending')).length,
    approved: requests.filter((r) => r.status === 'Approved').length,
    rejected: requests.filter((r) => r.status?.includes('Rejected')).length,
  }

  // ── Clarification modal handlers ─────────────────────────────────────────────
  const openClarifyModal = (req) => {
    if (!req?.requestId) {
      toast.error('❌ Cannot open clarification — Request ID is missing.')
      return
    }
    setSelectedRequest(req)
    setClarificationText('')
    setShowClarifyModal(true)
  }

  const closeClarifyModal = () => {
    if (isClarifying) return // block close while submitting
    setShowClarifyModal(false)
    setClarificationText('')
    setSelectedRequest(null)
  }

  const submitClarification = async () => {
    // ── Client-side guard ──────────────────────────────────────────────────────
    if (!selectedRequest?.requestId) {
      toast.error('❌ Request ID missing. Please refresh and try again.')
      return
    }
    if (!clarificationText.trim()) {
      toast.error('❌ Clarification cannot be empty.')
      return
    }
    if (charCount < CLARIFY_MIN_CHARS) {
      toast.error(`❌ Clarification must be at least ${CLARIFY_MIN_CHARS} characters.`)
      return
    }
    if (charCount > CLARIFY_MAX_CHARS) {
      toast.error(`❌ Clarification cannot exceed ${CLARIFY_MAX_CHARS} characters.`)
      return
    }

    try {
      const result = await dispatch(
        submitClarificationThunk({
          requestId: selectedRequest.requestId,
          clarification: clarificationText.trim(),
        })
      )

      if (submitClarificationThunk.fulfilled.match(result)) {
        // ✅ Success
        closeClarifyModal()
        toast.success('✅ Clarification submitted. Your request has been sent for review.')
        // Refresh list from server to get latest status
        dispatch(fetchMyRequests())
      } else if (submitClarificationThunk.rejected.match(result)) {
        // ❌ Thunk-level rejection — server or validation error
        const errMsg = result.payload || 'Failed to submit clarification. Please try again.'
        toast.error(`❌ ${errMsg}`)
        // Keep modal open so user can fix and retry
      }
    } catch (error) {
      // ❌ Unexpected JS error (very rare)
      console.error('Clarification submission unexpected error:', error)
      toast.error(`❌ Unexpected error: ${error?.message || 'Please try again.'}`)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl px-6 py-5 mb-5 shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold text-white">📋 {title}</h1>
          <p className="text-green-100 text-sm mt-0.5">
            Track the live status of your submitted advance requests
          </p>
        </div>

        {/* ── Filter ─────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3 mb-5">
          <RequestFilter currentDate={dateFilter} onDateChange={handleDateChange} />
        </div>

        {/* ── Loading skeleton ────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden mb-5">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-green-600 text-white">
                    {['Request ID', 'Amount', 'Date', 'Reason', 'Status', 'Remarks', 'Action'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Error state ─────────────────────────────────────────────────────── */}
        {!isLoading && fetchError && (
          <ErrorState message={fetchError} onRetry={loadRequests} />
        )}

        {/* ── Empty state: no requests at all ─────────────────────────────────── */}
        {!isLoading && !fetchError && requests.length === 0 && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
            <p className="text-5xl mb-3">📭</p>
            <p className="text-gray-500 font-semibold text-base">No advance requests yet.</p>
            <p className="text-gray-400 text-sm mt-1">Submit a request to see your history here.</p>
          </div>
        )}

        {/* ── Empty state: date filter has no match ───────────────────────────── */}
        {!isLoading && !fetchError && requests.length > 0 && filteredRequests.length === 0 && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 font-semibold">No requests match the selected date.</p>
            <button
              onClick={() => handleDateChange('')}
              className="mt-4 text-sm text-green-600 underline hover:text-green-800"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* ── Data table ──────────────────────────────────────────────────────── */}
        {!isLoading && !fetchError && paginatedRequests.length > 0 && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden mb-5">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Request ID</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Reason</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Remarks</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {paginatedRequests.map((req, index) => {
                    const reasonStr = formatReasons(req.reason)
                    const remarksStr = req.remarks || '—'
                    const isRejected = req.status?.includes('Rejected')
                    const hasClarification = Boolean(req.clarification && req.clarification.trim())

                    return (
                      <tr
                        key={req.requestId || index}
                        className="hover:bg-green-50 transition-colors"
                      >
                        {/* Request ID */}
                        <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                          {req.requestId || '—'}
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 font-semibold text-green-700 whitespace-nowrap">
                          {formatAmount(req.amount)}
                        </td>

                        {/* Request Date */}
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {formatDate(req.requestDate)}
                        </td>

                        {/* Reasons (truncated with tooltip) */}
                        <td
                          className="px-4 py-3 text-gray-600 max-w-[150px] truncate"
                          title={reasonStr}
                        >
                          {reasonStr}
                        </td>

                        {/* Status badge */}
                        <td className="px-4 py-3">
                          <StatusBadge status={req.status} />
                        </td>

                        {/* Remarks (truncated with tooltip) */}
                        <td
                          className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate"
                          title={remarksStr !== '—' ? remarksStr : undefined}
                        >
                          {remarksStr}
                        </td>

                        {/* Action column */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isRejected && !hasClarification ? (
                            <button
                              onClick={() => openClarifyModal(req)}
                              className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full hover:bg-yellow-200 transition font-medium"
                            >
                              Add Clarification
                            </button>
                          ) : hasClarification ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                              ✓ Clarified
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ──────────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-green-100 flex-wrap gap-2">
                <p className="text-xs text-gray-400">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} of {filteredRequests.length}
                </p>
                <div className="flex gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="w-8 h-8 rounded-full text-sm font-semibold border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-full text-sm font-semibold transition ${page === currentPage
                          ? 'bg-green-600 text-white shadow'
                          : 'bg-white text-green-700 border border-green-300 hover:bg-green-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="w-8 h-8 rounded-full text-sm font-semibold border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Stats bar ───────────────────────────────────────────────────────── */}
        {!isLoading && !fetchError && requests.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {[
              { label: 'Total', count: stats.total, color: 'bg-gray-100 text-gray-700' },
              { label: 'Pending', count: stats.pending, color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Approved', count: stats.approved, color: 'bg-green-100 text-green-700' },
              { label: 'Rejected', count: stats.rejected, color: 'bg-red-100 text-red-700' },
            ].map(({ label, count, color }) => (
              <div key={label} className={`${color} rounded-xl px-4 py-3 text-center`}>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ── Clarification Modal ────────────────────────────────────────────────── */}
      {showClarifyModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeClarifyModal() }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

            {/* Modal header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800">Add Clarification</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Request ID:{' '}
                <span className="font-mono text-xs text-gray-600">
                  {selectedRequest?.requestId}
                </span>
              </p>
              {selectedRequest?.remarks && (
                <div className="mt-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                  <span className="font-semibold">Rejection reason: </span>
                  {selectedRequest.remarks}
                </div>
              )}
            </div>

            {/* Textarea */}
            <textarea
              rows={4}
              maxLength={CLARIFY_MAX_CHARS}
              className={`w-full border px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none mb-1 transition ${charCount > 0 && !isCharValid
                  ? 'border-red-300 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-green-400'
                }`}
              placeholder={`Enter your clarification (min ${CLARIFY_MIN_CHARS} characters)...`}
              value={clarificationText}
              onChange={(e) => setClarificationText(e.target.value)}
              disabled={isClarifying}
            />

            {/* Char counter */}
            <div className="flex justify-between items-center mb-4">
              <span className={`text-xs ${charCount > 0 && charCount < CLARIFY_MIN_CHARS
                  ? 'text-red-500'
                  : charCount >= CLARIFY_MIN_CHARS
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}>
                {charCount < CLARIFY_MIN_CHARS
                  ? `${CLARIFY_MIN_CHARS - charCount} more characters needed`
                  : `${charCount} / ${CLARIFY_MAX_CHARS} characters`}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={closeClarifyModal}
                disabled={isClarifying}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitClarification}
                disabled={isSubmitDisabled}
                className="px-5 py-2 rounded-lg text-sm bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isClarifying && (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                )}
                {isClarifying ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SharedMyRequests
