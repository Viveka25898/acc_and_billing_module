import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const ManagerClarificationModal = ({ 
  isOpen, 
  onClose, 
  data, 
  onApprove, 
  onReject 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Request Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Original Rejection Details */}
          {data.rejectionHistory && (
            <div className="border-b pb-4">
              <h4 className="font-semibold text-red-600 mb-2">Original Rejection</h4>
              <p><span className="font-medium">By:</span> {data.rejectionHistory.by}</p>
              <p><span className="font-medium">Date:</span> {new Date(data.rejectionHistory.date).toLocaleString()}</p>
              <p><span className="font-medium">Reason:</span> {data.rejectionHistory.comments || data.rejectionReason}</p>
            </div>
          )}

          {/* Clarification Details */}
          {data.clarificationHistory && (
            <div className="border-b pb-4">
              <h4 className="font-semibold text-purple-600 mb-2">Clarification Submitted</h4>
              <p><span className="font-medium">By:</span> {data.clarificationHistory.by}</p>
              <p><span className="font-medium">Date:</span> {new Date(data.clarificationHistory.date).toLocaleString()}</p>
              <p><span className="font-medium">Comments:</span> {data.clarificationHistory.comments}</p>
            </div>
          )}

          {/* Current Status */}
          <div>
            <h4 className="font-semibold mb-2">Current Status</h4>
            <p>{data.status}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onReject}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reject Again
            </button>
            <button
              onClick={onApprove}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerClarificationModal;