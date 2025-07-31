/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import RejectionModal from "./RejectionModal";

const ITEMS_PER_PAGE = 5;

export default function AEApprovalTable({
  requests,
  onStatusChange,
  onBulkApprove,
  showActions = false,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [passbookUrl, setPassbookUrl] = useState(null);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  const handleApprove = (id, status) => {
    if (status === "Pending Accounts Approval") {
      onStatusChange(id, "Approved & Payment Done");
    }
  };

  const handleRejectClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleRejectConfirm = (reason) => {
  if (selectedId) {
    onStatusChange(selectedId, "Rejected by AE", reason); 
  }
  setShowModal(false);
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
    const approvableIds = selectedRequests.filter((id) => {
      const req = requests.find((r) => r.id === id);
      return req && req.status === "Pending Accounts Approval";
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

  const isPdf = (url) => url && url.toLowerCase().endsWith(".pdf");

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
            <th className="p-2 border">Account No</th>
            <th className="p-2 border">IFSC</th>
            <th className="p-2 border">Passbook</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((req) => (
            <tr key={req.id} className="text-center">
              <td className="border p-2">
                {req.status === "Pending Accounts Approval" && (
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(req.id)}
                    onChange={() => handleCheckboxChange(req.id)}
                  />
                )}
              </td>
              <td className="border p-2">{req.name}</td>
              <td className="border p-2">{req.date}</td>
              <td className="border p-2">{req.site}</td>
              <td className="border p-2">₹{req.amount}</td>
              <td className="border p-2">{req.type}</td>
              <td className="border p-2">{req.benificiaryAcNo || "-"}</td>
              <td className="border p-2">{req.ifscCode || "-"}</td>
              <td className="border p-2">
                {req.passbook ? (
                  <button
                    onClick={() => handlePassbookView(req.passbook)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Passbook"
                  >
                    <FaEye />
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td className="border p-2 space-x-2">
                {req.status === "Pending Accounts Approval" ? (
                  <>
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleApprove(req.id, req.status)}
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
            </tr>
          ))}
        </tbody>
      </table>

      {/* Approve All Button */}
      {selectedRequests.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleApproveAll}
          >
            Approve All ({selectedRequests.length})
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Rejection Modal */}
      {showModal && (
        <RejectionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleRejectConfirm}
        />
      )}

      {/* Passbook Modal */}
      {passbookUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] p-4 overflow-hidden flex flex-col">
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-red-600 text-2xl font-bold hover:text-red-800"
                    onClick={handleClosePassbookModal}
                >
                    &times;
                </button>

                {/* Modal Content */}
                <div className="flex-grow overflow-auto mt-8">
                    {isPdf(passbookUrl) ? (
                    <iframe
                        src={passbookUrl}
                        title="Passbook PDF"
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
