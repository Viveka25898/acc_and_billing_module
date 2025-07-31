import React, { useState } from "react";

export default function GSTR2BUploadBox({ onUpload }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
      alert("Invalid file type. Please upload a JSON, Excel, CSV, PDF, or ZIP file.");
      return;
    }

    // Pass file with date filters to parent
    onUpload(file, { fromDate, toDate });
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-8 rounded-xl text-center shadow bg-gray-50">
      {/* Date Range Filters */}
      <div className="flex justify-center gap-6 flex-wrap mb-6">
        <div className="flex flex-col items-start">
          <label className="text-sm text-gray-700 font-medium mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-sm text-gray-700 font-medium mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Upload Section */}
      <p className="text-gray-600 text-sm mb-4">
        Upload GSTR-2B File (.json, .xlsx, .csv, .pdf, .zip)
      </p>
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
