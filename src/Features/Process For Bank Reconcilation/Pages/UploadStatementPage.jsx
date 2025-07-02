/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { dummyBankData } from "../data/dummyBankData";
import { matchTransactions } from "../Components/MatchTransactions";
import FileUploadBox from "../Components/FileUploadBox";
import StatementPreviewTable from "../Components/StatementPreviewTable";
import SummaryCard from "../Components/SummeryCard";
import MatchedTransactionsTable from "../Components/MatchedTransactionTable";
import UnmatchedTransactionsTable from "../Components/UnMatchedTransactionTable";
import { useNavigate } from "react-router-dom";
import { dummyBookData } from "../data/dummyBookData";
import UnifiedReconciliationTable from "../Components/UnifiedReconciliationTable";


export default function UploadStatementPage() {
  const [file, setFile] = useState(null);
  const [bankData, setBankData] = useState([]);
  
  const [records, setRecords] = useState([]);


  const navigate=useNavigate()

  const handleFileUpload = (selectedFile, dateRange) => {
  console.log("Date range:", dateRange); 
  setFile(selectedFile);
  setBankData(dummyBankData); 
};


  const handleReconcile = () => {
  const result = matchTransactions(dummyBankData, dummyBookData);
  setRecords(result);
};

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-green-700">Bank Reconciliation</h1>
      <div className="flex justify-end mb-4">
  <button
    onClick={() => navigate("/dashboard/billing-manager/reconciliation-history")}
    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow cursor-pointer"
  >
    My History
  </button>
</div>

      <FileUploadBox onUpload={handleFileUpload} />

      {bankData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Statement Preview</h2>
          <StatementPreviewTable data={dummyBankData} />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReconcile}
              className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            >
              Reconcile
            </button>
          </div>
        </div>
      )}

      {records.length > 0 && (
        <div className="mt-10">
          {/* <SummaryCard matched={matched.length} unmatched={unmatched.length} total={bankData.length} /> */}

          <UnifiedReconciliationTable data={records}/>
        </div>
      )}
    </div>
  );
}
