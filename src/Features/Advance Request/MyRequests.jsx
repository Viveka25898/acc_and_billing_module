// File: /src/modules/advanceRequest/pages/MyRequests.jsx

import React, { useEffect, useState } from 'react';

const dummyRequests = [
  {
    employeeId: 'EMP001',
    employeeName: 'Amit Sharma',
    amount: '5000',
    requestDate: '2024-05-01',
    managerStatus: 'Approved',
    vpStatus: 'Pending',
    remarks: '',
  },
  {
    employeeId: 'EMP001',
    employeeName: 'Amit Sharma',
    amount: '4500',
    requestDate: '2024-05-05',
    managerStatus: 'Approved',
    vpStatus: 'Rejected',
    remarks: 'Amount not justified',
  },
  {
    employeeId: 'EMP001',
    employeeName: 'Amit Sharma',
    amount: '6000',
    requestDate: '2024-05-10',
    managerStatus: 'Pending',
    vpStatus: 'Pending',
    remarks: '',
  }
];

const MyRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const currentUserId = 'EMP001';
    const filtered = dummyRequests.filter((r) => r.employeeId === currentUserId);
    setRequests(filtered);
  }, []);

  const getStatusLabel = (managerStatus, vpStatus) => {
    if (managerStatus === 'Pending') {
      return 'Pending from Line Manager';
    }
    if (managerStatus === 'Rejected') {
      return 'Rejected by Line Manager';
    }
    if (managerStatus === 'Approved' && vpStatus === 'Pending') {
      return 'Approved by Line Manager, Pending from VP';
    }
    if (vpStatus === 'Rejected') {
      return 'Rejected by VP Operations';
    }
    if (managerStatus === 'Approved' && vpStatus === 'Approved') {
      return 'Approved by Line Manager & VP Operations';
    }
    return 'Unknown';
  };

  const getStatusColor = (managerStatus, vpStatus) => {
    if (managerStatus === 'Rejected' || vpStatus === 'Rejected') return 'text-red-600';
    if (managerStatus === 'Pending' || vpStatus === 'Pending') return 'text-yellow-600';
    if (managerStatus === 'Approved' && vpStatus === 'Approved') return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">My Advance Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-600 text-center">No advance requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-green-200 text-sm">
              <thead className="bg-green-100">
                <tr>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">₹{req.amount}</td>
                    <td className="border px-4 py-2">{req.requestDate}</td>
                    <td className={`border px-4 py-2 font-semibold ${getStatusColor(req.managerStatus, req.vpStatus)}`}>
                      {getStatusLabel(req.managerStatus, req.vpStatus)}
                    </td>
                    <td className="border px-4 py-2">{req.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
