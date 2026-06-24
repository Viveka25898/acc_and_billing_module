import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineEye } from 'react-icons/ai'
import { toast } from 'react-toastify'

// ── Redux Thunks & Selectors ──────────────────────────────────────────────────
import {
  fetchMySettlements,
  fetchOsBalance,
  setFilters,
  resetFilters,
} from '../../../store/slices/advanceSettlementSlice'
import {
  selectMySettlements,
  selectOsBalance,
  selectMySettlementsLoading,
  selectMySettlementsError,
  selectOsBalanceLoading,
  selectMySettlementsPagination,
  selectSettlementFilters,
} from '../../../store/slices/advanceSettlementSlice'

// ── Auth Selectors ────────────────────────────────────────────────────────────
import { selectEmpId } from '../../../Auth/authSlice'

// ── Constants & Helpers ───────────────────────────────────────────────────────
import { getStatusLabel, getStatusColor, SETTLEMENT_STATUS } from '../utils/settlementConstants'

import RejectionReasonModal from './RejectionReasonModal'

// ─── Filter Status Options ────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { label: 'All',      value: '' },
  { label: 'Pending',  value: 'PENDING' },
  { label: 'Approved', value: SETTLEMENT_STATUS.APPROVED },
  { label: 'Rejected', value: SETTLEMENT_STATUS.REJECTED },
]

