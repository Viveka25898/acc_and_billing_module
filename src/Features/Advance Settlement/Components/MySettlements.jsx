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
    status: 'Rejected',
    reason: 'Receipt missing.',
  },
];

const MySettlements = () => {
  const [selectedReason, setSelectedReason] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [clarificationModalOpen, setClarificationModalOpen] = useState(false);
const [clarificationText, setClarificationText] = useState('');
const [clarificationId, setClarificationId] = useState(null);

const openClarificationModal = (id) => {
  setClarificationId(id);
  setClarificationModalOpen(true);
};

const submitClarification = () => {
  console.log('Clarification submitted for ID:', clarificationId, clarificationText);
  setClarificationModalOpen(false);
  setClarificationText('');
};

  const openModal = (reason) => {
    setSelectedReason(reason);
    setModalOpen(true);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">My Settlement Requests</h3>
      <div className="overflow-x-auto">
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
            {dummyRequests.map((req, idx) => (
              <tr key={req.id}>
                <td className="p-3 border">{idx + 1}</td>
                <td className="p-3 border">{req.date}</td>
                <td className="p-3 border">₹ {req.amount}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      req.status === 'Pending'
                        ? 'bg-yellow-500'
                        : req.status === 'Approved'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="p-3 border">
                        {req.status === 'Rejected' && (
                            <div className="flex items-center gap-3">
                            <button
                                onClick={() => openModal(req.reason)}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Rejection Reason"
                            >
                                <AiOutlineEye size={20} />
                            </button>
                            <button
                                onClick={() => openClarificationModal(req.id)}
                                className="bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600"
                            >
                                Clarification
                            </button>
                            </div>
                        )}
                </td>


              </tr>
            ))}
          </tbody>
        </table>
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
