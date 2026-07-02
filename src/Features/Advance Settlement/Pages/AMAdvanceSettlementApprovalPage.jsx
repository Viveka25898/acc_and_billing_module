import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { AiOutlineEye } from 'react-icons/ai'
import ManagerClarificationModal from '../Components/ManagerClarificationModal'
import EmployeeAdvanceSettlementJV from '../Components/JVDisplay'
import { selectRole, selectEmpName, selectEmpId } from '../../../Auth/authSlice'

// ── Redux Thunks ──────────────────────────────────────────────────────────────
import {
  fetchAmQueue,
  approveAm,
  rejectAm,
} from '../../../store/slices/advanceSettlementSlice'

// ── Redux Selectors ───────────────────────────────────────────────────────────
import {
  selectApprovalQueue,
  selectQueueLoading,
  selectQueueError,
  selectApproveLoading,
  selectRejectLoading,
  selectQueuePagination,
} from '../../../store/slices/advanceSettlementSlice'

// ── Services ──────────────────────────────────────────────────────────────────
import { fetchSettlementById, fetchJvDetails } from '../services/advanceSettlementService'

// ── Helpers & Constants ───────────────────────────────────────────────────────
import { SETTLEMENT_STATUS, getStatusLabel } from '../utils/settlementConstants'

const getStatusBadgeClass = (status = '') => {
  const statusUpper = String(status).toUpperCase()
  if (
    statusUpper === 'PENDING_AM' ||
    statusUpper.includes('ACCOUNT MANAGER')
  ) {
    return 'bg-indigo-100 text-indigo-700 border border-indigo-200'
  }
  if (statusUpper === 'REJECTED') return 'bg-red-100 text-red-700 border border-red-200'
  if (statusUpper === 'APPROVED') return 'bg-green-100 text-green-700 border border-green-200'
  return 'bg-blue-100 text-blue-700 border border-blue-200'
}

const STATUS_ORDER = {
  [SETTLEMENT_STATUS.PENDING_AM]: 1,
}

