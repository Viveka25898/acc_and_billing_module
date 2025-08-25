// ManagerChallanPreviewModal.js
import React from "react";
import { FaTimes, FaDownload } from "react-icons/fa";

export default function ManagerChallanPreviewModal({ file, onClose }) {
  if (!file) return null;

  const isPDF = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");
  const isExcel =
    file.type === "application/vnd.ms-excel" ||
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 h-5/6 relative p-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">{file.name}</h2>

        <div className="h-[80%] overflow-auto flex items-center justify-center bg-gray-50 border rounded">
          {isPDF && (
            <iframe
              src={file.data}
              title="PDF Preview"
              className="w-full h-full"
            ></iframe>
          )}
          {isImage && (
            <img
              src={file.data}
              alt={file.name}
              className="max-h-full max-w-full object-contain"
            />
          )}
          {isExcel && (
            <div className="text-center">
              <p className="text-gray-700 mb-2">
                Preview not supported for Excel files.
              </p>
              <a
                href={file.data}
                download={file.name}
                className="bg-green-600 text-white px-4 py-2 rounded inline-flex items-center gap-2 hover:bg-green-700"
              >
                <FaDownload /> Download
              </a>
            </div>
          )}
          {!isPDF && !isImage && !isExcel && (
            <div className="text-center">
              <p className="text-gray-700 mb-2">
                Preview not available for this file type.
              </p>
              <a
                href={file.data}
                download={file.name}
                className="bg-green-600 text-white px-4 py-2 rounded inline-flex items-center gap-2 hover:bg-green-700"
              >
                <FaDownload /> Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
