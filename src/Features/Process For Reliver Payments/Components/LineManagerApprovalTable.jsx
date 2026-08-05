/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FiEye, FiX, FiDownload } from "react-icons/fi";
import RejectionModal from "./RejectionModal";
import axiosInstance from "../../../api/axiosInstance";

const ITEMS_PER_PAGE = 5;

// Modal Component for File Viewing
const FileViewModal = ({ isOpen, onClose, title, fileData, fileUrl }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen, fileUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-auto min-h-[50vh] flex flex-col justify-center relative bg-gray-50/50">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              <span className="text-gray-500 text-xs font-semibold">Loading document preview...</span>
            </div>
          )}
          {fileUrl ? (
            <iframe 
              src={fileUrl} 
              title={title} 
              onLoad={() => setLoading(false)}
              className="w-full h-[70vh] border border-gray-200 rounded-lg shadow-sm bg-white"
            />
          ) : fileData ? (
            <div className="text-center">
              {/* For images */}
              {fileData.name && fileData.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img 
                  src={`data:image/jpeg;base64,${fileData.data || fileData}`} 
                  alt={title}
                  onLoad={() => setLoading(false)}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                />
              ) : (
                /* For other file types, show file info */
                <div className="bg-gray-100 p-8 rounded-lg" ref={() => setLoading(false)}>
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
          ) : loading ? (
            null
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
  requests = [],
  onStatusChange,
  onBulkApprove,
  showActions = false,
  activeStatus = "Pending Regional Head Approval",
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionMode, setRejectionMode] = useState("reject");
  const [fileModal, setFileModal] = useState({ isOpen: false, title: '', fileData: null, fileUrl: null });
  const [processingId, setProcessingId] = useState(null);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [downloadingKey, setDownloadingKey] = useState(null);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-green-100 shadow-sm py-16 text-center mt-4">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-gray-500 font-medium text-base">No reliever requests found.</p>
        <p className="text-sm text-gray-400 mt-1">
          Reliever requests pending your approval will appear here.
        </p>
      </div>
    );
  }

  const handleApprove = async (id, status) => {
    setProcessingId(id);
    try {
      if (status === "Pending Regional Head Approval") {
        await onStatusChange(id, "Pending AVP Operations Approval");
      } else if (status === "Pending AVP Operations Approval") {
        await onStatusChange(id, "Pending VP Approval");
      } else if (status === "Pending VP Approval") {
        await onStatusChange(id, "Pending Account Executive Approval");
      } else if (status === "Pending Account Executive Approval") {
        await onStatusChange(id, "Approved");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (id, mode = "reject") => {
    setSelectedId(id);
    setRejectionMode(mode);
    setShowRejectionModal(true);
  };

  const handleRejectConfirm = async (reason) => {
    if (selectedId) {
      setIsLocalLoading(true);
      try {
        await onStatusChange(selectedId, "Rejected", reason);
        setShowRejectionModal(false);
        setSelectedId(null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLocalLoading(false);
      }
    }
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
      return req && req.status === activeStatus;
    });

    if (approvableIds.length > 0) {
      onBulkApprove(approvableIds);
      setSelectedRequests([]);
    }
  };

  const fetchAuthenticatedFile = async (fileUrl) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Request relative URL via proxy to bypass ERR_CERT_AUTHORITY_INVALID.
    // Use native fetch to avoid Axios XHR chunked transfer drops.
    const response = await fetch(fileUrl, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const originalBlob = await response.blob();
    // Explicitly override MIME type to application/pdf so the browser iframe can render it
    const pdfBlob = new Blob([originalBlob], { type: 'application/pdf' });
    return URL.createObjectURL(pdfBlob);
  };

  const openFileModal = async (title, fileData, fileUrl = null) => {
    // Open modal immediately to show loader
    setFileModal({ isOpen: true, title, fileData: null, fileUrl: null });

    if (fileUrl && typeof fileUrl === 'string' && (fileUrl.startsWith('/') || fileUrl.startsWith('http'))) {
      try {
        const blobUrl = await fetchAuthenticatedFile(fileUrl);
        setFileModal(prev => {
          // If modal was closed while downloading, clean up
          if (!prev.isOpen) {
            URL.revokeObjectURL(blobUrl);
            return prev;
          }
          return { ...prev, fileUrl: blobUrl };
        });
      } catch (err) {
        console.error("Error loading secure document:", err);
        setFileModal(prev => ({
          ...prev,
          fileData: { name: 'Failed to load secure document. Please try again.' }
        }));
      }
    } else {
      setFileModal({ isOpen: true, title, fileData, fileUrl: null });
    }
  };

  const closeFileModal = () => {
    if (fileModal.fileUrl && fileModal.fileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(fileModal.fileUrl);
    }
    setFileModal({ isOpen: false, title: '', fileData: null, fileUrl: null });
  };

  const handleDownloadFile = async (e, fileUrl, filename, downloadKey) => {
    e.preventDefault();
    e.stopPropagation();
    setDownloadingKey(downloadKey);
    try {
      const blobUrl = await fetchAuthenticatedFile(fileUrl);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.setAttribute('download', filename);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download document: " + (err.message || err));
    } finally {
      setDownloadingKey(null);
    }
  };

  return (
    <div className="mt-4">
      <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm">
        <table className="w-full min-w-[1800px] table-auto border-collapse text-left bg-white">
          <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-center w-12">#</th>
              <th className="px-6 py-4">Request ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Reliever Emp Code</th>
              <th className="px-6 py-4">Reliever For</th>
              <th className="px-6 py-4">Absent Emp Code</th>
              <th className="px-6 py-4">Shift</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Site</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Account Details</th>
              <th className="px-6 py-4">Submitted By</th>
              <th className="px-6 py-4">Submitted At</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4 text-center">Files</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {paginated.map((req) => {
              const passbookUrl = req.passbookUrl || req.passbookFile || req.files?.passbookFile || (req.hasPassbook ? 'passbook.pdf' : null);
              const idProofUrl = req.idProofUrl || req.idProof || req.files?.idProof || (req.hasIdProof ? 'id_proof.pdf' : null);
              
              const hasPassbookUrl = passbookUrl && typeof passbookUrl === 'string' && (passbookUrl.startsWith('/') || passbookUrl.startsWith('http'));
              const hasIdProofUrl = idProofUrl && typeof idProofUrl === 'string' && (idProofUrl.startsWith('/') || idProofUrl.startsWith('http'));
              
              return (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                  <td className="px-6 py-4 text-center">
                    {req.status === activeStatus && (
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(req.id)}
                        onChange={() => handleCheckboxChange(req.id)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800 whitespace-nowrap">#{req.id.slice(-6)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{req.relieverName || req.name}</td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{req.relieverEmpCode || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{req.relieverFor || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{req.absentEmpCode || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{req.shift || 'N/A'}</td>
                  <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 whitespace-nowrap">{req.type || req.relieverType || 'External'}</span></td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{req.site}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(req.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">₹{parseFloat(req.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-600">
                      <p><span className="font-semibold text-gray-500 uppercase tracking-wider">A/C:</span> {req.accountNo || req.account_no || 'N/A'}</p>
                      <p><span className="font-semibold text-gray-500 uppercase tracking-wider">IFSC:</span> {req.ifscCode || req.ifsc_code || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{req.submittedBy || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{req.submittedAt ? new Date(req.submittedAt).toLocaleString() : 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-[220px] truncate" title={req.reason}>{req.reason || 'N/A'}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="inline-flex gap-3 justify-center items-center">
                      {/* Passbook Section */}
                      {passbookUrl ? (
                        <div className="flex gap-1.5 items-center">
                          <button
                            onClick={() => {
                              if (hasPassbookUrl) {
                                openFileModal('Passbook', null, passbookUrl);
                              } else {
                                openFileModal('Passbook', typeof passbookUrl === 'object' ? passbookUrl : { name: passbookUrl });
                              }
                            }}
                            className="text-green-600 hover:text-green-800 p-1.5 bg-green-50 rounded-xl hover:bg-green-100 transition duration-150 cursor-pointer"
                            title="Preview Passbook"
                          >
                            <FiEye size={16} />
                          </button>
                          {hasPassbookUrl && (
                            <button
                              onClick={(e) => handleDownloadFile(e, passbookUrl, `passbook-${req.id.slice(-6)}.pdf`, `${req.id}-passbook`)}
                              disabled={downloadingKey !== null}
                              className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded-xl hover:bg-blue-100 transition duration-150 inline-flex items-center justify-center cursor-pointer border-0 disabled:opacity-50"
                              title="Download Passbook"
                            >
                              {downloadingKey === `${req.id}-passbook` ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                              ) : (
                                <FiDownload size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">-</span>
                      )}

                      {/* ID Proof Section */}
                      {idProofUrl ? (
                        <div className="flex gap-1.5 items-center">
                          <button
                            onClick={() => {
                              if (hasIdProofUrl) {
                                openFileModal('ID Proof', null, idProofUrl);
                              } else {
                                openFileModal('ID Proof', typeof idProofUrl === 'object' ? idProofUrl : { name: idProofUrl });
                              }
                            }}
                            className="text-green-600 hover:text-green-800 p-1.5 bg-green-50 rounded-xl hover:bg-green-100 transition duration-150 cursor-pointer"
                            title="Preview ID Proof"
                          >
                            <FiEye size={16} />
                          </button>
                          {hasIdProofUrl && (
                            <button
                              onClick={(e) => handleDownloadFile(e, idProofUrl, `id-proof-${req.id.slice(-6)}.pdf`, `${req.id}-idproof`)}
                              disabled={downloadingKey !== null}
                              className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded-xl hover:bg-blue-100 transition duration-150 inline-flex items-center justify-center cursor-pointer border-0 disabled:opacity-50"
                              title="Download ID Proof"
                            >
                              {downloadingKey === `${req.id}-idproof` ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                              ) : (
                                <FiDownload size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {req.status === activeStatus ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                          onClick={() => handleApprove(req.id, req.status)}
                          disabled={processingId !== null}
                        >
                          {processingId === req.id ? "Approving..." : "Approve"}
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                          onClick={() => handleRejectClick(req.id)}
                          disabled={processingId !== null}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        req.status.includes("Rejected") ? "bg-red-50 text-red-700 border-red-200" :
                        req.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                        "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}>
                        {req.status}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Approve All Button */}
      {selectedRequests.length > 0 && (
        <div className="flex justify-end mt-5">
          <button
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
            onClick={handleApproveAll}
          >
            Approve All ({selectedRequests.length})
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-5 bg-gray-50 px-6 py-4 border border-gray-100 rounded-2xl shadow-sm">
          <button
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-semibold rounded-xl text-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm font-semibold text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-semibold rounded-xl text-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <RejectionModal
          isOpen={showRejectionModal}
          onClose={() => setShowRejectionModal(false)}
          onSubmit={handleRejectConfirm}
          mode={rejectionMode}
          existingReason={requests.find(r => r.id === selectedId)?.rejectionReason}
          isLoading={isLocalLoading}
        />
      )}

      {/* File View Modal */}
      <FileViewModal
        isOpen={fileModal.isOpen}
        onClose={closeFileModal}
        title={fileModal.title}
        fileData={fileModal.fileData}
        fileUrl={fileModal.fileUrl}
      />
    </div>
  );
}