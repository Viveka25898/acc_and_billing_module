/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuthContext } from '../../../Auth/authSlice'
import {
  formatAmountINR,
  formatDateDMY,
  WORKFLOW_STATUS,
} from '../config/nonPoExpenseConfig'
import { getMyExpenseRequests } from '../data/nonPoExpenseMockData'
import NonPoStatusBadge from './NonPoStatusBadge'
import NonPoUrgencyBadge from './NonPoUrgencyBadge'

const NonPoMyRequests = ({
  role = 'employee',
  title = 'My Non-PO Expense Requests',
  createPath = '/dashboard/employee/non-po-expense-request',
  editPathPrefix = '/dashboard/employee/non-po-expense-request/edit',
}) => {
  const navigate = useNavigate()
  const authContext = useSelector(selectAuthContext)

  // ─── Data State ───────────────────────────────────────────────────────────
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  // ─── Filters & Search State ───────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [urgencyFilter, setUrgencyFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // ─── Fetch Requests ───────────────────────────────────────────────────────
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const data = await getMyExpenseRequests(authContext?.empId)
      setRequests(data)
    } catch (err) {
      console.error('Failed to load expense requests', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // ─── Filter Logic ─────────────────────────────────────────────────────────
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Status Filter
      if (statusFilter !== 'ALL' && req.workflowStatus !== statusFilter) {
        return false
      }
      // Urgency Filter
      if (urgencyFilter !== 'ALL' && (req.urgency || '').toLowerCase() !== urgencyFilter.toLowerCase()) {
        return false
      }
      // Date Filter
      if (dateFilter && req.claimDate !== dateFilter) {
        return false
      }
      // Search Query (Claim ID, Site, Account Holder, Bank Name, Expense Type)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches =
          (req.claimId || '').toLowerCase().includes(q) ||
          (req.siteName || '').toLowerCase().includes(q) ||
          (req.accountHolderName || req.payeeName || '').toLowerCase().includes(q) ||
          (req.bankName || '').toLowerCase().includes(q) ||
          (req.bankAccountNo || '').toLowerCase().includes(q) ||
          (req.expenseType || '').toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })
  }, [requests, statusFilter, urgencyFilter, dateFilter, searchQuery])

  // ─── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize))
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRequests.slice(start, start + pageSize)
  }, [filteredRequests, currentPage, pageSize])

  // ─── Statistics Counters ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    return {
      total: requests.length,
      drafts: requests.filter((r) => r.workflowStatus === WORKFLOW_STATUS.DRAFT).length,
      pending: requests.filter((r) => r.workflowStatus.includes('Pending')).length,
      approved: requests.filter((r) => r.workflowStatus === WORKFLOW_STATUS.APPROVED_ACCOUNTS).length,
      rejected: requests.filter((r) => r.workflowStatus === WORKFLOW_STATUS.REJECTED).length,
    }
  }, [requests])

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto space-y-6">

      {/* ── Page Header Strip ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📋</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          <p className="text-green-100 text-xs sm:text-sm">
            Track and monitor the real-time approval status of your raised emergency and non-PO claims.
          </p>
        </div>
        <NavLink
          to={createPath}
          className="bg-white text-green-800 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-green-50 shadow-md transition flex items-center gap-2"
        >
          <span>➕</span> Raise Non-PO Request
        </NavLink>
      </div>

      {/* ── Status KPI Counter Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Claims</p>
          <p className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Drafts</p>
          <p className="text-xl sm:text-2xl font-extrabold text-gray-600 mt-1">{stats.drafts}</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-xl p-3.5 shadow-xs bg-amber-50/30">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">In Approval</p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white border border-green-200 rounded-xl p-3.5 shadow-xs bg-green-50/30">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Approved</p>
          <p className="text-xl sm:text-2xl font-extrabold text-green-700 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-3.5 shadow-xs bg-red-50/30 col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">Rejected</p>
          <p className="text-xl sm:text-2xl font-extrabold text-red-700 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Search Claims</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Claim ID, Site, Payee..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Status Dropdown Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Workflow Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ALL">All Statuses</option>
              <option value={WORKFLOW_STATUS.DRAFT}>Draft</option>
              <option value={WORKFLOW_STATUS.PENDING_RH}>Pending with Regional Head</option>
              <option value={WORKFLOW_STATUS.PENDING_AVP}>Pending with AVP</option>
              <option value={WORKFLOW_STATUS.PENDING_VP}>Pending with VP</option>
              <option value={WORKFLOW_STATUS.PENDING_AE}>Pending with AE</option>
              <option value={WORKFLOW_STATUS.PENDING_AM}>Pending with Accounts Manager</option>
              <option value={WORKFLOW_STATUS.APPROVED_ACCOUNTS}>Approved (Accounts Processing)</option>
              <option value={WORKFLOW_STATUS.REJECTED}>Rejected</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Urgency</label>
            <select
              value={urgencyFilter}
              onChange={(e) => {
                setUrgencyFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ALL">All Urgencies</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Claim Date</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter('')}
                  className="px-2.5 py-1 text-xs text-gray-500 hover:text-red-500 border border-gray-300 rounded-lg hover:bg-gray-50"
                  title="Clear Date"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Table Container ────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5 font-bold">Claim ID</th>
                <th className="px-4 py-3.5 font-bold">Claim Date</th>
                <th className="px-4 py-3.5 font-bold">Expense Type</th>
                <th className="px-4 py-3.5 font-bold">Site & Location</th>
                <th className="px-4 py-3.5 font-bold">Urgency</th>
                <th className="px-4 py-3.5 font-bold">Amount</th>
                <th className="px-4 py-3.5 font-bold">Workflow Status</th>
                <th className="px-4 py-3.5 font-bold">Current Stage</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-500">
                    <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="font-medium text-sm">Loading your expense claims...</p>
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-500">
                    <span className="text-4xl block mb-2">📭</span>
                    <p className="font-bold text-gray-700 text-base">No Expense Claims Found</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                      {searchQuery || statusFilter !== 'ALL' || urgencyFilter !== 'ALL' || dateFilter
                        ? 'No claims match your selected filters. Try clearing them.'
                        : 'You have not submitted any Non-PO expense claims yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => {
                  const isDraft = req.workflowStatus === WORKFLOW_STATUS.DRAFT
                  return (
                    <tr
                      key={req.claimId}
                      className="hover:bg-green-50/40 transition-colors"
                    >
                      {/* Claim ID */}
                      <td className="px-4 py-3 font-mono font-bold text-green-700 whitespace-nowrap">
                        {req.claimId}
                      </td>

                      {/* Claim Date */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatDateDMY(req.claimDate)}
                      </td>

                      {/* Expense Type */}
                      <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                        {req.expenseType}
                        {req.billable === 'Yes' && (
                          <span className="ml-1.5 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-semibold">
                            Billable
                          </span>
                        )}
                      </td>

                      {/* Site */}
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={req.siteName}>
                        <div className="font-medium text-gray-800 truncate">{req.siteName}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{req.costCentre}</div>
                      </td>

                      {/* Urgency */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <NonPoUrgencyBadge urgency={req.urgency} />
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                        {formatAmountINR(req.amountRequested)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <NonPoStatusBadge status={req.workflowStatus} />
                      </td>

                      {/* Current Stage */}
                      <td className="px-4 py-3 text-xs font-semibold text-gray-600 whitespace-nowrap">
                        {req.currentStage}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {isDraft ? (
                          <button
                            type="button"
                            onClick={() => navigate(`${editPathPrefix}/${req.claimId}`)}
                            className="text-xs bg-amber-50 text-amber-700 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-100 font-semibold transition inline-flex items-center gap-1 shadow-2xs"
                          >
                            <span>✏️</span> Edit Draft
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              // Toast or view placeholder until RequestDetail is mounted
                              toast.info(`Claim: ${req.claimId} | Status: ${req.workflowStatus}`)
                            }}
                            className="text-xs bg-white text-green-700 border border-green-300 px-3 py-1.5 rounded-lg hover:bg-green-50 font-semibold transition shadow-2xs"
                          >
                            View Details →
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ────────────────────────────────────────────── */}
        {!loading && filteredRequests.length > 0 && (
          <div className="bg-gray-50/70 border-t border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-gray-500">
              Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(currentPage * pageSize, filteredRequests.length)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{filteredRequests.length}</span> claims
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
              >
                ‹ Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg font-semibold transition ${
                    page === currentPage
                      ? 'bg-green-600 text-white shadow-xs'
                      : 'border border-gray-300 text-gray-700 hover:bg-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default NonPoMyRequests
