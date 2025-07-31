/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RequestFilter from './RequestFilter';
import { toast } from 'react-toastify';

// const dummyRequests = [
//   {
//     id: 1,
//     employeeId: 'EMP001',
//     employeeName: 'Amit Sharma',
//     amount: '5000',
//     requestDate: '2024-05-01',
//     managerStatus: 'Approved',
//     vpStatus: 'Pending',
//     remarks: '',
//     clarification: '',
//   },
//   {
//     id: 2,
//     employeeId: 'EMP001',
//     employeeName: 'Amit Sharma',
//     amount: '4500',
//     requestDate: '2024-05-05',
//     managerStatus: 'Approved',
//     vpStatus: 'Rejected',
//     remarks: 'Amount not justified',
//     clarification: '',
//   },
//   {
//     id: 3,
//     employeeId: 'EMP001',
//     employeeName: 'Amit Sharma',
//     amount: '6000',
//     requestDate: '2024-05-10',
//     managerStatus: 'Pending',
//     vpStatus: 'Pending',
//     remarks: '',
//     clarification: '',
//   },
// ];

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const [showClarifyModal, setShowClarifyModal] = useState(false);
  const [clarificationText, setClarificationText] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const itemsPerPage = 5;

  const auth = useSelector((state) => state.auth);
  const loggedInUserName = useSelector((state) => state.auth.user);
  console.log("Name",loggedInUserName);

  useEffect(() => {
    // Get all requests from localStorage
    const stored = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    console.log(stored);

    // Filter only current employee's requests
    const userRequests = stored
      .filter((r) => r.employeeId === loggedInUserName)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)) // Sort latest first
      .slice(0, 5); // Keep only last 5
      console.log(userRequests);

    setRequests(userRequests);
  }, [loggedInUserName]);

  const getStatusLabel = (m, v) => {
    if (m === 'Pending') return 'Pending from Line Manager';
    if (m === 'Rejected') return 'Rejected by Line Manager';
    if (m === 'Approved' && v === 'Pending') return 'Approved by Line Manager, Pending from VP';
    if (v === 'Rejected') return 'Rejected by VP Operations';
    if (m === 'Approved' && v === 'Approved') return 'Approved by Line Manager & VP Operations';
    return 'Unknown';
  };

  const getStatusColor = (m, v) => {
    if (m === 'Rejected' || v === 'Rejected') return 'text-red-600';
    if (m === 'Pending' || v === 'Pending') return 'text-yellow-600';
    if (m === 'Approved' && v === 'Approved') return 'text-green-600';
    return 'text-gray-600';
  };

  const filteredRequests = requests.filter((r) => !dateFilter || r.requestDate === dateFilter);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openClarifyModal = (id) => {
    setSelectedId(id);
    setClarificationText('');
    setShowClarifyModal(true);
  };

  const submitClarification = () => {
    if (!clarificationText.trim()) {
      toast.error('Clarification cannot be empty.');
      return;
    }

    const updated = requests.map((r) =>
      r.id === selectedId ? { ...r, clarification: clarificationText } : r
    );
    setRequests(updated);
    setShowClarifyModal(false);
    toast.success('Clarification submitted successfully.');
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-white rounded shadow-md">
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-6">My Advance Requests</h2>

        <RequestFilter currentDate={dateFilter} onDateChange={setDateFilter} />

        {paginatedRequests.length === 0 ? (
          <p className="text-gray-600 text-center">No advance requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-green-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Remarks</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((req, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">₹{req.amount}</td>
                    <td className="border px-4 py-2">{req.requestDate}</td>
                    <td className={`border px-4 py-2 font-semibold ${getStatusColor(req.managerStatus, req.vpStatus)}`}>
                      {getStatusLabel(req.managerStatus, req.vpStatus)}
                    </td>
                    <td className="border px-4 py-2">{req.remarks || '-'}</td>
                    <td className="border px-4 py-2">
                      {req.vpStatus === 'Rejected' && !req.clarification ? (
                        <button
                          onClick={() => openClarifyModal(req.id)}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          Clarification
                        </button>
                      ) : req.clarification ? (
                        <span className="text-green-600 font-semibold">Submitted</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded font-medium ${
                  page === currentPage
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-700 border-green-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clarification Modal */}
      {showClarifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Clarification for Rejection</h3>
            <textarea
              rows="4"
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Enter clarification..."
              value={clarificationText}
              onChange={(e) => setClarificationText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={submitClarification}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
              <button
                onClick={() => setShowClarifyModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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

export default MyRequests;
