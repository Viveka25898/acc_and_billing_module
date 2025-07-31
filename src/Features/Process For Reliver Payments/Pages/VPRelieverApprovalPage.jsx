/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FilterBar from "../Components/Filter";
import relieverLMdummyData from "../data/reliveeLMdummyData";
import VPApprovalTable from "../Components/VPApprovalTable";

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
console.log(requests);
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

const handleBulkApprove = (ids) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const isBeforeDeadline = currentHour < 11 || (currentHour === 11 && currentMinute < 59);

  const updated = filtered.map((req) =>
    ids.includes(req.id)
      ? {
          ...req,
          status: "Pending AE Approval",
          delayed: !isBeforeDeadline,
          rejectionReason: null,
        }
      : req
  );

  setFiltered(updated);
  setRequests(updated);

  if (!isBeforeDeadline) {
    toast.info(`${ids.length} request(s) approved. Will be processed next day.`);
  } else {
    toast.success(`${ids.length} request(s) approved successfully!`);
  }
};



  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">VP Operations - Approvals</h1>
      <FilterBar onFilter={handleFilter} />
      <VPApprovalTable
        requests={filtered}
        onStatusChange={handleStatusChange}
        onBulkApprove={handleBulkApprove} 
        showActions={true}
      />
    </div>
  );
}
