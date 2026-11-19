import React from 'react'
import NonPoStatusBadge from './NonPoStatusBadge'
import NonPoUrgencyBadge from './NonPoUrgencyBadge'
import { formatAmountINR, formatDateDMY } from '../config/nonPoExpenseConfig'
import { openAttachmentInNewTab } from '../utils/documentViewerHelper'

const NonPoClaimDetailDrawer = ({
  isOpen,
  onClose,
  claim,
  onApprove,
  onReject,
  onOpenPassbook,
  isApproving,
  canAction = false,
}) => {
  if (!isOpen || !claim) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] border border-gray-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight font-mono">{claim.claimId}</h3>
                <NonPoStatusBadge status={claim.workflowStatus} />
                <NonPoUrgencyBadge urgency={claim.urgency} />
              </div>
              <p className="text-xs text-green-100 mt-0.5">
                Created on {formatDateDMY(claim.claimDate)} • FY {claim.financialYear || '2026-27'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition text-lg leading-none cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-gray-700">

          {/* Amount & Requester Highlight Strip */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50/50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-gray-500 text-xs block font-medium">Total Claim Amount</span>
              <span className="text-2xl font-black text-green-700 tracking-tight">
                {formatAmountINR(claim.amountRequested)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-gray-500 text-xs block font-medium">Raised By</span>
              <span className="font-bold text-gray-800">{claim.employeeName}</span>
              <span className="text-gray-500 text-xs block">
                {claim.requesterRole} • Region {claim.region}
              </span>
            </div>
          </div>

          {/* Section: Operational Site & Classification */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b border-gray-200 pb-1">
              Site & Expense Classification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200 text-xs">
              <div>
                <span className="text-gray-400 block">Operational Site:</span>
                <span className="font-semibold text-gray-800">{claim.siteName || '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Cost Centre:</span>
                <span className="font-mono font-semibold text-gray-800">{claim.costCentre || '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Expense Type:</span>
                <span className="font-semibold text-gray-800">{claim.expenseType || '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Expense Category:</span>
                <span className="font-semibold text-gray-800">{claim.categoryName || '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Billable to Client:</span>
                <span className="font-semibold text-gray-800">
                  {claim.billable === 'Yes' ? `Yes (${claim.clientName || 'Client Mapped'})` : 'No (Company Overhead)'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Expense Date / Incident Date:</span>
                <span className="font-semibold text-gray-800">
                  {formatDateDMY(claim.expenseDate)}
                  {claim.incidentDate && ` (Incident: ${formatDateDMY(claim.incidentDate)})`}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Justification */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b border-gray-200 pb-1">
              Incident Reason & Non-PO Justification
            </h4>
            <div className="space-y-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200 text-xs">
              <div>
                <span className="font-bold text-gray-700 block mb-1">Expense Description / Purpose:</span>
                <p className="text-gray-800 leading-relaxed bg-white p-2.5 rounded-lg border border-gray-200">
                  {claim.claimReason || '—'}
                </p>
              </div>
              <div>
                <span className="font-bold text-gray-700 block mb-1">Non-PO Emergency Justification:</span>
                <p className="text-gray-800 leading-relaxed bg-white p-2.5 rounded-lg border border-gray-200">
                  {claim.nonPoJustification || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Bank Details */}
          <div>
            <div className="flex items-center justify-between mb-2 border-b border-gray-200 pb-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Payment & Beneficiary Bank Information
              </h4>
              <button
                type="button"
                onClick={() => onOpenPassbook && onOpenPassbook(claim)}
                className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>👁️</span> View Passbook / Cheque Proof
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200 text-xs">
              <div>
                <span className="text-gray-400 block">Account Holder / Beneficiary:</span>
                <span className="font-bold text-gray-900">{claim.accountHolderName || '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Bank & Branch:</span>
                <span className="font-semibold text-gray-800">{claim.bankName || '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Account Number:</span>
                <span className="font-mono font-bold text-green-800 text-sm">{claim.bankAccountNo || '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">IFSC Code:</span>
                <span className="font-mono font-bold text-gray-800">{claim.ifscCode || '—'}</span>
              </div>
            </div>
          </div>

          {/* Section: Attachments (Click to open in new tab) */}
          <div>
            <div className="flex items-center justify-between mb-2 border-b border-gray-200 pb-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Supporting Bills & Attachments ({claim.attachments?.length || 0})
              </h4>
              <span className="text-[11px] text-gray-400">Click any document to open in next tab</span>
            </div>

            {claim.attachments && claim.attachments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {claim.attachments.map((att) => (
                  <div
                    key={att.id}
                    onClick={() => openAttachmentInNewTab(att, claim)}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs hover:bg-green-50/60 hover:border-green-300 transition cursor-pointer group shadow-2xs"
                    title="Click to view document in a new tab"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-lg group-hover:scale-110 transition-transform">📄</span>
                      <div className="truncate">
                        <span className="font-semibold text-gray-800 block truncate group-hover:text-green-700 transition">
                          {att.fileName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {att.type} • {att.size}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 group-hover:bg-green-100 transition">
                      <span>Verified</span>
                      <span className="text-[10px]">↗</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No attachments uploaded.</p>
            )}
          </div>

          {/* Section: 5-Stage Approval History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
              Workflow Approval Trail (RH ➔ AVP ➔ VP ➔ AE ➔ AM)
            </h4>
            <div className="space-y-2">
              {(claim.approvalTimeline || []).map((step, idx) => {
                const isApproved = step.decision === 'Approved'
                const isRejected = step.decision === 'Rejected'
                const isPending = step.decision === 'Pending'

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                      isApproved
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : isRejected
                        ? 'bg-red-50/60 border-red-200'
                        : isPending
                        ? 'bg-amber-50/60 border-amber-200 ring-1 ring-amber-300'
                        : 'bg-gray-50/50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          isApproved
                            ? 'bg-emerald-600 text-white'
                            : isRejected
                            ? 'bg-red-600 text-white'
                            : isPending
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isApproved ? '✓' : isRejected ? '✕' : idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-gray-900">
                          {step.role} <span className="font-normal text-gray-500">({step.stage})</span>
                        </div>
                        {step.approverName && (
                          <div className="text-[11px] text-gray-600">
                            Approver: <span className="font-medium">{step.approverName}</span>
                            {step.date && ` • ${step.date}`}
                          </div>
                        )}
                        {step.comments && (
                          <div className="text-[11px] text-gray-700 italic mt-0.5">
                            "{step.comments}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {isApproved && (
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                          Approved
                        </span>
                      )}
                      {isRejected && (
                        <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-red-300">
                          Rejected
                        </span>
                      )}
                      {isPending && (
                        <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                          Under Review
                        </span>
                      )}
                      {!isApproved && !isRejected && !isPending && (
                        <span className="text-[11px] text-gray-400 font-medium">Pending Prior Stage</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition shadow-2xs cursor-pointer"
          >
            Close
          </button>

          {canAction && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onReject && onReject(claim)}
                disabled={isApproving}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                ✕ Reject Request
              </button>

              <button
                type="button"
                onClick={() => onApprove && onApprove(claim)}
                disabled={isApproving}
                className="px-6 py-2 text-xs sm:text-sm font-bold text-white bg-green-600 hover:bg-green-700 active:scale-[0.98] rounded-xl shadow-md transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isApproving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Approving...
                  </>
                ) : (
                  '✓ Approve Claim'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NonPoClaimDetailDrawer
