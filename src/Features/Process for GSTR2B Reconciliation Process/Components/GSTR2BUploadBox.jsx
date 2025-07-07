import React from "react";

export default function GSTR2BUploadBox({ onUpload }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "application/json",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv",
      "application/pdf",
      "application/zip",
    ];

    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload a JSON, Excel, CSV, PDF or ZIP file.");
      return;
    }

    onUpload(file);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-8 rounded-xl text-center shadow bg-gray-50">
      <p className="text-gray-600 text-sm mb-4">Upload GSTR-2B File (.json, .xlsx, .csv, .pdf, .zip)</p>
      <label className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow">
        Upload File
        <input
          type="file"
          accept=".json,.xlsx,.xls,.csv,.pdf,.zip"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
