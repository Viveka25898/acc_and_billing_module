// File: /src/modules/advanceRequest/pages/VPApproval.jsx

import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';

const dummyVPData = [
  {
    employeeName: 'Amit Sharma',
    employeeId: 'EMP001',
    amount: '5000',
    requestDate: '2024-05-01',
    reason: 'Medical Emergency',
    status: 'Pending VP Approval',
  },
  {
    employeeName: 'Sneha Patil',
    employeeId: 'EMP002',
    amount: '7000',
    requestDate: '2024-05-02',
    reason: 'House Rent',
    status: 'Pending VP Approval',
  },
  // ...more entries if needed
];

const VPApproval = () => {
  const [requests, setRequests] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [rejectIndex, setRejectIndex] = useState(null);

  useEffect(() => {
    setRequests(dummyVPData);
  }, []);

  const handleApprove = (index) => {
    setRequests((prev) =>
      prev.map((req, i) => (i === index ? { ...req, status: 'Approved by VP' } : req))
    );
  };

  const handleReject = () => {
    if (!remarks.trim()) return alert('Please provide rejection remarks.');
    setRequests((prev) =>
      prev.map((req, i) =>
        i === rejectIndex ? { ...req, status: 'Rejected by VP', remarks } : req
      )
    );
    setRejectIndex(null);
    setRemarks('');
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-green-50">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Advance Requests - VP Approval - (Approved By Manager)</h2>
        {requests.length === 0 ? (
          <p className="text-gray-600">No pending requests at the moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-green-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Employee ID</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">O/s Balance</th>
                  <th className="border px-4 py-2">Reason</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">{req.employeeName}</td>
                    <td className="border px-4 py-2">{req.employeeId}</td>
                    <td className="border px-4 py-2">₹{req.amount}</td>
                    <td className="border px-4 py-2">{req.requestDate}</td>
                    <td className="border px-4 py-2">₹{Math.floor(Math.random() * 5000)}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => setSelectedReason(req.reason)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaEye />
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      {req.status === 'Pending VP Approval' ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleApprove(index)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectIndex(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`font-semibold ${req.status.includes('Rejected') ? 'text-red-600' : 'text-green-600'}`}
                        >
                          {req.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reason Modal */}
      {selectedReason && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Advance Reason</h3>
            <p className="text-gray-700 mb-6">{selectedReason}</p>
            <button
              onClick={() => setSelectedReason(null)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Rejection Remarks</h3>
            <textarea
              className="w-full border px-3 py-2 rounded mb-4"
              rows="3"
              placeholder="Enter reason for rejection"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setRejectIndex(null);
                  setRemarks('');
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VPApproval;
