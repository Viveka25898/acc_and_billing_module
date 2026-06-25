import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const ManagerClarificationModal = ({ 
  isOpen, 
  onClose, 
  data, 
  onApprove, 
  onReject 
}) => {
  if (!isOpen || !data) return null;

  const settlementNo = data.settlementId || data.settlement_no || data.id || '—';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-green-50 transform scale-100 transition-all duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center text-white">
          <div>
            <h3 className="text-lg font-bold">Clarification Details</h3>
            <p className="text-xs text-green-100 mt-0.5 font-mono">Settlement No: {settlementNo}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white focus:outline-none"
            aria-label="Close modal"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Original Rejection Details */}
          {data.rejectionHistory && (
            <div className="bg-red-50/70 border border-red-100 rounded-xl p-4 text-sm">
              <h4 className="font-bold text-red-700 flex items-center gap-1.5 mb-2">
                <span>❌</span> Original Rejection
              </h4>
              <div className="space-y-1.5 text-gray-700">
                <p><span className="font-semibold text-gray-600">By:</span> {data.rejectionHistory.by || 'Regional Head'}</p>
                {data.rejectionHistory.date && (
                  <p>
                    <span className="font-semibold text-gray-600">Date:</span>{' '}
                    {new Date(data.rejectionHistory.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
                <div className="mt-2 bg-white/80 p-2.5 rounded-lg border border-red-50 font-medium text-red-900 font-sans">
                  {data.rejectionHistory.comments || 'No comment provided.'}
                </div>
              </div>
            </div>
          )}

          {/* Clarification Details */}
          {data.clarificationHistory && (
            <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-4 text-sm">
              <h4 className="font-bold text-purple-700 flex items-center gap-1.5 mb-2">
                <span>💬</span> Clarification Submitted
              </h4>
              <div className="space-y-1.5 text-gray-700">
                <p><span className="font-semibold text-gray-600">By:</span> Employee / OE</p>
                {data.clarificationHistory.date && (
                  <p>
                    <span className="font-semibold text-gray-600">Date:</span>{' '}
                    {new Date(data.clarificationHistory.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
                <div className="mt-2 bg-white/80 p-2.5 rounded-lg border border-purple-50 font-medium text-purple-900 font-sans">
                  {data.clarificationHistory.comments || 'No comments.'}
                </div>
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-600">Current Status:</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 animate-pulse">
              {data.status || 'Pending Review'}
            </span>
          </div>

        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onReject}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
          >
            Reject Again
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition shadow-sm"
          >
            Approve
          </button>
        </div>

      </div>
    </div>
  );
};

export default ManagerClarificationModal;