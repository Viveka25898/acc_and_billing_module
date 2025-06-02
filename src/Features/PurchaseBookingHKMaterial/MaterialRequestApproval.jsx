/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import ModifyRequestModal from './ModifyRequestsModal';

const MaterialRequestApprovalTable = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  // For Modify Modal
  const [openModifyModal, setOpenModifyModal] = useState(false);



   // Dummy attachments to use if none exist in the request
   const dummyAttachments = [
    { name: 'Invoice.pdf', url: 'https://example.com/invoice.pdf' },
    { name: 'Specs.docx', url: 'https://example.com/specs.docx' },
    { name: 'Photo.jpg', url: 'https://example.com/photo.jpg' },
  ];
  useEffect(() => {
    const storedRequests = localStorage.getItem('materialRequests');
    if (storedRequests) {
      try {
        const parsed = JSON.parse(storedRequests);
        setRequests(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing materialRequests from localStorage:', error);
        setRequests([]);
      }
    }
  }, []);
  console.log(requests);

  const updateRequestStatus = (id, status, reason = '') => {
    const updatedRequests = requests.map((req) =>
      req.id === id // ✅ Correct: match by UUID
        ? {
            ...req,
            status,
            actionRemark: reason,
          }
        : req
    );
  
    setRequests(updatedRequests);
    localStorage.setItem('materialRequests', JSON.stringify(updatedRequests));
  };
  
  

  //Modify
  const handleModify = (request) => {
    if (!request) return null;
    setSelectedRequest(request);
    setOpenModifyModal(true);
  };

  //Submit Modify
  const handleModifySubmit = (modifiedRequest) => {
    const allRequests = JSON.parse(localStorage.getItem("materialRequests")) || [];

  const updatedRequests = allRequests.map((req) =>
    req.id
  === modifiedRequest.id ? modifiedRequest : req
  );

  localStorage.setItem("materialRequests", JSON.stringify(updatedRequests));
  setRequests(updatedRequests); // update state in React as well
  };
  

  //View Details
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedRequest(null);
    setIsDialogOpen(false);
  };

  const handleAccept = (id) => {
    updateRequestStatus(id, 'Accepted');
  };
  
  const handleReject = () => {
    setShowRejectReasonModal(true);
  };

  const handleRejectSubmit = () => {
    if (selectedRequest !== null) {
      updateRequestStatus(selectedRequest.id, 'Rejected', rejectReason);
    }
    setShowRejectReasonModal(false);
    setRejectReason('');
    setSelectedRequest(null);
  };
  
  console.log("Request items:", requests.items);


  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Material Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No material requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-2 border">Requester</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Project</th>
                <th className="px-4 py-2 border">Priority</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{req.requestedBy || 'N/A'}</td>
                  <td className="px-4 py-2 border">
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">{req.site || 'N/A'}</td>
                  <td className="px-4 py-2 border">{req.priority || 'N/A'}</td>
                  <td className="px-4 py-2 border">{req.status || 'Pending'}</td>

                  <td className="px-4 py-2 border">
                    <div className="flex gap-2 justify-center flex-wrap">
                        <button
                        onClick={() => handleViewDetails(req)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                        More Details
                        </button>
                        <button
                        onClick={() => handleAccept(req.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                        Accept
                        </button>
                        <button onClick={()=>handleModify(req)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                        Modify
                        
                        </button>
                        
                        <button
                        onClick={() => {
                            setSelectedRequest(req);
                            handleReject();
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                        Reject
                        </button>
                    </div>
                    </td>

                </tr>
              ))}
            </tbody>
          </table>
          <ModifyRequestModal
                        open={openModifyModal}
                        onClose={() => setOpenModifyModal(false)}
                        request={selectedRequest}
                        onSubmit={handleModifySubmit}
                        />
        </div>
      )}

      {isDialogOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-green-700">Material Request Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><span className="font-semibold">Requester:</span> {selectedRequest.requestedBy || 'N/A'}</p>
              <p><span className="font-semibold">Project:</span> {selectedRequest.site || 'N/A'}</p>
              <p><span className="font-semibold">Location:</span> {selectedRequest.location || 'N/A'}</p>
              <p><span className="font-semibold">Vendor:</span> {selectedRequest.vendor || 'N/A'}</p>
            </div>

            <h4 className="mt-4 font-semibold">Material Items</h4>
            <table className="w-full table-auto text-sm border mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Item</th>
                  <th className="px-4 py-2 border">Qty</th>
                  <th className="px-4 py-2 border">Unit</th>
                  <th className="px-4 py-2 border">Remarks</th>
                  <th className="px-4 py-2 border">Cost</th>
                </tr>
              </thead>
              <tbody>
                        {Array.isArray(selectedRequest.items) && selectedRequest.items.length > 0 ? (
                            selectedRequest.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="px-4 py-2 border">{item.materialName}</td>
                                <td className="px-4 py-2 border">{item.qty}</td>
                                <td className="px-4 py-2 border">{item.unit}</td>
                                <td className="px-4 py-2 border">{item.remarks}</td>
                                <td className="px-4 py-2 border">₹{item.cost}</td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td className="px-4 py-2 border">{selectedRequest.materialName}</td>
                            <td className="px-4 py-2 border">{selectedRequest.quantity}</td>
                            <td className="px-4 py-2 border">{selectedRequest.uom}</td>
                            <td className="px-4 py-2 border">{selectedRequest.remarks}</td>
                            <td className="px-4 py-2 border">₹{selectedRequest.cost || "N/A"}</td>
                            </tr>
                        )}
            </tbody>

            </table>

            <h4 className="mt-4 font-semibold">Attached Documents</h4>
            <ul className="list-disc list-inside text-blue-600">
              {(selectedRequest.documents && selectedRequest.documents.length > 0
                ? selectedRequest.documents
                : dummyAttachments
              ).map((doc, index) => (
                <li key={index}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="mt-4 font-semibold">Remarks</h4>
            <p className="bg-gray-100 p-2 rounded text-sm">{selectedRequest.remarks || 'No remarks.'}</p>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-700">Enter Rejection Reason</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 resize-none h-24"
              placeholder="Enter reason here..."
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectReasonModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequestApprovalTable;
