import React from "react";
import { FiEye, FiCheck, FiX, FiClock } from "react-icons/fi";

export default function ManagerConveyanceTable({ 
  claims = [], 
  onApprove, 
  onReject, 
  onViewDocs,
  onViewReports,
  actionLoadingId = null,
  showActions = true,
}) {
  const getStatusBadge = (claim) => {
    const statusText = claim.status_display || claim.status || "Pending Approval";
    const statusLower = statusText.toLowerCase();

    if (statusLower.includes("approved")) {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-green-50 text-green-700 border border-green-200">
          <FiCheck size={12} /> {statusText}
        </span>
      );
    }
    if (statusLower.includes("reject")) {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-red-50 text-red-700 border border-red-200">
          <FiX size={12} /> {statusText}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">
        <FiClock size={12} /> {statusText}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm bg-white mt-4">
      <table className="w-full min-w-[1200px] table-auto border-collapse text-left bg-white">
        <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white text-xs font-semibold uppercase tracking-wider">
          <tr>
            <th className="px-5 py-4 text-center w-12">#</th>
            <th className="px-5 py-4">Claim ID</th>
            <th className="px-5 py-4">Emp ID</th>
            <th className="px-5 py-4">Employee Name</th>
            <th className="px-5 py-4">Visit Date</th>
            <th className="px-5 py-4">Client / Site</th>
            <th className="px-5 py-4">Purpose</th>
            <th className="px-5 py-4">Transport</th>
            <th className="px-5 py-4">Distance</th>
            <th className="px-5 py-4">Amount</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-center">Receipt</th>
            <th className="px-5 py-4 text-center">Visit Report</th>
            {showActions && <th className="px-5 py-4 text-center">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
          {claims.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 14 : 13} className="px-6 py-12 text-center text-gray-500 font-medium">
                📭 No pending conveyance requests found.
              </td>
            </tr>
          ) : (
            claims.map((claim, idx) => {
              const claimIdDisplay = claim.claim_id || claim.requestId || claim.id || "-";
              const employeeId = claim.employeeId || claim.employee_id || claim.empId || "-";
              const employeeName = claim.employeeName || claim.employee_name || claim.submittedBy || "-";
              const visitDate = claim.visit_date || claim.date ? (claim.visit_date || claim.date).split("T")[0] : "-";
              const clientName = claim.client_name || claim.client || "-";
              const purpose = claim.purpose || "-";
              const transport = claim.transport_mode || claim.transport || "-";
              const distance = claim.distance_km || claim.distance ? `${claim.distance_km || claim.distance} km` : "-";
              const amount = claim.amount ? `₹${Number(claim.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-";

              const hasReceipts = claim.hasReceipts || (claim.receipts && claim.receipts.length > 0);
              const hasReports = claim.hasReports || (claim.reports && claim.reports.length > 0);

              const isProcessing = actionLoadingId === claim.id;

              return (
                <tr key={claim.id || idx} className="hover:bg-gray-50/60 transition-colors duration-150">
                  <td className="px-5 py-4 text-center text-xs font-semibold text-gray-400">
                    {idx + 1}
                  </td>

                  <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap text-xs">
                    {claimIdDisplay}
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-700 whitespace-nowrap text-xs">
                    {employeeId}
                  </td>

                  <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap text-xs">
                    {employeeName}
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-700 whitespace-nowrap text-xs">
                    {visitDate}
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-800 text-xs">
                    {clientName}
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-600 max-w-[200px] truncate" title={purpose}>
                    {purpose}
                  </td>

                  <td className="px-5 py-4 text-xs font-semibold text-green-700 uppercase whitespace-nowrap">
                    {transport}
                  </td>

                  <td className="px-5 py-4 text-xs font-medium text-gray-700 whitespace-nowrap">
                    {distance}
                  </td>

                  <td className="px-5 py-4 text-xs font-bold text-gray-900 whitespace-nowrap">
                    {amount}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {getStatusBadge(claim)}
                  </td>

                  {/* Receipt Preview */}
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    {hasReceipts ? (
                      <button
                        type="button"
                        onClick={() => onViewDocs && onViewDocs(claim.receipts || [claim])}
                        className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded-xl hover:bg-blue-100 transition duration-150 inline-flex items-center justify-center cursor-pointer border-0"
                        title="View Transport Receipt"
                      >
                        <FiEye size={16} />
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>

                  {/* Visit Report Preview */}
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    {hasReports ? (
                      <button
                        type="button"
                        onClick={() => onViewReports && onViewReports(claim.reports || [claim])}
                        className="text-green-600 hover:text-green-800 p-1.5 bg-green-50 rounded-xl hover:bg-green-100 transition duration-150 inline-flex items-center justify-center cursor-pointer border-0"
                        title="View Visit Report"
                      >
                        <FiEye size={16} />
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  {showActions && (
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      {(() => {
                        const statusRaw = (claim.status || claim.status_display || "").toLowerCase();
                        const isApproved = statusRaw.includes("approved");
                        const isRejected = statusRaw.includes("reject");

                        if (isApproved) {
                          return (
                            <span className="text-green-600 font-semibold text-xs bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                              Approved
                            </span>
                          );
                        }

                        if (isRejected) {
                          return (
                            <span className="text-red-600 font-semibold text-xs bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                              Rejected
                            </span>
                          );
                        }

                        return (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              disabled={actionLoadingId !== null}
                              onClick={() => onApprove && onApprove(claim.id)}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {isProcessing ? (
                                <>
                                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                                  <span>Approving...</span>
                                </>
                              ) : (
                                <span>Approve</span>
                              )}
                            </button>

                            <button
                              type="button"
                              disabled={actionLoadingId !== null}
                              onClick={() => onReject && onReject(claim.id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        );
                      })()}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}