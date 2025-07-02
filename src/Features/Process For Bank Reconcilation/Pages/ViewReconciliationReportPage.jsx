// File: src/features/bankReconciliation/pages/ViewReconciliationReportPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ReconciliationReport from "../Components/ReconciliationReport";
import { getReconciliationById } from "../utils/saveReconcilation";

export default function ViewReconciliationReportPage() {
  const { id } = useParams();
  const record = getReconciliationById(id);

  if (!record || !Array.isArray(record.records)) {
    return (
      <div className="text-center text-red-600 mt-10">
        ⚠️ Reconciliation report not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-4">
        Reconciliation Report — {record.fileName}
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Date: {new Date(record.date).toLocaleString()}
      </p>

      <ReconciliationReport records={record.records} />
    </div>
  );
}
