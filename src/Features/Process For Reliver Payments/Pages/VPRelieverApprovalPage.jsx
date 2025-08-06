import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FilterBar from "../Components/Filter";
import VPApprovalTable from "../Components/VPApprovalTable";

export default function VPRelieverApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadRequests = () => {
      try {
        const allRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
        const pendingRequests = allRequests.filter(
          req => req.status === "Pending VP Operations Approval" && 
                req.currentApprover === currentUser.username
        );
        setRequests(pendingRequests);
        setFiltered(pendingRequests);
      } catch (error) {
        console.error("Error loading requests:", error);
        toast.error("Failed to load requests");
      }
    };
    loadRequests();
  }, [currentUser?.username]);

  const updateLocalStorage = (updatedRequests) => {
    const allRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
    const updatedAllRequests = allRequests.map(req => {
      const updatedReq = updatedRequests.find(ur => ur.id === req.id);
      return updatedReq || req;
    });
    localStorage.setItem("relieverRequests", JSON.stringify(updatedAllRequests));
  };

  const canApproveNow = () => {
    const now = new Date();
    return now.getHours() < 11 || (now.getHours() === 11 && now.getMinutes() < 59);
  };

  const handleStatusChange = (id, newStatus, reason = null) => {
  const now = new Date();
  const isBeforeDeadline = canApproveNow();
  
  setRequests(prevRequests => {
    const request = prevRequests.find(req => req.id === id);
    if (!request) return prevRequests;

    const historyEntry = {
      action: newStatus.includes("Rejected") ? 
        "Rejected by VP Operations" : 
        "Approved by VP Operations",
      by: currentUser.username,
      at: now.toISOString(),
      comments: reason || (isBeforeDeadline ? "Approved" : "Approved (after deadline)")
    };

    const updatedRequest = {
      ...request,
      status: newStatus,
      currentApprover: newStatus.includes("Rejected") 
        ? request.submittedBy 
        : request.approvers.accountExecutive,
      history: [...request.history, historyEntry],
      rejectionReason: reason || null,
      delayed: !reason && !isBeforeDeadline
    };

    // Update localStorage
    const allRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
    const updatedAllRequests = allRequests.map(req => 
      req.id === id ? updatedRequest : req
    );
    localStorage.setItem("relieverRequests", JSON.stringify(updatedAllRequests));

    return prevRequests.map(req => req.id === id ? updatedRequest : req);
  });

  // Update filtered requests
  setFiltered(prev => prev.map(req => 
    req.id === id ? {
      ...req,
      status: newStatus,
      rejectionReason: reason || null,
      delayed: !reason && !isBeforeDeadline
    } : req
  ));

  // Show toast
  if (reason) {
    toast.error(`Request #${id.slice(-6)} rejected`);
  } else if (!isBeforeDeadline) {
    toast.info(`Request #${id.slice(-6)} approved (will process next day)`);
  } else {
    toast.success(`Request #${id.slice(-6)} approved`);
  }
};

  const handleBulkApprove = (ids) => {
  const isBeforeDeadline = canApproveNow();
  
  if (!isBeforeDeadline) {
    toast.info("Approvals after 11:59 AM will be processed next day");
  }

  const updated = requests.map(req => {
    if (!ids.includes(req.id)) return req;

    const historyEntry = {
      action: "Approved by VP Operations",
      by: currentUser.username,
      at: new Date().toISOString(),
      comments: isBeforeDeadline ? "Bulk approved" : "Bulk approved (after deadline)"
    };

    return {
      ...req,
      status: "Pending Account Executive Approval",
      currentApprover: req.approvers.accountExecutive,
      history: [...req.history, historyEntry],
      rejectionReason: null,
      delayed: !isBeforeDeadline
    };
  });

  setRequests(updated);
  setFiltered(updated);
  updateLocalStorage(updated);

  if (!isBeforeDeadline) {
    toast.info(`${ids.length} request(s) approved (will process next day)`);
  } else {
    toast.success(`${ids.length} request(s) approved`);
  }
};

  const handleFilter = (filters) => {
    let temp = [...requests];
    if (filters.name?.trim()) {
      temp = temp.filter(req =>
        req.name.toLowerCase().includes(filters.name.toLowerCase())
    )}
    setFiltered(temp);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">
        VP Operations - Approvals
        {!canApproveNow() && (
          <span className="ml-4 text-sm text-red-600 font-normal">
            (Approvals after 11:59 AM will be processed next day)
          </span>
        )}
      </h1>
      <FilterBar onFilter={handleFilter} />
      <VPApprovalTable
        requests={filtered}
        onStatusChange={handleStatusChange}
        onBulkApprove={handleBulkApprove}
        showActions={true}
        canApproveNow={canApproveNow()}
      />
    </div>
  );
}