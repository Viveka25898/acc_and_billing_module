import React from "react";

export default function RejectionReasonModal({ isOpen, onClose, reason, rejectedBy }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Rejection Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="font-medium">Rejected By:</p>
            <p className="text-gray-700">{rejectedBy || "Unknown approver"}</p>
          </div>
          
          <div>
            <p className="font-medium">Reason:</p>
            <p className="text-gray-700 whitespace-pre-line">
              {reason || "No reason provided"}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}