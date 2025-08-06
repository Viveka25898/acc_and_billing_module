/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaClock, FaCheck, FaEye } from "react-icons/fa";
import RejectionModal from "./RejectionModal";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 5;

export default function VPApprovalTable({
  requests,
  onStatusChange,
  onBulkApprove,
  showActions = false,
  canApproveNow
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionMode, setRejectionMode] = useState("reject");

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  const handleApprove = (id) => {
    console.log('Approving request:', id);
    const request = requests.find(req => req.id === id);
    console.log('Found request:', request);
    if (request && request.status === "Pending VP Operations Approval") {
      console.log('Request is approvable');
      onStatusChange(id, "Pending Account Executive Approval");
    } else {
      console.log('Request not approvable:', request?.status);
    }
  };

  const handleRejectClick = (id, mode = "reject") => {
    setSelectedId(id);
    setRejectionMode(mode);
    setShowRejectionModal(true);
  };

  const handleRejectConfirm = (reason) => {
    if (selectedId) {
      onStatusChange(selectedId, "Rejected", reason);
    }
    setShowRejectionModal(false); // Fixed: was setShowModal(false)
    setSelectedId(null);
  };

  const handleCheckboxChange = (id) => {
    setSelectedRequests((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleApproveAll = () => {
    if (!canApproveNow) {
      toast.info("Approvals after 11:59 AM will be processed next day");
      return;
    }

    const approvableIds = selectedRequests.filter((id) => {
      const req = requests.find((r) => r.id === id);
      return req && req.status === "Pending VP Operations Approval";
    });

    if (approvableIds.length > 0) {
      onBulkApprove(approvableIds);
      setSelectedRequests([]);
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      {!canApproveNow && (
        <div className="bg-yellow-100 text-yellow-800 p-3 mb-4 rounded flex items-center">
          <FaClock className="mr-2" />
          Approvals at this time will be processed next business day
        </div>
      )}

      <table className="w-full table-auto border shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Request ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Site</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((req) => (
            <tr key={req.id} className="hover:bg-gray-50 text-center">
              <td className="border p-2">
                {req.status === "Pending VP Operations Approval" && (
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(req.id)}
                    onChange={() => handleCheckboxChange(req.id)}
                    className="cursor-pointer"
                  />
                )}
              </td>
              <td className="border p-2">#{req.id.slice(-6)}</td>
              <td className="border p-2">{req.name}</td>
              <td className="border p-2">{new Date(req.date).toLocaleDateString()}</td>
              <td className="border p-2">{req.site}</td>
              <td className="border p-2">₹{req.amount}</td>
              <td className="border p-2">{req.type}</td>
              <td className="border p-2">
                <span className={`inline-flex items-center px-2 py-1 rounded ${
                  req.status.includes("Rejected") ? "bg-red-100 text-red-800" :
                  req.status.includes("Pending") ? "bg-yellow-100 text-yellow-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {req.status}
                  {req.delayed && <FaClock className="ml-1 text-yellow-600" title="Will process next day" />}
                </span>
              </td>
              <td className="border p-2 space-x-2">
                {req.status === "Pending VP Operations Approval" ? (
                  <>
                    <button
                      className={`bg-green-600 text-white px-3 py-1 rounded flex items-center justify-center mx-auto ${
                        !canApproveNow ? "opacity-80" : "hover:bg-green-700"
                      }`}
                      onClick={() => handleApprove(req.id)}
                      title={!canApproveNow ? "Will process next day" : ""}
                      disabled={!canApproveNow}
                    >
                      <FaCheck className="mr-1" /> Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded flex items-center justify-center mx-auto hover:bg-red-700"
                      onClick={() => handleRejectClick(req.id)}
                    >
                      Reject
                    </button>
                  </>
                ) : req.status.includes("Rejected") ? (
                  <button
                    onClick={() => handleRejectClick(req.id, "view")}
                    className="text-red-600 hover:text-red-800 flex items-center justify-center mx-auto"
                    title="View rejection reason"
                  >
                    <FaEye />
                  </button>
                ) : (
                  <span className="text-green-600">Approved</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRequests.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center ${
              !canApproveNow ? "opacity-80 cursor-not-allowed" : ""
            }`}
            onClick={handleApproveAll}
            disabled={!canApproveNow}
            title={!canApproveNow ? "Approvals after 11:59 AM will be processed next day" : ""}
          >
            <FaCheck className="mr-2" /> Approve Selected ({selectedRequests.length})
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onSubmit={handleRejectConfirm}
        mode={rejectionMode}
        existingReason={requests.find(r => r.id === selectedId)?.rejectionReason || ""}
      />
    </div>
  );
}