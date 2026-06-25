/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ReasonModal from './ReasonModal';
import RejectModal from './RejectModal';
import { FaEye } from 'react-icons/fa';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { downloadPaymentFile } from '../services/advanceRequestService';

export default function AERequestTable({ data, onApprove, onReject, onDownloadComplete, onApproveMultiple,getEmployeeOSBalance }) {
  const [currentReason, setCurrentReason] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Sort: Pending → Approved → Rejected
  const sortedData = [...data].sort((a, b) => {
    // Status priority
    const statusPriority = {
      'Pending AE Approval': 1,
      'Approved': 2,
      'Rejected by AE': 3
    };
    
    // If both are approved, sort by approval time (newest first)
    if (a.status === 'Approved' && b.status === 'Approved') {
      return new Date(b.approvedAt) - new Date(a.approvedAt);
    }
    
    // Otherwise sort by status priority
    return statusPriority[a.status] - statusPriority[b.status];
  });

  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Check if VP approved before deadline (15:59) - using vpApprovedBeforeDeadline flag
  const isVPApprovedBeforeDeadline = (req) => {
    // Use the flag set by VP when approving
    if (req.isVPRequest) {
      return req.vpApprovedBeforeDeadline === true;
    }
    return true; // Non-VP requests are always eligible
  };

  const isActionAllowed = (req) => {
    // Basic status check
    const statusCheck = req.status === 'Pending AE Approval' ||
                       (req.status === 'Rejected by AE' && req.clarification);
    
    // If it's a VP request, check if VP approved before deadline
    if (req.isVPRequest) {
      return statusCheck && isVPApprovedBeforeDeadline(req);
    }
    
    // For employee requests, normal rules apply
    return statusCheck;
  };

  const getStatusColor = (status) => {
    if (status.includes('Rejected')) return 'text-red-600';
    if (status.includes('Approved')) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getSelectableRequests = () => {
    return paginatedData.filter(req => {
      const basicCheck = req.status === 'Pending AE Approval';
      if (req.isVPRequest) {
        return basicCheck && isVPApprovedBeforeDeadline(req);
      }
      return basicCheck;
    });
  };

  // Modified single approve function to trigger modal
  const handleSingleApprove = (id) => {
    onApprove(id); // This will trigger the modal in parent component
  };

  // Download function - hit the API and download the file directly
  const handleDownload = async () => {
    try {
      // Call API to download the payment Excel file
      const excelBlob = await downloadPaymentFile();

      // Save using file-saver
      const file = new Blob([excelBlob], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(file, "BankUploadFile.xlsx");
      
      // Call the parent component's function to notify download complete
      if (onDownloadComplete) {
        onDownloadComplete();
      }
    } catch (error) {
      console.error("Failed to download bank upload file:", error);
      alert(error.message || "Failed to download bank upload file.");
    }
  };

  // Modified approve all function to trigger modal with multiple requests
  const handleApproveAll = () => {
    const selectableRequests = getSelectableRequests();
    const requestIds = selectableRequests.map(req => req.id);
    
    if (onApproveMultiple) {
      onApproveMultiple(requestIds); // This will trigger the modal in parent component
    } else {
      // Fallback to individual approvals if onApproveMultiple is not provided
      selectableRequests.forEach(req => onApprove(req.id));
    }
    setSelectedIds([]);
  };

  // Modified approve selected function to trigger modal
  const handleApproveSelected = () => {
    const requestsToApprove = paginatedData.filter(
      req => selectedIds.includes(req.id) && 
             isActionAllowed(req)
    );
    
    const requestIds = requestsToApprove.map(req => req.id);
    
    if (onApproveMultiple && requestIds.length > 1) {
      onApproveMultiple(requestIds); // Trigger modal for multiple
    } else if (requestIds.length === 1) {
      onApprove(requestIds[0]); // Trigger modal for single
    } else {
      // Fallback to individual approvals
      requestsToApprove.forEach(req => onApprove(req.id));
    }
    
    setSelectedIds([]);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    const selectableRequests = getSelectableRequests();
                    setSelectedIds(selectableRequests.map(req => req.id));
                  } else {
                    setSelectedIds([]);
                  }
                }}
                checked={
                  selectedIds.length > 0 && 
                  selectedIds.length === getSelectableRequests().length
                }
              />
            </th>
            <th className="p-2 border">Request ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Employee ID</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">O/s Balance</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Request Type</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((req) => {
            const canTakeAction = isActionAllowed(req);
            const isVPRequestAfterDeadline = req.isVPRequest && !isVPApprovedBeforeDeadline(req);
            
            return (
              <tr key={req.id} className="text-center hover:bg-gray-50 transition-colors">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(req.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, req.id]);
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== req.id));
                      }
                    }}
                    disabled={!canTakeAction}
                  />
                </td>
                <td className="p-2 border font-mono text-xs">
                  {req.requestId || 'N/A'}
                </td>
                <td className="p-2 border">{req.employeeName}</td>
                <td className="p-2 border">{req.employeeId}</td>
                <td className="p-2 border">₹{req.amount}</td>
                <td className="p-2 border">{req.requestDate}</td>
                <td className="p-3 border">
                   ₹{(req.osBalance != null ? req.osBalance : (getEmployeeOSBalance(req.employeeId) || 0)).toFixed(2)}
                </td>
                <td className="p-2 border">
                  <button 
                    onClick={() => setCurrentReason({
                      reason: req.reason || req.reasons,
                      customReason: req.customReason
                    })}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye />
                  </button>
                </td>
                <td className="p-2 border">
                  <div className="flex flex-col items-center">
                    <span>{req.isVPRequest ? "VP Request" : "Employee Request"}</span>
                    {isVPRequestAfterDeadline && (
                      <span className="text-xs text-red-500 mt-1">
                        (VP approved after 15:59)
                      </span>
                    )}
                    {req.isVPRequest && req.vpApprovedBeforeDeadline && (
                      <span className="text-xs text-green-500 mt-1">
                        (VP approved before 15:59 ✓)
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-2 border">
                  <div className="flex justify-center items-center gap-1">
                    <span className={`font-semibold ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                    {req.status === 'Rejected by AE' && req.clarification && (
                      <button
                        onClick={() => setCurrentReason({
                          remarks: req.remarks,
                          clarification: req.clarification
                        })}
                        title="View Clarification"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEye className="inline" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2 border">
                  <div className="flex flex-col gap-2 items-center">
                    <button
                      disabled={!canTakeAction}
                      onClick={() => handleSingleApprove(req.id)}
                      className={`px-3 py-1 rounded text-white ${
                        canTakeAction
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                      title={isVPRequestAfterDeadline ? "Cannot approve: VP approved after 15:59 deadline" : ""}
                    >
                      Approve
                    </button>
                    <button
                      disabled={!canTakeAction}
                      onClick={() => setRejectingId(req.id)}
                      className={`px-3 py-1 rounded text-white ${
                        canTakeAction
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                      title={isVPRequestAfterDeadline ? "Cannot reject: VP approved after 15:59 deadline" : ""}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {(selectedIds.length > 0 || getSelectableRequests().length > 0) && (
        <div className="mt-4 space-x-2">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={handleApproveSelected}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Approve Selected ({selectedIds.length})
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear Selection
              </button>
            </>
          )}
          
          {getSelectableRequests().length > 0 && (
            <button
              onClick={handleApproveAll}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Approve All Eligible ({getSelectableRequests().length})
            </button>
          )}
        </div>
      )}

      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Download Bank Upload File
      </button>

      {data.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No advance requests pending approval.
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded ${
                page === num ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {currentReason && (
        <ReasonModal 
          reason={currentReason.reason} 
          customReason={currentReason.customReason}
          clarification={currentReason.clarification}
          remarks={currentReason.remarks}
          onClose={() => setCurrentReason(null)} 
        />
      )}

      {rejectingId && (
        <RejectModal
          onSubmit={(reason) => {
            onReject(rejectingId, reason);
            setRejectingId(null);
          }}
          onClose={() => setRejectingId(null)}
        />
      )}
    </div>
  );
}