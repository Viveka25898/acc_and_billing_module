/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FiEye, FiX } from "react-icons/fi";
import RejectionModal from "./RejectionModal";

const ITEMS_PER_PAGE = 5;

// Modal Component for File Viewing
const FileViewModal = ({ isOpen, onClose, title, fileData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-4 max-h-[calc(90vh-8rem)] overflow-auto">
          {fileData ? (
            <div className="text-center">
              {/* For images */}
              {fileData.name && fileData.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img 
                  src={`data:image/jpeg;base64,${fileData.data || fileData}`} 
                  alt={title}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                />
              ) : (
                /* For other file types, show file info */
                <div className="bg-gray-100 p-8 rounded-lg">
                  <div className="text-gray-600 mb-4">
                    <div className="text-lg font-medium mb-2">File Details:</div>
                    <div>Name: {fileData.name || 'Unknown'}</div>
                    <div>Type: {fileData.type || 'Unknown'}</div>
                    <div>Size: {fileData.size ? `${(fileData.size / 1024).toFixed(2)} KB` : 'Unknown'}</div>
                  </div>
                  {fileData.data && (
                    <div className="text-xs text-gray-500 break-all max-h-40 overflow-y-auto bg-white p-2 rounded border">
                      {typeof fileData.data === 'string' ? fileData.data.substring(0, 500) + '...' : 'Binary data'}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No file data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LineManagerApprovalTable({
  requests,
  onStatusChange,
  onBulkApprove,
  showActions = false,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionMode, setRejectionMode] = useState("reject");
  const [fileModal, setFileModal] = useState({ isOpen: false, title: '', fileData: null });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  const handleApprove = (id, status) => {
    if (status === "Pending Line Manager Approval") {
      onStatusChange(id, "Pending VP Operations Approval");
    }
  };

  const handleRejectClick = (id, mode = "reject") => {
    setSelectedId(id);
    setRejectionMode(mode);
    setShowRejectionModal(true);
  };

  const handleRejectConfirm = (reason) => {
    if (selectedId) {
      // ✅ FIXED: Pass the specific rejection status
      onStatusChange(selectedId, "Rejected by Line Manager", reason);
    }
    setShowRejectionModal(false);
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
      return req && req.status === "Pending Line Manager Approval";
    });

    if (approvableIds.length > 0) {
      onBulkApprove(approvableIds);
      setSelectedRequests([]);
    }
  };

  const openFileModal = (title, fileData) => {
    setFileModal({ isOpen: true, title, fileData });
  };

  const closeFileModal = () => {
    setFileModal({ isOpen: false, title: '', fileData: null });
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full table-auto border shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Request ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Site</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Account No</th>
            <th className="p-2 border">IFSC Code</th>
            <th className="p-2 border">Passbook</th>
            <th className="p-2 border">ID Proof</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((req, index) => (
            <tr key={req.id} className="text-center">
              <td className="border p-2">
                {req.status === "Pending Line Manager Approval" && (
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(req.id)}
                    onChange={() => handleCheckboxChange(req.id)}
                  />
                )}
              </td>
              <td className="border p-2">{req.id.slice(-6)}</td>
              <td className="border p-2">{req.name}</td>
              <td className="border p-2">{req.date}</td>
              <td className="border p-2">{req.site}</td>
              <td className="border p-2">₹{req.amount}</td>
              <td className="border p-2">{req.accountNo || 'N/A'}</td>
              <td className="border p-2">{req.ifscCode || 'N/A'}</td>
              <td className="border p-2">
                {req.files?.passbookFile ? (
                  <button
                    onClick={() => openFileModal('Passbook', { name: req.files.passbookFile })}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    title="View Passbook"
                  >
                    <FiEye size={18} />
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">No file</span>
                )}
              </td>
              <td className="border p-2">
                {req.files?.idProof ? (
                  <button
                    onClick={() => openFileModal('ID Proof', { name: req.files.idProof })}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    title="View ID Proof"
                  >
                    <FiEye size={18} />
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">No file</span>
                )}
              </td>
              <td className="border p-2">{req.type}</td>
              <td className="border p-2 space-x-2">
                {req.status === "Pending Line Manager Approval" ? (
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
      {showRejectionModal && (
        <RejectionModal
          isOpen={showRejectionModal}
          onClose={() => setShowRejectionModal(false)}
          onSubmit={handleRejectConfirm}
          mode={rejectionMode}
          existingReason={requests.find(r => r.id === selectedId)?.rejectionReason}
        />
      )}

      {/* File View Modal */}
      <FileViewModal
        isOpen={fileModal.isOpen}
        onClose={closeFileModal}
        title={fileModal.title}
        fileData={fileModal.fileData}
      />
    </div>
  );
}