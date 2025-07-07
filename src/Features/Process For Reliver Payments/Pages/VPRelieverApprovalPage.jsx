/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import FilterBar from "../Components/Filter";
import ReusableRelieverTable from "../Components/ReusableRelieverTable";
import relieverLMdummyData from "../data/reliveeLMdummyData";

export default function VPRelieverApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const pending = relieverLMdummyData.filter(
      (req) => req.status === "Pending VP Approval"
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
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const isBeforeDeadline = currentHour < 11 || (currentHour === 11 && currentMinute < 59);

  if (reason) {
    toast.error(`Request rejected: ${reason}`);
  } else {
    if (!isBeforeDeadline) {
      toast.info("Request approved. Will be processed next day.");
    } else {
      toast.success("Request approved successfully!");
    }
  }

  const updated = filtered.map((req) =>
    req.id === id
      ? {
          ...req,
          status: newStatus,
          delayed: !reason && !isBeforeDeadline,
          rejectionReason: reason || null,
        }
      : req
  );

  setFiltered(updated);
};


  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">VP Operations - Approvals</h1>
      <FilterBar onFilter={handleFilter} />
      <ReusableRelieverTable
        requests={filtered}
        onStatusChange={handleStatusChange}
        showActions={true}
      />
    </div>
  );
}
