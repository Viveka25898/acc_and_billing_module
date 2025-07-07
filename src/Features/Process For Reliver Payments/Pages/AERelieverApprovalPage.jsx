// File: src/features/relieverPayments/pages/AccountsExecutivePage.jsx
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import relieverDummyData from "../data/relieverDummyData";
import FilterBar from "../Components/Filter";
import ReusableRelieverTable from "../Components/ReusableRelieverTable";

export default function AERelieverApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const pendingForAE = relieverDummyData.filter(
      (req) => req.status === "Pending Accounts Approval"
    );
    setRequests(pendingForAE);
    setFiltered(pendingForAE);
  }, []);

  const handleFilter = (filters) => {
    let temp = [...requests];
    if (filters.name.trim()) {
      temp = temp.filter((req) =>
        req.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.status) {
      temp = temp.filter((req) => req.status === filters.status);
    }
    setFiltered(temp);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = filtered.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    setFiltered(updated);
    toast.success("Payment Approved & Marked Done!");
  };

  const simulateUpload = () => {
    toast.success("Payment file uploaded to Bank Portal!");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">
          Accounts Executive - Payment Approvals
        </h1>
        <button
          onClick={simulateUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload Payment File
        </button>
      </div>

      <FilterBar onFilter={handleFilter} />
      <ReusableRelieverTable
        requests={filtered}
        onStatusChange={(id) => handleStatusChange(id, "Approved & Payment Done")}
        showActions={true}
        role="ae"
      />
    </div>
  );
}
