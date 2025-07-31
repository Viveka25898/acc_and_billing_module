import React, { useState } from 'react';

export default function RejectModal({ onSubmit, onClose }) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim() !== '') {
      onSubmit(reason);
      setReason('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-2">Enter Rejection Reason</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          rows="4"
          placeholder="Type your reason here..."
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
