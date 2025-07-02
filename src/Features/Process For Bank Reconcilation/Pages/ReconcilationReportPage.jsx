// File: src/features/bankReconciliation/pages/ReconciliationReportPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReconciliationById } from "../utils/reconciliationHistory";
import MatchedTransactionsTable from "../components/MatchedTransactionsTable";
import UnmatchedTransactionsTable from "../components/UnmatchedTransactionsTable";
import SummaryCard from "../components/SummaryCard";

export default function ReconciliationReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = getReconciliationById(id);

  if (!data) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Report not found.</p>
        <button onClick={() => navigate("/bank-reco/history")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-700">Reconciliation Report</h1>
      <p className="text-center text-sm text-gray-500 mb-4">File: <strong>{data.fileName}</strong> | Date: {new Date(data.date).toLocaleString()}</p>

      <SummaryCard matched={data.matched.length} unmatched={data.unmatched.length} total={data.matched.length + data.unmatched.length} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 mb-2">Matched Transactions</h2>
        <MatchedTransactionsTable data={data.matched} />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Unmatched Transactions</h2>
        <UnmatchedTransactionsTable data={data.unmatched} />
      </div>
    </div>
  );
}
