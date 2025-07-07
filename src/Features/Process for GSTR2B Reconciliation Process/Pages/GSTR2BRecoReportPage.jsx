// File: src/features/gstr2bReco/pages/GSTR2BRecoReportPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import GSTR2BRecoReport from "../Components/GSTR2BRecoReport";

// Dummy reconciliation data
const dummyRecoData = {
  fileName: "GSTR2B_July_2025.json",
  date: "2025-07-05T14:20:00Z",
  records: [
    {
      date: "2025-07-01",
      gstin: "27AAAAA0000A1Z5",
      invoiceNumber: "INV-1001",
      taxAmount: 1200,
      inGSTR2B: true,
      inBooks: true,
    },
    {
      date: "2025-07-01",
      gstin: "27BBBBB1111B2Z6",
      invoiceNumber: "INV-1002",
      taxAmount: 1500,
      inGSTR2B: true,
      inBooks: false,
    },
    {
      date: "2025-07-02",
      gstin: "27CCCCC2222C3Z7",
      invoiceNumber: "INV-1003",
      taxAmount: 2000,
      inGSTR2B: false,
      inBooks: true,
    },
  ],
};

export default function GSTR2BRecoReportPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-700">GSTR-2B Reconciliation Report</h1>

      <p className="text-center text-sm text-gray-500 mb-4">
        File: <strong>{dummyRecoData.fileName}</strong> | Date:{" "}
        {new Date(dummyRecoData.date).toLocaleString()}
      </p>

      <GSTR2BRecoReport records={dummyRecoData.records} />

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/gstr2b-reco/history")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Back to History
        </button>
      </div>
    </div>
  );
}
