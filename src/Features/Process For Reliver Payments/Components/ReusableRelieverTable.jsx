
import React, { useState } from "react";
import RejectionModal from "./RejectionModal";

const ITEMS_PER_PAGE = 5;

export default function ReusableRelieverTable({ requests, onStatusChange, showActions = false, role = "" }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  const handleRejectClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleRejectConfirm = (reason) => {
    if (selectedId) {
      onStatusChange(selectedId, "Rejected by VP", reason);
    }
    setShowModal(false);
    setSelectedId(null);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full table-auto border shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Site</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Type</th>
            {showActions && <th className="p-2 border">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginated.map((req, index) => (
            <tr
              key={req.id}
              className={`text-center ${req.delayed ? "bg-yellow-100" : ""}`}
            >
              <td className="border p-2">{startIndex + index + 1}</td>
              <td className="border p-2">{req.name}</td>
              <td className="border p-2">{req.date}</td>
              <td className="border p-2">{req.site}</td>
              <td className="border p-2">₹{req.amount}</td>
              <td className="border p-2">{req.type}</td>
              {showActions && (
                <td className="border p-2 space-x-2">
                  {role === "ae" && req.status === "Pending Accounts Approval" ? (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => onStatusChange(req.id)}
                    >
                      Approve
                    </button>
                  ) : req.status === "Pending VP Approval" ? (
                    <>
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => onStatusChange(req.id, "Pending Accounts Approval")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleRejectClick(req.id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : req.status === "Pending Line Manager Approval" ? (
                    <>
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => onStatusChange(req.id, "Pending VP Approval")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleRejectClick(req.id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>{req.status}</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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

      {showModal && (
        <RejectionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleRejectConfirm}
        />
      )}
    </div>
  );
}
