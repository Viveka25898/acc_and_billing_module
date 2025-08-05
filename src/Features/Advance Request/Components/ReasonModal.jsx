import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function ReasonModal({ 
  reason, 
  customReason, 
  clarification, 
  remarks, 
  onClose 
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Request Details
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="space-y-4">
          {remarks && (
            <div>
              <h3 className="font-medium text-red-600 mb-1">Rejection Remarks</h3>
              <p className="text-gray-700 bg-red-50 p-3 rounded">{remarks}</p>
            </div>
          )}

          {reason && reason !== 'Other' && (
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Reason</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{reason}</p>
            </div>
          )}

          {customReason && (
            <div>
              <h3 className="font-medium text-gray-700 mb-1">
                {reason === 'Other' ? 'Reason Details' : 'Additional Information'}
              </h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{customReason}</p>
            </div>
          )}

          {clarification && (
            <div>
              <h3 className="font-medium text-green-600 mb-1">Submitted Clarification</h3>
              <p className="text-gray-700 bg-green-50 p-3 rounded">{clarification}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-right">
          <button 
            onClick={onClose} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}