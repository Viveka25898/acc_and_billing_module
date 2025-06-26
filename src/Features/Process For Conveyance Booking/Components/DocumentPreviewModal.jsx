// File: src/features/conveyance/components/DocumentViewerModal.jsx

import React from "react";

export default function DocumentPreviewModal({ url, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="text-base font-semibold">Receipt</h3>
          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold hover:text-red-700"
          >
            ×
          </button>
        </div>

        {/* Iframe viewer */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={url}
            title="Document Viewer"
            className="w-full h-full border-none"
          ></iframe>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            View Full Document in Web
          </a>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