// ─── FilterBar Component ──────────────────────────────────────────────────────
const FilterBar = ({ selectedStatus, onStatusChange, selectedDate, onDateChange, loading }) => (
  <div className="w-full flex flex-col md:flex-row gap-4 mb-6 px-6">
    <div className="w-full md:w-1/3">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Filter by Date</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        disabled={loading}
        className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-60"
      />
    </div>
    <div className="w-full md:w-1/3">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Filter by Status</label>
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        disabled={loading}
        className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-60 bg-white"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
)

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="p-3 border">
        <div className="h-4 bg-gray-200 rounded w-full" />
      </td>
    ))}
  </tr>
)

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
  >
    {getStatusLabel(status)}
  </span>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const MySettlements = () => {
  const dispatch = useDispatch()

  // ── Redux State ──────────────────────────────────────────────────────────────
  const empId         = useSelector(selectEmpId)
  const settlements   = useSelector(selectMySettlements)
  const osBalanceData = useSelector(selectOsBalance)
  const loading       = useSelector(selectMySettlementsLoading)
  const osLoading     = useSelector(selectOsBalanceLoading)
  const error         = useSelector(selectMySettlementsError)
  const pagination    = useSelector(selectMySettlementsPagination)
  const filters       = useSelector(selectSettlementFilters)

  // ── Local UI State ───────────────────────────────────────────────────────────
  const [selectedReason, setSelectedReason]   = useState('')
  const [modalOpen, setModalOpen]             = useState(false)
  const [localStatus, setLocalStatus]         = useState('')
  const [localDate, setLocalDate]             = useState('')
  const [currentPage, setCurrentPage]         = useState(1)

  const osBalance = osBalanceData?.osBalance ?? 0
  const rowsPerPage = 10

  // ─── Fetch data on mount ───────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchMySettlements({ page: 1, limit: rowsPerPage }))
    if (empId) {
      dispatch(fetchOsBalance(empId))
    }
  }, [dispatch, empId])

  // ─── Re-fetch when filters or page changes ────────────────────────────────
  const applyFilters = useCallback(() => {
    // For 'PENDING' we don't pass a direct status filter value since
    // there are multiple pending statuses — fetch all and filter client-side
    const statusParam = localStatus === 'PENDING' ? '' : localStatus
    dispatch(fetchMySettlements({
      page:   currentPage,
      limit:  rowsPerPage,
      status: statusParam,
    }))
  }, [dispatch, localStatus, currentPage])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // ─── Client-side filtering for 'Pending' pseudo-filter ────────────────────
  const filteredSettlements = localStatus === 'PENDING'
    ? settlements.filter((s) =>
        s.status !== SETTLEMENT_STATUS.APPROVED && s.status !== SETTLEMENT_STATUS.REJECTED
      )
    : localDate
      ? settlements.filter((s) => {
          if (!s.submittedAt) return false
          const submittedDate = new Date(s.submittedAt).toISOString().split('T')[0]
          return submittedDate === localDate
        })
      : settlements

  // ─── Calculate total expense from expense items ───────────────────────────
  const calculateTotalAmount = (expenseItems = []) =>
    expenseItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

  const openModal = (reason) => {
    setSelectedReason(reason || 'No reason provided.')
    setModalOpen(true)
  }

  // ─── Pagination controls ─────────────────────────────────────────────────
  const totalPages = pagination.totalPages || 1

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  // ─── Status filter handler ─────────────────────────────────────────────────
  const handleStatusChange = (val) => {
    setLocalStatus(val)
    setCurrentPage(1)
  }

  const handleDateChange = (val) => {
    setLocalDate(val)
    setCurrentPage(1)
  }

  return (
    <div className="bg-white shadow-md rounded-xl pb-8 overflow-hidden">
      {/* Header */}
      <div className="bg-green-50 p-5 border-b border-green-100">
        <h3 className="text-2xl font-bold text-green-700">My Settlement Requests</h3>
        <div className="mt-2 flex items-center gap-4 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">O/S Balance:</span>
          {osLoading ? (
            <div className="w-24 h-7 bg-green-200 rounded animate-pulse" />
          ) : (
            <span className="text-2xl font-bold text-green-700">
              ₹{Number(osBalance).toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Based on actual GL transactions from the server
        </p>
      </div>

      {/* Filters */}
      <div className="pt-5">
        <FilterBar
          selectedStatus={localStatus}
          onStatusChange={handleStatusChange}
          selectedDate={localDate}
          onDateChange={handleDateChange}
          loading={loading}
        />
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="mx-6 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
          <button
            onClick={applyFilters}
            className="ml-auto text-red-600 hover:text-red-800 font-medium text-xs underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto px-6">
        <table className="min-w-full border text-sm bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border text-xs font-semibold text-gray-600 uppercase tracking-wide">#</th>
              <th className="p-3 border text-xs font-semibold text-gray-600 uppercase tracking-wide">Settlement ID</th>
              <th className="p-3 border text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
              <th className="p-3 border text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount (₹)</th>
              <th className="p-3 border text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
              <th className="p-3 border text-xs font-semibold text-gray-600 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Loading Skeleton */}
            {loading && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {/* Data Rows */}
            {!loading && filteredSettlements.map((req, idx) => {
              const amount = req.totalAmount > 0
                ? req.totalAmount
                : calculateTotalAmount(req.expenseItems)

              return (
                <tr
                  key={req.settlementId || req.id || idx}
                  className="hover:bg-gray-50 transition"
                >
                  {/* Row Number */}
                  <td className="p-3 border text-gray-500 text-xs">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>

                  {/* Settlement ID */}
                  <td className="p-3 border font-mono text-xs text-gray-700 whitespace-nowrap">
                    {req.settlementId || '—'}
                  </td>

                  {/* Date */}
                  <td className="p-3 border text-gray-700">
                    {req.submittedAt
                      ? new Date(req.submittedAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })
                      : '—'
                    }
                  </td>

                  {/* Amount */}
                  <td className="p-3 border">
                    <div>
                      <span className="font-semibold text-gray-800">
                        ₹{Number(amount).toFixed(2)}
                      </span>
                      {req.status === SETTLEMENT_STATUS.APPROVED && (
                        <div className="text-xs text-green-600 mt-0.5">✓ Settled</div>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-3 border">
                    <StatusBadge status={req.status} />
                    {req.clarification && req.status === SETTLEMENT_STATUS.CLARIFICATION_REQUESTED && (
                      <div className="text-xs text-amber-600 mt-1 max-w-[180px]">
                        ℹ️ {req.clarification.substring(0, 50)}{req.clarification.length > 50 ? '...' : ''}
                      </div>
                    )}
                  </td>

                  {/* Action Column */}
                  <td className="p-3 border">
                    {req.rejectionReason && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(req.rejectionReason)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="View Rejection Reason"
                        >
                          <AiOutlineEye size={20} />
                        </button>
                        <span className="text-xs text-gray-500">View reason</span>
                      </div>
                    )}
                    {req.expenseItemsCount > 0 && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {req.expenseItemsCount} item(s)
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && filteredSettlements.length === 0 && !error && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium text-gray-500">No settlements found.</p>
          <p className="text-sm mt-1">
            {localStatus || localDate
              ? 'Try changing your filters.'
              : 'Submit your first settlement to get started.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 px-6">
          <span className="text-xs text-gray-500">
            Page {currentPage} of {totalPages}
            {pagination.totalItems > 0 && ` · ${pagination.totalItems} total`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1 || loading}
              className="px-4 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        isOpen={modalOpen}
        reason={selectedReason}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

export default MySettlements
