/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import RejectionReasonModal from './RejectionReasonModal';

const dummyRequests = [
  {
    id: 1,
    date: '2025-05-20',
    amount: 1500,
    status: 'Pending',
    reason: '',
  },
  {
    id: 2,
    date: '2025-05-18',
    amount: 2200,
    status: 'Approved',
    reason: '',
  },
  {
    id: 3,
    date: '2025-05-16',
    amount: 1800,
    status: 'Rejected by Line Manager',
    reason: 'Incorrect cost.',
  },
  {
    id: 4,
    date: '2025-05-21',
    amount: 2600,
    status: 'Rejected by VP Operations',
    reason: 'Incorrect cost.',
  },
   {
    id: 5,
    date: '2025-05-21',
    amount: 2600,
    status: 'Rejected by AE',
    reason: 'Incorrect cost.',
  },
  
];


const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

const FilterBar = ({ selectedStatus, onStatusChange, selectedDate, onDateChange }) => (
  <div className="w-full flex flex-col md:flex-row gap-6 mb-6 px-6">
    <div className="w-full md:w-1/3">
      <label className="block text-sm font-medium mb-2">Filter by Date</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="w-full border p-2 rounded"
      />
    </div>
    <div className="w-full md:w-1/3">
      <label className="block text-sm font-medium mb-2">Filter by Status</label>
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full border p-2 rounded"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  </div>
);



const MySettlements = () => {
  const [selectedReason, setSelectedReason] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [clarificationModalOpen, setClarificationModalOpen] = useState(false);
  const [clarificationText, setClarificationText] = useState('');
  const [clarificationId, setClarificationId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [clarificationsSubmitted, setClarificationsSubmitted] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 2;

  const openClarificationModal = (id) => {
    setClarificationId(id);
    setClarificationModalOpen(true);
  };

  const submitClarification = () => {
  setClarificationsSubmitted((prev) => [...prev, clarificationId]);
  setClarificationModalOpen(false);
  setClarificationText('');
};


  const openModal = (reason) => {
    setSelectedReason(reason);
    setModalOpen(true);
  };

  const filteredRequests = dummyRequests.filter((req) => {
  const normalizedStatus = req.status.toLowerCase();

  const matchStatus =
    selectedStatus === 'All' ||
    normalizedStatus === selectedStatus.toLowerCase() ||
    (selectedStatus === 'Rejected' && normalizedStatus.startsWith('rejected'));

  const matchDate = !selectedDate || req.date === selectedDate;

  return matchStatus && matchDate;
});


  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className='bg-white shadow-md rounded-md pb-8'>
      <h3 className="text-2xl font-bold mb-4 py-4 px-6 text-green-600 ">My Settlement Requests</h3>

      <FilterBar
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="overflow-x-auto px-6">
        <table className="min-w-full border text-sm bg-white shadow-md rounded">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((req, idx) => (
              <tr key={req.id}>
                <td className="p-3 border">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                <td className="p-3 border">{req.date}</td>
                <td className="p-3 border">₹ {req.amount}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      req.status === 'Pending'
                        ? 'text-yellow-500'
                        : req.status === 'Approved'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="p-3 border">
                  {req.status.startsWith('Rejected') && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openModal(req.reason)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Rejection Reason"
                      >
                        <AiOutlineEye size={20} />
                      </button>
                      {clarificationsSubmitted.includes(req.id) ? (
                        <span className="text-green-600 text-xs font-semibold">Clarification Submitted</span>
                      ) : (
                        <button
                          onClick={() => openClarificationModal(req.id)}
                          className="bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Clarification
                        </button>
                        )}
                    </div>

                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-6 px-6 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <RejectionReasonModal
        isOpen={modalOpen}
        reason={selectedReason}
        onClose={() => setModalOpen(false)}
      />

      {clarificationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Submit Clarification</h2>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4"
              rows="4"
              placeholder="Enter clarification..."
              value={clarificationText}
              onChange={(e) => setClarificationText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setClarificationModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitClarification}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

export default MySettlements;
