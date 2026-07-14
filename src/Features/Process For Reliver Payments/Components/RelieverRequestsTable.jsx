import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import RejectionReasonModal from "./RejectionReasonModal";

export default function RelieverRequestsTable({ requests, showFullHistory = false }) {
  const [showModal, setShowModal] = useState(false);
  const [rejectionData, setRejectionData] = useState({ reason: "", by: "" });
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = showFullHistory ? 10 : 5;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  const handleViewReason = (req) => {
    // Find the most recent rejection in history
    const rejection = req.history?.findLast(item => 
      item.action.includes("Rejected") || item.comments.includes("Rejected")
    );
    
    setRejectionData({
      reason: rejection?.comments || "No reason provided",
      by: rejection?.by || "Unknown"
    });
    setShowModal(true);
  };

  const getApprovalStatus = (req, role) => {
    // If the overall request is approved, all roles show approved
    if (req.status === "Approved") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          Approved
        </span>
      );
    }
    
    // Map role names to match your system
    const roleMap = {
      "Line Manager": "line-manager",
      "VP Operations": "vp-operations", 
      "Account Executive": "account-executive"
    };
    
    // Check if rejected by checking the main status
    if (req.status.includes(`Rejected by ${role}`)) {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            Rejected
          </span>
          <FaEye 
            onClick={() => handleViewReason(req)} 
            className="text-red-500 cursor-pointer hover:text-red-700 transition" 
            title="View reason"
          />
        </div>
      );
    }
    
    // Check if approved by this role (look in history)
    const roleApproval = req.history?.find(item => 
      item.action.includes(`Approved by ${role}`) || 
      item.action.includes(`Approved`) && item.by === req.approvers?.[roleMap[role]]
    );
    
    if (roleApproval) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          Approved
        </span>
      );
    }
    
    // Check if currently pending with this role
    if (req.status.includes(role) && req.status.includes("Pending")) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
          Pending
        </span>
      );
    }
    
    // If request was rejected by a later role, earlier roles should show as approved
    // if they had approved it previously
    const wasApproved = req.history?.some(item => 
      (item.action.includes("Approved") && item.by === req.approvers?.[roleMap[role]]) ||
      item.action.includes(`Approved by ${role}`)
    );
    
    if (wasApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          Approved
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200">
        Pending
      </span>
    );
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
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">Line Manager</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">VP Operations</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">Account Executive</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">#{req.id.slice(-6)}</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{req.name}</td>
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
                  {getApprovalStatus(req, "Line Manager")}
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
      {requests.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center mt-5 bg-gray-50 px-6 py-4 border border-gray-100 rounded-2xl shadow-sm">
          <button
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-semibold rounded-xl text-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm font-semibold text-gray-600">Page {currentPage} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-semibold rounded-xl text-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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