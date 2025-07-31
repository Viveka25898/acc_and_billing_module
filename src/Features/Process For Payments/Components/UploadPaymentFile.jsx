/* eslint-disable no-debugger */
// src/features/processPayments/components/UploadPaymentFile.jsx
import React, { useRef } from "react";

export default function UploadPaymentFile({ onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    
    const file = e.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      onFileUpload(file);
      e.target.value=null; // Reset file input
    } else {
      alert("Please upload a valid .xlsx file.");
    }
  };

  return (
    <div className=" p-6 w-full">
      <div className="text-center space-y-4">
        <p className="text-gray-700 font-medium">
          Upload Excel file with payment details (.xlsx)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          onChange={handleChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
        >
          Choose File
        </button>
      </div>
    </div>
  );
}
