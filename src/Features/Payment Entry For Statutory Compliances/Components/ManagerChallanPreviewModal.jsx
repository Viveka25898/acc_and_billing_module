// File: src/features/statutoryPayments/components/ChallanPreviewModal.jsx

import React, { useEffect, useState } from "react";

export default function ManagerChallanPreviewModal({ file, onClose }) {
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const url = typeof file === "string" ? file : URL.createObjectURL(file);
    setFileUrl(url);
    setLoading(false);
    return () => {
      if (typeof file !== "string") URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl h-[80vh] relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-red-500 font-bold text-xl z-50"
        >
          ×
        </button>
        <div className="p-5 pt-10 flex flex-col h-full">
          <h2 className="text-lg font-semibold mb-4">Challan Preview</h2>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Loading document...</p>
            </div>
          ) : (
            <>
              <iframe
                src={fileUrl}
                title="Challan Preview"
                className="w-full flex-1 border rounded-md"
              ></iframe>
              <div className="text-center mt-4">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Open full document in web
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}