// components/RemarkModal.jsx
import React from 'react';

const RemarkModal = ({ isOpen, onClose, onSubmit, remark, setRemark }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
    <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl relative">
      <h3 className="text-lg font-semibold mb-2">Enter Rejection Remark</h3>
      <textarea
        className="w-full border p-2 rounded resize-none text-sm"
        rows="4"
        placeholder="Type your reason..."
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
  );
};

export default RemarkModal;
