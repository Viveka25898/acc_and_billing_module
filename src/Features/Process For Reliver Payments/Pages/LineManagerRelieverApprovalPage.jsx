import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import relieverDummyData from "../data/relieverDummyData";
import FilterBar from "../Components/Filter";
import ReusableRelieverTable from "../Components/ReusableRelieverTable";

export default function LineManagerRelieverApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const filteredData = relieverDummyData.filter(
      (req) => req.status === "Pending Line Manager Approval"
    );
    setRequests(filteredData);
    setFiltered(filteredData);
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

  const handleStatusChange = (id, newStatus, reason = null) => {
    const updated = filtered.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status: newStatus,
          rejectionReason: reason,
        };
      }
      return req;
    });
    setFiltered(updated);
    toast.success(
      newStatus === "Pending VP Approval"
        ? "Request Approved"
        : "Request Rejected"
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Line Manager - Pending Requests</h1>
      <FilterBar onFilter={handleFilter} />
      <ReusableRelieverTable
        requests={filtered}
        onStatusChange={handleStatusChange}
        showActions={true}
      />
    </div>
  );
}
