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
    // Find the rejection in history
    const rejection = req.history?.find(item => 
      item.action.includes("Rejected") || item.comments.includes("Rejected")
    );
    
    setRejectionData({
      reason: rejection?.comments || "No reason provided",
      by: rejection?.by || "Unknown"
    });
    setShowModal(true);
  };

  const getApprovalStatus = (req, role) => {
    if (req.status === "Approved") return "Approved";
    
    // Check if rejected by this role
    const roleRejection = req.history?.find(item => 
      item.action.includes(`Rejected by ${role}`)
    );
    
    if (roleRejection) {
      return (
        <div className="flex justify-center items-center gap-2">
          <span className="text-red-600">Rejected</span>
          <FaEye 
            onClick={() => handleViewReason(req)} 
            className="text-red-600 cursor-pointer hover:text-red-800" 
            title="View reason"
          />
        </div>
      );
    }
    
    // Check if pending for this role
    if (req.status.includes(role)) return req.status;
    
    // Check if approved by this role
    const approvedByHigherRole = req.history?.some(item => 
      item.action.includes(`Approved by ${role}`)
    );
    
    return approvedByHigherRole ? "Approved" : "Pending";
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Request ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Site</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Line Manager</th>
              <th className="p-2 border">VP Operations</th>
              <th className="p-2 border">Account Executive</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="border p-2">{req.id.slice(-6)}</td>
                <td className="border p-2">{req.name}</td>
                <td className="border p-2">{new Date(req.date).toLocaleDateString()}</td>
                <td className="border p-2">{req.site}</td>
                <td className="border p-2">₹{req.amount}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded ${
                    req.status.includes("Rejected") ? "bg-red-100 text-red-800" :
                    req.status === "Approved" ? "bg-green-100 text-green-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="border p-2">
                  {getApprovalStatus(req, "Line Manager")}
                </td>
                <td className="border p-2">
                  {getApprovalStatus(req, "VP Operations")}
                </td>
                <td className="border p-2">
                  {getApprovalStatus(req, "Account Executive")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {requests.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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