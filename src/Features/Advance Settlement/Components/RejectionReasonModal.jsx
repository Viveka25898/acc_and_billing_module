import React from 'react';

const RejectionReasonModal = ({ isOpen, reason, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Rejection Reason</h2>
        <p className="text-gray-800 mb-6">{reason}</p>
        <div className="text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionReasonModal;
