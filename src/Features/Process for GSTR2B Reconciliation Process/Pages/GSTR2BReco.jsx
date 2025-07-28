import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { matchGSTR2BWithBooks } from "../utils/matchGSTR2BWithBooks";
import { dummyGSTR2BData } from "../data/dummyGSTR2BData";
import { dummyBookData } from "../data/dummyBookData";
import { saveRecoToHistory } from "../utils/recoHistoryService";
import GSTR2BUploadBox from "../Components/GSTR2BUploadBox";
import UnifiedGSTR2BRecoTable from "../Components/UnifiedGSTR2BRecoTable";

export default function GSTR2BRecoPage() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  const handleUpload = (file) => {
    const result = matchGSTR2BWithBooks(dummyGSTR2BData, dummyBookData);
    const record = {
      id: Date.now().toString(),
      fileName: file.name || "dummy-gstr2b.json",
      date: new Date().toISOString(),
      records: result,
    };
    saveRecoToHistory(record);
    setRecords(result);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-md shadow">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-700">GSTR-2B Reconciliation</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/dashboard/billing-manager/gsr2b-history-page")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          My History
        </button>
      </div>
      <GSTR2BUploadBox onUpload={handleUpload} />
      {records.length > 0 && (
        <div className="mt-10">
          <UnifiedGSTR2BRecoTable data={records} />
        </div>
      )}
    </div>
  );
}
