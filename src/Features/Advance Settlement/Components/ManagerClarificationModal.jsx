import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const ManagerClarificationModal = ({ isOpen, onClose, data, onApprove, onReject }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">
          <AiOutlineClose size={18} />
        </button>
        <h3 className="text-xl font-semibold mb-4">Clarification from {data.employeeName}</h3>

        <div className="mb-4">
          <p><strong>Rejection Remark:</strong></p>
          <p className="text-red-600">{data.remarks}</p>
        </div>

        <div className="mb-4">
          <p><strong>Employee Clarification:</strong></p>
          <p className="text-gray-700">{data.clarification}</p>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onApprove(data.id)}
            className="bg-green-600 text-white px-4 py-1 rounded text-sm"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(data.id)}
            className="bg-red-600 text-white px-4 py-1 rounded text-sm"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerClarificationModal;
