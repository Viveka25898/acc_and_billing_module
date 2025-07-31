import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import relieverDummyData from "../data/relieverDummyData";
import FilterBar from "../Components/Filter";
import LineManagerApprovalTable from "../Components/LineManagerApprovalTable";

export default function LineManagerRelieverApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const pending = relieverDummyData.filter(
      (req) => req.status === "Pending Line Manager Approval"
    );
    setRequests(pending);
    setFiltered(pending);
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
    const updated = filtered.map((req) =>
      req.id === id
        ? { ...req, status: newStatus, rejectionReason: reason || null }
        : req
    );
    setFiltered(updated); 
    setRequests(updated)

    if (reason) {
      toast.error(`Request rejected: ${reason}`);
    } else {
      toast.success("Request approved successfully!");
    }
  };

  //Bulk Approve
  const handleBulkApprove = (ids) => {
  const updated = filtered.map((req) =>
    ids.includes(req.id)
      ? { ...req, status: "Pending VP Operations Approval", rejectionReason: null }
      : req
  );
  setFiltered(updated);
  setRequests(updated);
  toast.success(`${ids.length} request(s) approved successfully!`);
};

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Line Manager - Approvals</h1>
      <FilterBar onFilter={handleFilter} />
      <LineManagerApprovalTable
        requests={filtered}
        onStatusChange={handleStatusChange}
         onBulkApprove={handleBulkApprove} 
        showActions={true}
        role="lm" 
      />
    </div>
  );
}
