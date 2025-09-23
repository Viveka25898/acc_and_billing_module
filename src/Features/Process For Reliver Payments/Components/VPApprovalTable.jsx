/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaClock, FaCheck, FaEye } from "react-icons/fa";
import { FiEye, FiX } from "react-icons/fi";
import RejectionModal from "./RejectionModal";
import { toast } from "react-toastify";

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
  const [fileModal, setFileModal] = useState({ isOpen: false, title: '', fileData: null });

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
      // ✅ FIXED: Pass the specific rejection status for VP Operations
      onStatusChange(selectedId, "Rejected by VP Operations", reason);
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
    if (!canApproveNow) {
      toast.info("Approvals after 7:00 PM will be processed next day");
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

  const openFileModal = (title, fileData) => {
    setFileModal({ isOpen: true, title, fileData });
  };

  const closeFileModal = () => {
    setFileModal({ isOpen: false, title: '', fileData: null });
  };

  return (
    <div className="overflow-x-auto mt-4">
      {!canApproveNow && (
        <div className="bg-yellow-100 text-yellow-800 p-3 mb-4 rounded flex items-center">
          <FaClock className="mr-2" />
          Approvals at this time will be processed next business day
        </div>
      )}

      <table className="w-full table-auto border shadow rounded text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-1 py-1 border text-xs">#</th>
            <th className="px-1 py-1 border text-xs">ID</th>
            <th className="px-1 py-1 border text-xs">Name</th>
            <th className="px-1 py-1 border text-xs">Date</th>
            <th className="px-1 py-1 border text-xs">Site</th>
            <th className="px-1 py-1 border text-xs">Amount</th>
            <th className="px-1 py-1 border text-xs">Account</th>
            <th className="px-1 py-1 border text-xs">IFSC</th>
            <th className="px-1 py-1 border text-xs">Pass</th>
            <th className="px-1 py-1 border text-xs">ID</th>
            <th className="px-1 py-1 border text-xs">Type</th>
            <th className="px-1 py-1 border text-xs">Status</th>
            <th className="px-1 py-1 border text-xs">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((req) => (
            <tr key={req.id} className="hover:bg-gray-50 text-center text-xs">
              <td className="border px-1 py-1">
                {req.status === "Pending VP Operations Approval" && (
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(req.id)}
                    onChange={() => handleCheckboxChange(req.id)}
                    className="cursor-pointer"
                  />
                )}
              </td>
              <td className="border px-1 py-1">#{req.id.slice(-6)}</td>
              <td className="border px-1 py-1 max-w-[60px] truncate" title={req.name}>{req.name}</td>
              <td className="border px-1 py-1 text-xs">{new Date(req.date).toLocaleDateString('en-GB')}</td>
              <td className="border px-1 py-1 max-w-[50px] truncate" title={req.site}>{req.site}</td>
              <td className="border px-1 py-1">₹{req.amount}</td>
              <td className="border px-1 py-1 max-w-[70px] truncate" title={req.accountNo}>{req.accountNo || 'N/A'}</td>
              <td className="border px-1 py-1 max-w-[60px] truncate" title={req.ifscCode}>{req.ifscCode || 'N/A'}</td>
              <td className="border px-1 py-1">
                {req.files?.passbookFile ? (
                  <button
                    onClick={() => openFileModal('Passbook', { name: req.files.passbookFile })}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    title="View Passbook"
                  >
                    <FiEye size={14} />
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </td>
              <td className="border px-1 py-1">
                {req.files?.idProof ? (
                  <button
                    onClick={() => openFileModal('ID Proof', { name: req.files.idProof })}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    title="View ID Proof"
                  >
                    <FiEye size={14} />
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </td>
              <td className="border px-1 py-1 max-w-[50px] truncate" title={req.type}>{req.type}</td>
              <td className="border px-1 py-1">
                <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs ${
                  req.status.includes("Rejected") ? "bg-red-100 text-red-800" :
                  req.status.includes("Pending") ? "bg-yellow-100 text-yellow-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {req.status.includes("VP") ? "VP" : req.status.includes("Rejected") ? "Rejected" : req.status}
                  {req.delayed && <FaClock className="ml-1 text-yellow-600" size={10} title="Will process next day" />}
                </span>
              </td>
              <td className="border px-1 py-1">
                {req.status === "Pending VP Operations Approval" ? (
                  <div className="flex flex-col gap-1">
                    <button
                      className={`bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center justify-center ${
                        !canApproveNow ? "opacity-80" : "hover:bg-green-700"
                      }`}
                      onClick={() => handleApprove(req.id)}
                      title={!canApproveNow ? "Will process next day" : ""}
                      disabled={!canApproveNow}
                    >
                      <FaCheck size={10} className="mr-1" /> App
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center justify-center hover:bg-red-700"
                      onClick={() => handleRejectClick(req.id)}
                    >
                      Rej
                    </button>
                  </div>
                ) : req.status.includes("Rejected") ? (
                  <button
                    onClick={() => handleRejectClick(req.id, "view")}
                    className="text-red-600 hover:text-red-800 flex items-center justify-center"
                    title="View rejection reason"
                  >
                    <FaEye size={12} />
                  </button>
                ) : (
                  <span className="text-green-600 text-xs">✓</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRequests.length > 0 && (
        <div className="flex justify-end mt-2">
          <button
            className={`bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 flex items-center text-sm ${
              !canApproveNow ? "opacity-80 cursor-not-allowed" : ""
            }`}
            onClick={handleApproveAll}
            disabled={!canApproveNow}
            title={!canApproveNow ? "Approvals after 7:00 PM will be processed next day" : ""}
          >
            <FaCheck className="mr-1" size={12} /> Approve ({selectedRequests.length})
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-2">
        <button
          className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center text-sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center text-sm"
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