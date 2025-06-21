import React from "react";

export default function RejectionReasonModal({ reason, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500 font-bold">X</button>
        <h2 className="text-lg font-semibold mb-4 text-red-700">Rejection Reason</h2>
        <p className="text-gray-800">{reason}</p>
      </div>
    </div>
  );
}
