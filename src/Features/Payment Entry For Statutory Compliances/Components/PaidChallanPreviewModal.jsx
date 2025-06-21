// File: src/features/statutoryPayments/components/PaidChallanPreviewModal.jsx

import React from "react";

export default function PaidChallanPreviewModal({ file, onClose }) {
 return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 font-bold text-2xl"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">Challan Preview</h2>
        <iframe
          src={file}
          title="Challan Preview"
          className="w-full h-[300px] border"
        ></iframe>
        <div className="mt-4 text-right">
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            Open Full Document in Web
          </a>
        </div>
      </div>
    </div>
  );
}
