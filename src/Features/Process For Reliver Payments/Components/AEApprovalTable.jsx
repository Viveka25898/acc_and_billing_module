/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import RejectionModal from "./RejectionModal";

const ITEMS_PER_PAGE = 5;

export default function AEApprovalTable({
  requests,
  onStatusChange,
  onBulkApprove,
  showActions = false,
}) {
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [passbookUrl, setPassbookUrl] = useState(null);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  const handleApprove = (id) => {
    const request = requests.find(req => req.id === id);
    if (request && request.status === "Pending Account Executive Approval") {
      onStatusChange(id, "Approved");
    }
  };

  const handleRejectClick = (id) => {
    setSelectedId(id);
    setShowRejectionModal(true);
  };

  const handleRejectConfirm = (reason) => {
    if (selectedId) {
      onStatusChange(selectedId, "Rejected by Account Executive", reason);
    }
    setShowRejectionModal(false);
    setSelectedId(null);
  };

  const handleCheckboxChange = (id) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(reqId => reqId !== id) 
        : [...prev, id]
    );
  };

  const handleApproveAll = () => {
    const approvableIds = selectedRequests.filter(id => {
      const req = requests.find(r => r.id === id);
      return req && req.status === "Pending Account Executive Approval";
    });

    if (approvableIds.length > 0) {
      onBulkApprove(approvableIds);
      setSelectedRequests([]);
    }
  };

  const handlePassbookView = (url) => {
    setPassbookUrl(url);
  };

  const handleClosePassbookModal = () => {
    setPassbookUrl(null);
  };

  const isPdf = (url) => {
    return typeof url === 'string' && url.toLowerCase().endsWith('.pdf');
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full table-auto border shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border w-10">
              <input 
                type="checkbox"
                className="w-4 h-4 cursor-pointer"
                onChange={(e) => {
                  if (e.target.checked) {
                    const pendingIds = paginated
                      .filter(req => req.status === "Pending Account Executive Approval")
                      .map(req => req.id);
                    setSelectedRequests(pendingIds);
                  } else {
                    setSelectedRequests([]);
                  }
                }}
                checked={
                  selectedRequests.length > 0 && 
                  selectedRequests.length === paginated.filter(
                    req => req.status === "Pending Account Executive Approval"
                  ).length
                }
              />
            </th>
            <th className="p-2 border w-20">Req ID</th>
            <th className="p-2 border w-32">Name</th>
            <th className="p-2 border w-24">Date</th>
            <th className="p-2 border w-20">Amount</th>
            <th className="p-2 border w-32">Account No</th>
            <th className="p-2 border w-24">IFSC</th>
            <th className="p-2 border w-20">Passbook</th>
            <th className="p-2 border w-24">Status</th>
            <th className="p-2 border w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(req => (
            <tr key={req.id} className="hover:bg-gray-50 text-center">
              <td className="border p-2 flex justify-center">
                {req.status === "Pending Account Executive Approval" && (
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    checked={selectedRequests.includes(req.id)}
                    onChange={() => handleCheckboxChange(req.id)}
                  />
                )}
              </td>
              <td className="border p-2">#{req.id.slice(-6)}</td>
              <td className="border p-2">{req.name}</td>
              <td className="border p-2">{new Date(req.date).toLocaleDateString()}</td>
              <td className="border p-2">{req.amount}</td>
              <td className="border p-2">{req.accountNo || "-"}</td>
              <td className="border p-2">{req.ifscCode || "-"}</td>
              <td className="border p-2">
                {req.passbookFile ? (
                  <button
                    onClick={() => handlePassbookView(req.passbookFile)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Passbook"
                  >
                    <FaEye />
                  </button>
                ) : "-"}
              </td>
              <td className="border p-2">
                <span className={`inline-flex items-center px-2 py-1 rounded ${
                  req.status.includes("Rejected") ? "bg-red-100 text-red-800" :
                  req.status.includes("Pending") ? "bg-yellow-100 text-yellow-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {req.status}
                </span>
              </td>
              <td className="border p-2 space-x-2">
                {req.status === "Pending Account Executive Approval" ? (
                  <>
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => handleApprove(req.id)}
                    >
                      <FaCheck className="inline mr-1" /> Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleRejectClick(req.id)}
                    >
                      <FaTimes className="inline mr-1" /> Reject
                    </button>
                  </>
                ) : req.status.includes("Rejected") ? (
                  <button
                    onClick={() => handleRejectClick(req.id)}
                    className="text-red-600 hover:text-red-800"
                    title="View rejection reason"
                  >
                    <FaEye />
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRequests.length > 0 && (
        <div className="flex justify-end mt-4 space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleApproveAll}
          >
            <FaCheck className="inline mr-2" />
            Approve Selected ({selectedRequests.length})
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onSubmit={handleRejectConfirm}
        mode={selectedId ? "reject" : "view"}
        existingReason={requests.find(r => r.id === selectedId)?.rejectionReason}
      />

      {passbookUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] p-4 overflow-hidden flex flex-col">
            <button
              className="absolute top-3 right-3 text-red-600 text-2xl font-bold hover:text-red-800"
              onClick={handleClosePassbookModal}
            >
              &times;
            </button>
            <div className="flex-grow overflow-auto mt-8">
              {isPdf(passbookUrl) ? (
                <iframe
                  src={passbookUrl}
                  title="Passbook"
                  className="w-full h-[70vh] border rounded"
                />
              ) : (
                <img
                  src={passbookUrl}
                  alt="Passbook"
                  className="w-full max-h-[70vh] object-contain rounded"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}