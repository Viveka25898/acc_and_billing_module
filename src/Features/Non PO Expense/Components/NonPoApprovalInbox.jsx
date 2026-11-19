/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { selectAuthContext } from '../../../Auth/authSlice'
import {
  WORKFLOW_STATUS,
  EXPENSE_TYPES,
  URGENCY_OPTIONS,
  formatAmountINR,
  formatDateDMY,
} from '../config/nonPoExpenseConfig'
import {
  getPendingApprovalsForRole,
  approveExpenseRequest,
  rejectExpenseRequest,
} from '../data/nonPoExpenseMockData'
import NonPoStatusBadge from './NonPoStatusBadge'
import NonPoUrgencyBadge from './NonPoUrgencyBadge'
import NonPoBankPassbookModal from './NonPoBankPassbookModal'
import NonPoRejectModal from './NonPoRejectModal'
import NonPoClaimDetailDrawer from './NonPoClaimDetailDrawer'
import NonPoGstEntryModal from './NonPoGstEntryModal'
import NonPoExpenseVoucherModal from './NonPoExpenseVoucherModal'

const NonPoApprovalInbox = ({
  role = 'regional-head',
  roleTitle = 'Regional Head',
}) => {
  const authContext = useSelector(selectAuthContext)

  // ─── Data State ─────────────────────────────────────────────────────────────
  const [allRequests, setAllRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending') // 'pending' | 'all'

  // Loading indicator map for per-row approve actions
  const [approvingIds, setApprovingIds] = useState({})
  const [isRejecting, setIsRejecting] = useState(false)

  // Modals state
  const [selectedPassbookClaim, setSelectedPassbookClaim] = useState(null)
  const [selectedRejectClaim, setSelectedRejectClaim] = useState(null)
  const [selectedDetailClaim, setSelectedDetailClaim] = useState(null)

  // ─── AM 2-Step Voucher Modals State ─────────────────────────────────────────
  const [selectedGstEntryClaim, setSelectedGstEntryClaim] = useState(null)
  const [selectedVoucherData, setSelectedVoucherData] = useState(null)
  const [isPostingVoucher, setIsPostingVoucher] = useState(false)

  // ─── Filters State ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [expenseTypeFilter, setExpenseTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // ─── Pagination UI State (Managed as pure UI) ───────────────────────────────
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // ─── Load Requests ──────────────────────────────────────────────────────────
  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await getPendingApprovalsForRole(role)
      setAllRequests(data.all || [])
    } catch (err) {
      toast.error('Failed to load pending approval requests.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [role])

  // ─── Target Status for this Approver Role ───────────────────────────────────
  const rolePendingStatus = useMemo(() => {
    if (role === 'regional-head' || role === 'line-manager') return WORKFLOW_STATUS.PENDING_RH
    if (role === 'avp-operations') return WORKFLOW_STATUS.PENDING_AVP
    if (role === 'vp-operations') return WORKFLOW_STATUS.PENDING_VP
    if (role === 'ae') return WORKFLOW_STATUS.PENDING_AE
    if (role === 'account-manager') return WORKFLOW_STATUS.PENDING_AM
    return WORKFLOW_STATUS.PENDING_RH
  }, [role])

  // ─── KPI Stats Calculations ─────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const pendingList = allRequests.filter((r) => r.workflowStatus === rolePendingStatus)
    const pendingCount = pendingList.length
    const pendingTotalAmount = pendingList.reduce((acc, r) => acc + (Number(r.amountRequested) || 0), 0)
    const criticalCount = pendingList.filter((r) => r.urgency === 'critical').length
    const totalProcessed = allRequests.filter((r) => r.workflowStatus !== rolePendingStatus).length

    return {
      pendingCount,
      pendingTotalAmount,
      criticalCount,
      totalProcessed,
    }
  }, [allRequests, rolePendingStatus])

  // ─── Filtered and Sorted Requests ───────────────────────────────────────────
  const filteredRequests = useMemo(() => {
    return allRequests
      .filter((req) => {
        // Tab Filter
        if (activeTab === 'pending' && req.workflowStatus !== rolePendingStatus) {
          return false
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const matchId = req.claimId?.toLowerCase().includes(q)
          const matchEmp = req.employeeName?.toLowerCase().includes(q)
          const matchCode = req.employeeCode?.toLowerCase().includes(q)
          const matchSite = req.siteName?.toLowerCase().includes(q)
          const matchPayee = req.accountHolderName?.toLowerCase().includes(q)
          const matchAmt = String(req.amountRequested || '').includes(q)
          if (!matchId && !matchEmp && !matchCode && !matchSite && !matchPayee && !matchAmt) {
            return false
          }
        }

        // Urgency Filter
        if (urgencyFilter !== 'all' && req.urgency !== urgencyFilter) {
          return false
        }

        // Expense Type Filter
        if (expenseTypeFilter !== 'all' && req.expenseType !== expenseTypeFilter) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.claimDate || 0) - new Date(a.claimDate || 0)
        if (sortBy === 'oldest') return new Date(a.claimDate || 0) - new Date(b.claimDate || 0)
        if (sortBy === 'amountDesc') return (b.amountRequested || 0) - (a.amountRequested || 0)
        if (sortBy === 'amountAsc') return (a.amountRequested || 0) - (b.amountRequested || 0)
        return 0
      })
  }, [allRequests, activeTab, rolePendingStatus, searchQuery, urgencyFilter, expenseTypeFilter, sortBy])

  // ─── Client-side Slice for Pagination UI ────────────────────────────────────
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredRequests.slice(startIndex, startIndex + pageSize)
  }, [filteredRequests, currentPage, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize))

  // ─── Action: Approve Claim ──────────────────────────────────────────────────
  const handleApprove = async (claim) => {
    // If current role is Account Manager or claim is pending AM approval,
    // open Modal 1 (GST Entry Modal) which precedes Expense Voucher generation
    if (role === 'account-manager' || claim.workflowStatus === WORKFLOW_STATUS.PENDING_AM) {
      setSelectedGstEntryClaim(claim)
      return
    }

    // Standard 1-second approval for prior workflow stages (RH, AVP, VP, AE)
    const cid = claim.claimId
    setApprovingIds((prev) => ({ ...prev, [cid]: true }))

    try {
      const approverName = authContext?.name || roleTitle
      const updated = await approveExpenseRequest(cid, role, approverName, 'Approved by ' + roleTitle)

      // Update state locally
      setAllRequests((prev) => prev.map((r) => (r.claimId === cid ? updated : r)))

      toast.success(
        <div>
          <span className="font-bold">Claim {cid} Approved!</span>
          <p className="text-xs text-gray-600 mt-0.5">
            Advancing to next stage: {updated.currentStage}
          </p>
        </div>
      )

      if (selectedDetailClaim?.claimId === cid) {
        setSelectedDetailClaim(null)
      }
    } catch (err) {
      toast.error('Failed to approve claim. Please retry.')
    } finally {
      setApprovingIds((prev) => ({ ...prev, [cid]: false }))
    }
  }

  // ─── Action: AM Voucher Step 1 -> Step 2 (Open Expense Voucher Modal) ────────
  const handleGenerateVoucher = (gstData) => {
    const rawNum = String(gstData.claim?.claimId || '').replace(/\D/g, '').slice(-4) || '0001'
    const generatedVoucherNo = `EV-${new Date().getFullYear()}-${rawNum}`
    const todayStr = new Date().toISOString().slice(0, 10)

    setSelectedGstEntryClaim(null)
    setSelectedVoucherData({
      ...gstData,
      voucherNo: generatedVoucherNo,
      voucherDate: todayStr,
      isViewOnly: false,
    })
  }

  // ─── Action: AM Voucher Step 2 -> Back to Step 1 ─────────────────────────────
  const handleBackToGstEntry = () => {
    if (selectedVoucherData?.claim) {
      setSelectedGstEntryClaim(selectedVoucherData.claim)
    }
    setSelectedVoucherData(null)
  }

  // ─── Action: AM Post Voucher & Final Approve Claim ──────────────────────────
  const handlePostVoucher = async (voucherPayload) => {
    if (!voucherPayload?.claim) return
    const cid = voucherPayload.claim.claimId
    setIsPostingVoucher(true)

    try {
      const approverName = authContext?.name || roleTitle || 'Accounts Manager'
      const updated = await approveExpenseRequest(
        cid,
        'account-manager',
        approverName,
        'Approved by Accounts Manager - Expense Voucher Posted',
        voucherPayload
      )

      // Update state locally
      setAllRequests((prev) => prev.map((r) => (r.claimId === cid ? updated : r)))

      toast.success(
        <div>
          <span className="font-bold">Expense Voucher Posted & Claim Approved!</span>
          <p className="text-xs text-gray-600 mt-0.5">
            Voucher {voucherPayload.voucherNo} posted • Debited: {formatAmountINR(voucherPayload.totalAmount)}
          </p>
        </div>
      )

      setSelectedVoucherData(null)
      if (selectedDetailClaim?.claimId === cid) {
        setSelectedDetailClaim(null)
      }
    } catch (err) {
      toast.error('Failed to post expense voucher. Please retry.')
    } finally {
      setIsPostingVoucher(false)
    }
  }

  // ─── Action: View Posted Voucher (View-only modal) ──────────────────────────
  const handleViewVoucher = (claim) => {
    if (claim.expenseVoucher) {
      setSelectedVoucherData({
        ...claim.expenseVoucher,
        claim,
        isViewOnly: true,
      })
    }
  }

  // ─── Action: Reject Claim (via Rejection Modal) ──────────────────────────────
  const handleConfirmReject = async (claimId, reason) => {
    setIsRejecting(true)
    try {
      const approverName = authContext?.name || roleTitle
      const updated = await rejectExpenseRequest(claimId, role, approverName, reason)

      // Update state locally
      setAllRequests((prev) => prev.map((r) => (r.claimId === claimId ? updated : r)))

      toast.info(`Claim ${claimId} has been rejected.`)
      setSelectedRejectClaim(null)
      if (selectedDetailClaim?.claimId === claimId) {
        setSelectedDetailClaim(null)
      }
    } catch (err) {
      toast.error('Failed to reject claim. Please retry.')
    } finally {
      setIsRejecting(false)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setUrgencyFilter('all')
    setExpenseTypeFilter('all')
    setSortBy('newest')
    setCurrentPage(1)
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Page Header Strip ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Non-PO Expense Approvals
            </h1>
            <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-white/30">
              {roleTitle}
            </span>
          </div>
          <p className="text-green-100 text-xs sm:text-sm">
            Review emergency site expenditure claims, verify bank passbooks, and approve disbursements.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-green-800/60 p-1 rounded-xl border border-green-500/30">
          <button
            type="button"
            onClick={() => {
              setActiveTab('pending')
              setCurrentPage(1)
            }}
            className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-white text-green-800 shadow-sm'
                : 'text-green-100 hover:text-white'
            }`}
          >
            <span>⏳ Pending My Action</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-green-700 text-white'
              }`}
            >
              {kpis.pendingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('all')
              setCurrentPage(1)
            }}
            className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-green-800 shadow-sm'
                : 'text-green-100 hover:text-white'
            }`}
          >
            <span>📑 All Claims History</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'all'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-green-700 text-white'
              }`}
            >
              {allRequests.length}
            </span>
          </button>
        </div>
      </div>

      {/* ── KPI Summary Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1">
            <span>Pending Approval</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {kpis.pendingCount}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Awaiting {roleTitle} sign-off</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1">
            <span>Pending Value (₹)</span>
            <span className="text-green-600 font-bold">₹</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-800 truncate">
            {formatAmountINR(kpis.pendingTotalAmount)}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Emergency disbursement sum</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1">
            <span>Critical Urgency</span>
            <span className="text-red-500 font-bold">🔥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600">
            {kpis.criticalCount}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Requires same-day approval</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1">
            <span>Total In Register</span>
            <span className="text-blue-600 font-bold">📊</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            {allRequests.length}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Cumulative role archive</div>
        </div>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search Claim ID, site, employee, payee..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50/50"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm pointer-events-none">
              🔍
            </span>
          </div>

          {/* Urgency Filter */}
          <div>
            <select
              value={urgencyFilter}
              onChange={(e) => {
                setUrgencyFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white cursor-pointer"
            >
              <option value="all">All Urgencies</option>
              {URGENCY_OPTIONS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {/* Expense Type Filter */}
          <div>
            <select
              value={expenseTypeFilter}
              onChange={(e) => {
                setExpenseTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white cursor-pointer"
            >
              <option value="all">All Expense Types</option>
              {EXPENSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amountDesc">Sort: Highest Amount</option>
              <option value="amountAsc">Sort: Lowest Amount</option>
            </select>

            {(searchQuery || urgencyFilter !== 'all' || expenseTypeFilter !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-xl transition cursor-pointer"
                title="Clear Filters"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Table Container (Contained Horizontal Scrollbar inside Table, not page) ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Table scroll container - Normal browser scrollbar */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[1100px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3.5 px-3 text-center w-14 font-bold">Sr. No.</th>
                <th className="py-3.5 px-4">Claim ID & Date</th>
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Site & Cost Centre</th>
                <th className="py-3.5 px-4">Expense & Urgency</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                <th className="py-3.5 px-4">Bank & Proof</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                      <span className="text-xs font-medium">Loading claims...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <span className="text-3xl">📭</span>
                      <p className="font-semibold text-gray-700 text-sm">
                        {activeTab === 'pending'
                          ? 'No pending claims requiring your approval.'
                          : 'No claims match your filter criteria.'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {activeTab === 'pending'
                          ? 'All claims have been reviewed or are in other stages.'
                          : 'Try resetting the filters or searching with different terms.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((claim, index) => {
                  const isActionable = claim.workflowStatus === rolePendingStatus
                  const isApproving = approvingIds[claim.claimId] || false

                  return (
                    <tr
                      key={claim.claimId}
                      className="hover:bg-green-50/30 transition border-b border-gray-100"
                    >
                      {/* Sr. No. */}
                      <td className="py-3.5 px-3 text-center font-mono text-gray-500 font-semibold text-xs">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      {/* 1. Claim ID & Date */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setSelectedDetailClaim(claim)}
                          className="font-mono font-bold text-green-700 hover:text-green-900 hover:underline block text-left cursor-pointer"
                          title="Click to view full claim details"
                        >
                          {claim.claimId}
                        </button>
                        <span className="text-gray-400 text-[11px] block mt-0.5">
                          {formatDateDMY(claim.claimDate)}
                        </span>
                      </td>

                      {/* 2. Requester */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-800">{claim.employeeName}</div>
                        <div className="text-gray-400 text-[11px]">
                          {claim.requesterRole} • Region {claim.region}
                        </div>
                      </td>

                      {/* 3. Site & Cost Centre */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-medium text-gray-800 truncate" title={claim.siteName}>
                          {claim.siteName}
                        </div>
                        <div className="text-gray-500 text-[11px] font-mono">
                          {claim.costCentre}
                          {claim.billable === 'Yes' && (
                            <span className="ml-1 text-green-700 font-sans font-semibold">
                              (Billable)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 4. Expense & Urgency */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-800 text-xs">
                          {claim.expenseType}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate max-w-[180px] mb-1" title={claim.categoryName}>
                          {claim.categoryName}
                        </div>
                        <NonPoUrgencyBadge urgency={claim.urgency} />
                      </td>

                      {/* 5. Requested Amount */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-extrabold text-green-800 text-sm">
                          {formatAmountINR(claim.amountRequested)}
                        </span>
                      </td>

                      {/* 6. Bank & Passbook Proof (With Eye icon) */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-gray-800 truncate max-w-[160px]" title={claim.accountHolderName}>
                          {claim.accountHolderName}
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          {claim.bankAccountNo ? `A/C •••• ${claim.bankAccountNo.slice(-4)}` : '—'}
                        </div>
                        {/* Eye Icon for Bank Passbook Modal */}
                        <button
                          type="button"
                          onClick={() => setSelectedPassbookClaim(claim)}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md transition shadow-2xs cursor-pointer"
                          title="View Bank Passbook / Cancelled Cheque proof"
                        >
                          <span>👁️</span> Passbook Proof
                        </button>
                      </td>

                      {/* 7. Status */}
                      <td className="py-3.5 px-4">
                        <NonPoStatusBadge status={claim.workflowStatus} />
                      </td>

                      {/* 8. Action Buttons (Approve & Reject with 1-sec loader) */}
                      <td className="py-3.5 px-4 text-center">
                        {isActionable ? (
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Approve Button */}
                            <button
                              type="button"
                              onClick={() => handleApprove(claim)}
                              disabled={isApproving}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 active:scale-[0.98] rounded-lg shadow-2xs transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                              title="Approve and forward to next stage"
                            >
                              {isApproving ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                  <span>...</span>
                                </>
                              ) : (
                                <>
                                  <span>✓</span> Approve
                                </>
                              )}
                            </button>

                            {/* Reject Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedRejectClaim(claim)}
                              disabled={isApproving}
                              className="px-2.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                              title="Reject with mandatory reason"
                            >
                              <span>✕</span> Reject
                            </button>

                            {/* Details Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedDetailClaim(claim)}
                              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                              title="View full claim details"
                            >
                              ℹ️
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            {claim.expenseVoucher && (
                              <button
                                type="button"
                                onClick={() => handleViewVoucher(claim)}
                                className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer"
                                title="View formal Expense Voucher"
                              >
                                <span>📑</span> Voucher
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedDetailClaim(claim)}
                              className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination UI (Pure UI ready for backend integration) ─────────── */}
        <div className="bg-gray-50/90 border-t border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Entries summary */}
          <div className="text-gray-500">
            Showing{' '}
            <span className="font-semibold text-gray-700">
              {filteredRequests.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * pageSize, filteredRequests.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-700">{filteredRequests.length}</span>{' '}
            entries
          </div>

          {/* Rows per page selector & Navigation buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="border border-gray-300 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition font-mono text-xs cursor-pointer disabled:cursor-not-allowed"
                title="First Page"
              >
                ««
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition text-xs font-medium cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <span className="px-3 py-1 font-bold text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition text-xs font-medium cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition font-mono text-xs cursor-pointer disabled:cursor-not-allowed"
                title="Last Page"
              >
                »»
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS ─────────────────────────────────────────────────────────── */}

      {/* 1. Bank Passbook Image Modal (Eye icon trigger) */}
      <NonPoBankPassbookModal
        isOpen={Boolean(selectedPassbookClaim)}
        claim={selectedPassbookClaim}
        onClose={() => setSelectedPassbookClaim(null)}
      />

      {/* 2. Rejection Reason Modal */}
      <NonPoRejectModal
        isOpen={Boolean(selectedRejectClaim)}
        claim={selectedRejectClaim}
        isRejecting={isRejecting}
        onClose={() => setSelectedRejectClaim(null)}
        onConfirmReject={handleConfirmReject}
      />

      {/* 3. Claim Full Details Drawer / Modal */}
      <NonPoClaimDetailDrawer
        isOpen={Boolean(selectedDetailClaim)}
        claim={selectedDetailClaim}
        canAction={selectedDetailClaim?.workflowStatus === rolePendingStatus}
        isApproving={selectedDetailClaim ? approvingIds[selectedDetailClaim.claimId] : false}
        onClose={() => setSelectedDetailClaim(null)}
        onApprove={(claim) => handleApprove(claim)}
        onReject={(claim) => {
          setSelectedDetailClaim(null)
          setSelectedRejectClaim(claim)
        }}
        onOpenPassbook={(claim) => setSelectedPassbookClaim(claim)}
        onViewVoucher={(claim) => handleViewVoucher(claim)}
      />

      {/* 4. AM Step 1: GST Entry Modal (Direct total GST input, Intra/Inter selector, Bill Preview) */}
      <NonPoGstEntryModal
        isOpen={Boolean(selectedGstEntryClaim)}
        claim={selectedGstEntryClaim}
        onClose={() => setSelectedGstEntryClaim(null)}
        onGenerateVoucher={handleGenerateVoucher}
      />

      {/* 5. AM Step 2: Formal Expense Voucher Modal (ERP style, X2003001/L2001003 GLs, Debit/Credit balanced) */}
      <NonPoExpenseVoucherModal
        isOpen={Boolean(selectedVoucherData)}
        voucherData={selectedVoucherData}
        isPosting={isPostingVoucher}
        isViewOnly={selectedVoucherData?.isViewOnly || false}
        onClose={() => setSelectedVoucherData(null)}
        onBack={handleBackToGstEntry}
        onPostVoucher={handlePostVoucher}
      />
    </div>
  )
}

export default NonPoApprovalInbox
