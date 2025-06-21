// File: src/features/statutoryPayments/pages/ComplianceEntryPage.jsx

import React from "react";
import ComplianceEntryForm from "../Components/ComplianceEntryForm";
import { useNavigate } from "react-router-dom";

export default function ComplianceEntryPage() {
  const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-green-600">
            Statutory Payment Entry
          </h2>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
            onClick={()=>navigate("/dashboard/compliance-team/submitted-entries")}
          >
            Compliance Submitted Entries
          </button>
        </div>
        <ComplianceEntryForm />
      </div>
    </div>
  );
}
