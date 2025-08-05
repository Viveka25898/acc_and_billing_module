/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ReasonModal from './ReasonModal';
import RejectModal from './RejectModal';
import { FaEye } from 'react-icons/fa';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AERequestTable({ data, onApprove, onReject }) {
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

  const isActionAllowed = (req) => {
    return (
      req.status === 'Pending AE Approval' ||
      (req.status === 'Rejected by AE' && req.clarification)
    );
  };

  const getStatusColor = (status) => {
    if (status.includes('Rejected')) return 'text-red-600';
    if (status.includes('Approved')) return 'text-green-600';
    return 'text-yellow-600';
  };

  // Enhanced download function
  const handleDownload = () => {
    const deadline = new Date();
    deadline.setHours(15, 59, 0, 0); // 3:59 PM deadline

    const approvedRequests = data.filter(req => 
      req.status === 'Approved' && 
      req.approvedAt && 
      new Date(req.approvedAt) <= deadline
    );

    if (approvedRequests.length === 0) {
      alert("No eligible approved requests before 3:59 PM.");
      return;
    }

    const excelData = approvedRequests.map(req => ({
      "TYPE": "NEFT",
      "DEBIT BANK A/C NO": "1234567890",
      "DEBIT AMT": req.amount,
      "CUR": "INR",
      "BENIFICARY A/C NO": req.bankAccountNumber || "9876543210",
      "IFSC CODE": req.ifscCode || "SBIN0000123",
      "NARRTION/NAME (NOT MORE THAN 20)": req.employeeName.slice(0, 20),
      "REQUEST TYPE": req.isVPRequest ? "VP Request" : "Employee Request"
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);

    ws['!cols'] = [
      { wch: 10 },  // TYPE
      { wch: 20 },  // DEBIT BANK A/C NO
      { wch: 15 },  // DEBIT AMT
      { wch: 10 },  // CUR
      { wch: 20 },  // BENIFICARY A/C NO
      { wch: 15 },  // IFSC CODE
      { wch: 30 },  // NARRTION/NAME
      { wch: 15 }   // REQUEST TYPE
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BankUpload");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "BankUploadFile.xlsx");
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
      setSelectedIds(
        paginatedData
          .filter(req => req.status === 'Pending AE Approval')
          .map(req => req.submittedAt)
      );
    } else {
      setSelectedIds([]);
    }
  }}
  checked={
    selectedIds.length > 0 && 
    selectedIds.length === paginatedData.filter(
      req => req.status === 'Pending AE Approval'
    ).length
  }
/>
            </th>
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
          {paginatedData.map((req) => (
            <tr key={req.submittedAt} className="text-center">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(req.submittedAt)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds([...selectedIds, req.submittedAt]);
                    } else {
                      setSelectedIds(selectedIds.filter(id => id !== req.submittedAt));
                    }
                  }}
                  disabled={req.status !== 'Pending AE Approval'}
                />
              </td>
              <td className="p-2 border">{req.employeeName}</td>
              <td className="p-2 border">{req.employeeId}</td>
              <td className="p-2 border">₹{req.amount}</td>
              <td className="p-2 border">{req.requestDate}</td>
              <td className="p-2 border">₹{req.osBalance || 'N/A'}</td>
              <td className="p-2 border">
                <button 
                  onClick={() => setCurrentReason({
                    reason: req.reason,
                    customReason: req.customReason
                  })}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEye />
                </button>
              </td>
              <td className="p-2 border">
                {req.isVPRequest ? "VP Request" : "Employee Request"}
              </td>
              <td className={`border px-4 py-2 ${getStatusColor(req.status)}`}>
                <div className="flex justify-center items-center gap-1">
                  <span className="font-semibold">
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
              <td className="p-2 flex flex-col gap-2 items-center">
                <button
                  disabled={!isActionAllowed(req)}
                  onClick={() => onApprove(req.submittedAt)}
                  className={`px-3 py-1 rounded text-white ${
                    isActionAllowed(req)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Approve
                </button>
                <button
                  disabled={!isActionAllowed(req)}
                  onClick={() => setRejectingId(req.submittedAt)}
                  className={`px-3 py-1 rounded text-white ${
                    isActionAllowed(req)
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIds.length > 0 && (
  <div className="mt-4 space-x-2">
    <button
      onClick={() => {
        // Only approve requests that are both in paginatedData AND selectedIds
        const requestsToApprove = paginatedData.filter(
          req => selectedIds.includes(req.submittedAt) && 
                 req.status === 'Pending AE Approval'
        );
        requestsToApprove.forEach(req => onApprove(req.submittedAt));
        setSelectedIds([]);
      }}
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