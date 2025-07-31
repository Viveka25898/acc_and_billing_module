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
    const order = { Pending: 1, Approved: 2, Rejected: 3 };
    return order[a.status] - order[b.status];
  });

  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const isActionDisabled = (status) => status !== 'Pending';

  
  //For Download the Excel File.
 const handleDownload = () => {
  const deadline = new Date();
  // deadline.setHours(11, 59, 0, 0); // ✅ 11:59 AM IST (not 23:59)
  deadline.setHours(23, 59, 0, 0);// 11:59 AM IST

  const filteredData = data.filter(emp => {
    if (emp.status !== 'Approved' || !emp.approvedAt) return false;

    const approvedTime = new Date(emp.approvedAt);
    const approvedLocalTime = new Date(
      approvedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    return approvedLocalTime <= deadline;
  });

  if (filteredData.length === 0) {
    alert("No eligible approved requests before 11:59 AM.");
    return;
  }

  const excelData = filteredData.map(emp => ({
    "TYPE": "NEFT",
    "DEBIT BANK A/C NO": "1234567890",
    "DEBIT AMT": emp.amount,
    "CUR": "INR",
    "BENIFICARY A/C NO": "9876543210",
    "IFSC CODE": "SBIN0000123",
    "NARRTION/NAME (NOT MORE THAN 20)": emp.employeeName.slice(0, 20)
  }));

  const ws = XLSX.utils.json_to_sheet(excelData);

  // ✅ Add auto-width configuration
  ws['!cols'] = [
    { wch: 10 },  // TYPE
    { wch: 20 },  // DEBIT BANK A/C NO
    { wch: 15 },  // DEBIT AMT
    { wch: 10 },  // CUR
    { wch: 20 },  // BENIFICARY A/C NO
    { wch: 15 },  // IFSC CODE
    { wch: 30 },  // NARRTION/NAME
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
                        setSelectedIds(paginatedData.map((req) => req.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                  />
                </th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Employee ID</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">O/s Balance</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">VP Approval Time</th>
                <th className="p-2 border">Action</th>
              </tr>
        </thead>


        <tbody>
          {paginatedData.map((req) => {
            const disabled = isActionDisabled(req.status);
            return (
              <tr key={req.id} className={`text-center border `}>
                <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(req.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds([...selectedIds, req.id]);
                    } else {
                      setSelectedIds(selectedIds.filter((id) => id !== req.id));
                    }
                  }}
                />
              </td>
                <td className="p-2 border">{req.employeeName}</td>
                <td className="p-2 border">{req.employeeId}</td>
                <td className="p-2 border">₹{req.amount}</td>
                <td className="p-2 border">{req.date}</td>
                <td className="p-2 border">₹{req.osBalance}</td>
                <td className="p-2 border">
                  <button onClick={() => setCurrentReason(req.reason)}>
                    <FaEye className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                  </button>
                </td>
                <td className="p-2 border">{req.status}</td>
                <td className="p-2 border">
                  {req.approvedAt
                    ? new Date(req.approvedAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : '-'}
                </td>
                <td className="p-2  flex flex-col gap-2 items-center">
                  <button
                    disabled={disabled}
                    onClick={() => onApprove(req.id)}
                    className={`px-3 py-1 rounded text-white ${
                      disabled ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      if (req.status === 'Pending') {
                        setRejectingId(req.id);
                      }
                    }}
                    className={`px-3 py-1 rounded text-white ${
                      req.status === 'Pending'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-red-300 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Approve Button  */}
      {selectedIds.length > 0 && (
        <button
          onClick={() => {
            selectedIds.forEach(id => onApprove(id));
            setSelectedIds([]); // Clear selection after approving
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Approve Selected ({selectedIds.length})
        </button>
      )}

        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 ml-2 rounded hover:bg-blue-700 mt-4"
        >
          Download Bank Upload File
        </button>


      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-3 py-1 rounded ${page === num ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Modals */}
      {currentReason && <ReasonModal reason={currentReason} onClose={() => setCurrentReason(null)} />}
      {rejectingId !== null && (
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
