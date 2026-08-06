import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import RejectionReasonModal from "./RejectionReasonModal";

export default function RelieverRequestsTable({ 
  requests = [], 
  pagination = {}, 
  onPageChange,
  showFullHistory = false 
}) {
  const [showModal, setShowModal] = useState(false);
  const [rejectionData, setRejectionData] = useState({ reason: "", by: "" });
  
  const paginated = requests;
  const currentPage = pagination.currentPage || 1;
  const totalPages = pagination.totalPages || 1;

  const handleViewReason = (req) => {
    // Find the most recent rejection in history for fallback 'by' user
    const rejection = req.history?.findLast(item => 
      item?.action?.includes("Rejected") || item?.comments?.includes("Rejected")
    );
    
    // Read the actual rejection reason entered by the approver
    const reasonText = req.rejectionReason || req.rejection_reason || rejection?.rejectionReason || rejection?.comments || "No reason provided";
    
    setRejectionData({
      reason: reasonText,
      by: rejection?.by || req.rejectedBy || "Unknown"
    });
    setShowModal(true);
  };

  const renderStatus = (type, req) => {
    if (type === "Approved") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          Approved
        </span>
      );
    }
    if (type === "Rejected") {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            Rejected
          </span>
          {req && (
            <FaEye 
              onClick={() => handleViewReason(req)} 
              className="text-red-500 cursor-pointer hover:text-red-700 transition" 
              title="View reason"
            />
          )}
        </div>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
        Pending
      </span>
    );
  };

  const getApprovalStatus = (req, role) => {
    const status = req.status || "";
    
    // If the overall request is approved, all roles show approved
    if (status === "Approved") {
      return renderStatus("Approved");
    }
    
    const rolesOrder = [
      "Regional Head",
      "AVP Operations",
      "VP Operations",
      "Account Executive"
    ];
    
    const currentRoleIndex = rolesOrder.indexOf(role);
    
    // Find what level the request is currently pending or rejected at
    let activeRoleIndex = -1;
    let isRejected = false;
    
    if (status.includes("Regional Head")) {
      activeRoleIndex = 0;
    } else if (status.includes("AVP Operations")) {
      activeRoleIndex = 1;
    } else if (status.includes("VP Operations") || status.includes("VP Approval")) {
      activeRoleIndex = 2;
    } else if (status.includes("Account Executive") || status.includes("Accounts Approval")) {
      activeRoleIndex = 3;
    }
    
    if (status.includes("Rejected")) {
      isRejected = true;
    }
    
    // Fallback logic using history array
    if (activeRoleIndex === -1) {
      const wasApproved = req.history?.some(item => item.action.includes(`Approved by ${role}`));
      if (wasApproved) return renderStatus("Approved");
      if (req.history?.some(item => item.action.includes(`Rejected by ${role}`))) return renderStatus("Rejected", req);
      return renderStatus("Pending");
    }
    
    if (currentRoleIndex < activeRoleIndex) {
      return renderStatus("Approved");
    }
    
    if (currentRoleIndex === activeRoleIndex) {
      return isRejected ? renderStatus("Rejected", req) : renderStatus("Pending");
    }
    
    return renderStatus("Pending");
  };

  return (
    <>
      <div className="overflow-x-auto border border-gray-100 rounded-2xl">
        <table className="w-full table-auto border-collapse text-left bg-white">
          <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Request ID</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Site</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">Regional Head</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">AVP Operations</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">VP Operations</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">Account Executive</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">#{req.id.slice(-6)}</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{req.relieverName || req.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(req.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{req.site}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{parseFloat(req.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    req.status.includes("Rejected") ? "bg-red-50 text-red-700 border-red-200" :
                    req.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                    "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  {getApprovalStatus(req, "Regional Head")}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  {getApprovalStatus(req, "AVP Operations")}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  {getApprovalStatus(req, "VP Operations")}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  {getApprovalStatus(req, "Account Executive")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-5 bg-gray-50 px-6 py-4 border border-gray-100 rounded-2xl shadow-sm">
          <button
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-semibold rounded-xl text-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm font-semibold text-gray-600">Page {currentPage} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-semibold rounded-xl text-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Rejection Reason Modal */}
      <RejectionReasonModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        reason={rejectionData.reason}
        rejectedBy={rejectionData.by}
      />
    </>
  );
}