const downloadBase64File = (base64Data, fileName) => {
  if (!base64Data) return
  const link = document.createElement('a')
  link.href = base64Data
  link.download = fileName || 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const constructJvData = (settlement, voucherNo, transactionId, costCenterId) => {
  // Do not add any entries on the frontend since they do not come from the backend.
  const entries = []

  const dateStr = settlement.approvedAt || settlement.submittedAt || settlement.updatedAt || null
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : null

  return {
    header: {
      company: null, // Not returned by backend -> will show '-'
      voucherNo: voucherNo || null,
      financialYear: null, // Not returned by backend -> will show '-'
      date: formattedDate,
      reference: settlement.settlementId || settlement.settlementNo || null,
    },
    entries,
    narration: voucherNo 
      ? `Advance settlement processed. Voucher No: ${voucherNo}. Transaction ID: ${transactionId || 'N/A'}. Cost Center ID: ${costCenterId || 'N/A'}`
      : null,
    approvals: {
      preparer: null, // Not returned by backend -> will show '-'
      reviewer: null, // Not returned by backend -> will show '-'
      approver: null, // Not returned by backend -> will show '-'
      date: formattedDate,
    },
    totals: {
      debit: 0,
      credit: 0,
    },
    balanceInfo: {
      osBalanceBefore: settlement.osBalanceBefore !== undefined ? Number(settlement.osBalanceBefore) : null,
      settlementAmount: settlement.totalAmount !== undefined ? Number(settlement.totalAmount) : null,
      osBalanceAfter: settlement.osBalanceAfter !== undefined ? Number(settlement.osBalanceAfter) : null,
    },
    employeeInfo: {
      employeeName: settlement.employeeName || null,
      employeeId: settlement.employeeId || null,
    },
  }
}

const AMAdvanceSettlementApprovalPage = () => {
  const dispatch = useDispatch()

  // ── Redux State ──────────────────────────────────────────────────────────────
  const queue       = useSelector(selectApprovalQueue)
  const loading     = useSelector(selectQueueLoading)
  const queueError  = useSelector(selectQueueError)
  const isApproving = useSelector(selectApproveLoading)
  const isRejecting = useSelector(selectRejectLoading)
  const pagination  = useSelector(selectQueuePagination)

  const currentRole = useSelector(selectRole)
  const currentEmpName = useSelector(selectEmpName)
  const currentEmpId = useSelector(selectEmpId)

  // ── Local UI State ────────────────────────────────────────────────────────────
  const [remarks, setRemarks]               = useState('')
  const [rejectId, setRejectId]             = useState(null)   // UUID of settlement being rejected
  const [approvingId, setApprovingId]       = useState(null)   // UUID for per-row spinner
  const [filters, setFilters]               = useState({ employee: '', status: 'All', date: '' })
  const [currentPage, setCurrentPage]       = useState(1)
  const [selectedClarificationReq, setSelectedClarificationReq] = useState(null)
  const [selectedJvData, setSelectedJvData] = useState(null)
  const [postApprovalLoading, setPostApprovalLoading] = useState(false)
  const ITEMS_PER_PAGE = 5

  const shouldShowClarification = (req) => {
    if (!req.clarification) return false
    if (!req.rejectedBy) {
      return req.status === SETTLEMENT_STATUS.PENDING_AM
    }

    const rejectedByLower = String(req.rejectedBy).toLowerCase()
    if (currentEmpName && rejectedByLower.includes(String(currentEmpName).toLowerCase())) return true
    if (currentEmpId && rejectedByLower.includes(String(currentEmpId).toLowerCase())) return true

    if (currentRole) {
      const normalizedRole = String(currentRole).toLowerCase().replace(/[-_]/g, ' ')
      const normalizedRejectedBy = rejectedByLower.replace(/[-_]/g, ' ')
      if (normalizedRejectedBy.includes(normalizedRole)) return true
      if (currentRole === 'account-manager' && (normalizedRejectedBy.includes('manager') || normalizedRejectedBy.includes('account manager'))) return true
    }

    return false
  }

  // ─── Load queue on mount ──────────────────────────────────────────────────
  const loadQueue = useCallback(async () => {
    try {
      await dispatch(fetchAmQueue({ page: currentPage, limit: ITEMS_PER_PAGE })).unwrap()
    } catch (err) {
      toast.error(`❌ Failed to load AM approval queue: ${typeof err === 'string' ? err : err?.message || 'Unknown error'}`)
    }
  }, [dispatch, currentPage])

  useEffect(() => { loadQueue() }, [loadQueue])

  // Toast Redux-level errors
  useEffect(() => { if (queueError) toast.error(`❌ ${queueError}`) }, [queueError])

  // ─── Approve ─────────────────────────────────────────────────────────────
  const handleApprove = async (id) => {
    try {
      setApprovingId(id)
      setPostApprovalLoading(true)

      // 1. Dispatch the approval API call to transition workflow status
      const actionResult = await dispatch(approveAm({ id, remarks: 'Approved by Account Manager' })).unwrap()
      toast.success('✅ Settlement approved and journal entries posted.')

      // Retrieve the canonical settlement number (SET-...) from the queue item
      const queueItem = queue.find(q => q.id === id) || {}
      const settlementId = queueItem.settlementId || queueItem.settlementNo || id

      // 2. Fetch the full details of this settlement to get expenseItems and employee GL code
      let detailedSettlement = null
      try {
        detailedSettlement = await fetchSettlementById(settlementId)
      } catch (err) {
        console.warn(`Failed to fetch settlement by settlementNo (${settlementId}), trying by UUID (${id})...`, err)
        try {
          detailedSettlement = await fetchSettlementById(id)
        } catch (uuidErr) {
          console.error('Failed to fetch settlement details by both keys:', uuidErr)
        }
      }

      // 3. Fetch the JV transaction details (voucher_no, ledger_transaction_id, cost_center_id)
      let jvDetails = null
      try {
        jvDetails = await fetchJvDetails(settlementId)
      } catch (err) {
        console.warn(`Failed to fetch JV details by settlementNo (${settlementId}), trying by UUID (${id})...`, err)
        try {
          jvDetails = await fetchJvDetails(id)
        } catch (uuidErr) {
          console.error('Failed to fetch JV details by both keys:', uuidErr)
        }
      }

      // 4. Construct the JV entries and header data for the modal display
      // Fallback: If detail fetch failed, use actionResult or the queue item
      console.log('[AM Approval] detailedSettlement:', detailedSettlement)
      console.log('[AM Approval] actionResult:', actionResult)
      console.log('[AM Approval] queueItem:', queueItem)
      console.log('[AM Approval] jvDetails:', jvDetails)

      const settlementObj = detailedSettlement || actionResult?.updated || queueItem || {}
      
      const voucherNo = jvDetails?.data?.voucher_no || actionResult?.updated?.voucherNo || settlementObj.voucherNo || 'N/A'
      const transactionId = jvDetails?.data?.ledger_transaction_id || actionResult?.updated?.ledgerTransactionId || settlementObj.ledgerTransactionId || 'N/A'
      const costCenterId = jvDetails?.data?.cost_center_id || actionResult?.updated?.costCenterId || settlementObj.costCenterId || 'N/A'

      const jvDisplayPayload = constructJvData(settlementObj, voucherNo, transactionId, costCenterId)
      console.log('[AM Approval] constructed jvDisplayPayload:', jvDisplayPayload)
      
      setSelectedJvData(jvDisplayPayload)
      console.log('[AM Approval] setSelectedJvData called!')

      // 5. Reload the queue
      loadQueue()

    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Approval failed. Please try again.'
      toast.error(`❌ ${msg}`)
    } finally {
      setApprovingId(null)
      setPostApprovalLoading(false)
    }
  }

  // ─── Reject ───────────────────────────────────────────────────────────────
  const handleReject = async () => {
    try {
      if (!rejectId) { toast.error('❌ Invalid settlement. Please refresh.'); return }
      if (!remarks.trim()) { toast.error('❌ Please provide rejection remarks.'); return }
      if (remarks.trim().length < 5) { toast.error('❌ Remarks must be at least 5 characters.'); return }

      await dispatch(rejectAm({ id: rejectId, remarks: remarks.trim() })).unwrap()

      toast.success('✅ Settlement rejected — employee will be notified.')
      setRemarks('')
      setRejectId(null)
      loadQueue()
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Rejection failed. Please try again.'
      toast.error(`❌ ${msg}`)
    }
  }

  const isActionAllowed = (s) => {
    if (!s || !s.status) return false
    const statusUpper = String(s.status).toUpperCase()
    return (
      statusUpper === 'PENDING_AM' ||
      statusUpper.includes('ACCOUNT MANAGER')
    )
  }

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
    .sort((a, b) => {
      const getPriority = (status) => {
        const u = String(status || '').toUpperCase()
        if (u.includes('PENDING')) return 1
        return 99
      }
      return getPriority(a.status) - getPriority(b.status)
    })

  const totalPages      = pagination?.totalPages || 1
  const paginatedQueue  = filteredQueue

  return (
    <div className="px-4 py-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-6 shadow">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            ✅ Advance Settlements – Account Manager Approval
          </h1>
          <p className="text-green-100 text-sm mt-0.5">
            Review and approve / reject settlement requests for your queue
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

        {/* ── Loading spinner ──────────────────────────────────────────────── */}
        {(loading || postApprovalLoading) && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────────────────── */}
        {!(loading || postApprovalLoading) && filteredQueue.length === 0 && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No settlement requests found.</p>
            <p className="text-sm text-gray-400 mt-1">
              {filters.employee || filters.status !== 'All' || filters.date
                ? 'Try changing your filters.'
                : 'Settlement requests pending your approval will appear here.'}
            </p>
          </div>
        )}

        {/* ── Table ────────────────────────────────────────────────────────── */}
        {!(loading || postApprovalLoading) && paginatedQueue.length > 0 && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">

                <thead>
                  <tr className="bg-green-600 text-white text-left">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">#</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Employee ID</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Employee Name</th>
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

                        {/* Employee Name */}
                        <td className="px-4 py-3 text-gray-800">
                          {req.employeeName || '—'}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {dateStr || '—'}
                        </td>

                        {/* Excel File */}
                        <td className="px-4 py-3 text-gray-700">
                          {req.excelFile?.data ? (
                            <button
                              onClick={() => downloadBase64File(req.excelFile.data, req.excelFile.name)}
                              className="text-green-600 hover:text-green-800 hover:underline font-semibold text-xs text-left line-clamp-1 cursor-pointer"
                              title={req.excelFile.name}
                            >
                              📎 {req.excelFile.name}
                            </button>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Attachments */}
                        <td className="px-4 py-3 text-gray-700">
                          {Array.isArray(req.attachments) && req.attachments.length > 0 ? (
                            <div className="flex flex-col gap-1 max-w-[150px]">
                              {req.attachments.map((file, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => downloadBase64File(file.data, file.name)}
                                  className="text-green-600 hover:text-green-800 hover:underline font-semibold text-xs text-left line-clamp-1 cursor-pointer"
                                  title={file.name}
                                >
                                  📎 {file.name}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

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
                              disabled={!actionable || isThisApproving || isApproving}
                              onClick={() => handleApprove(req.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition min-w-[70px] flex items-center justify-center gap-1 ${
                                actionable && !isThisApproving && !isApproving
                                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {isThisApproving ? (
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
                              disabled={!actionable || isRejecting}
                              onClick={() => { setRejectId(req.id); setRemarks('') }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition min-w-[60px] ${
                                actionable && !isRejecting
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
                disabled={isRejecting}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting || remarks.trim().length < 5}
                className="px-5 py-2 rounded-lg text-sm bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isRejecting ? (
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

      {/* ── JV Details Modal ─────────────────────────────────────────────── */}
      {selectedJvData !== null && (
        <EmployeeAdvanceSettlementJV
          data={selectedJvData}
          onClose={() => setSelectedJvData(null)}
        />
      )}
    </div>
  )
}

export default AMAdvanceSettlementApprovalPage
