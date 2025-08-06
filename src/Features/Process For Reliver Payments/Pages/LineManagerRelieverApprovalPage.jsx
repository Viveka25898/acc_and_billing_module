import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FilterBar from "../Components/Filter";
import LineManagerApprovalTable from "../Components/LineManagerApprovalTable";

export default function LineManagerRelieverApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadRequests = () => {
      try {
        const allRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
        const pendingRequests = allRequests.filter(
          req => req.status === "Pending Line Manager Approval" && 
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

  const handleStatusChange = (id, newStatus, reason = null) => {
    const updated = requests.map((req) => {
      if (req.id !== id) return req;
      
      const historyEntry = {
        action: newStatus.includes("Rejected") ? "Rejected by Line Manager" : "Approved by Line Manager",
        by: currentUser.username,
        at: new Date().toISOString(),
        comments: reason || "Approved"
      };

      return {
        ...req,
        status: newStatus,
        currentApprover: newStatus.includes("VP") ? req.approvers.vpOperations : req.submittedBy,
        history: [...req.history, historyEntry],
        rejectionReason: reason || null
      };
    });

    setRequests(updated);
    setFiltered(updated);
    updateLocalStorage(updated);

    if (reason) {
      toast.error(`Request #${id.slice(-6)} rejected`);
    } else {
      toast.success(`Request #${id.slice(-6)} approved`);
    }
  };

  const handleBulkApprove = (ids) => {
    const updated = requests.map((req) => {
      if (!ids.includes(req.id)) return req;
      
      const historyEntry = {
        action: "Approved by Line Manager",
        by: currentUser.username,
        at: new Date().toISOString(),
        comments: "Bulk approved"
      };

      return {
        ...req,
        status: "Pending VP Operations Approval",
        currentApprover: req.approvers.vpOperations,
        history: [...req.history, historyEntry],
        rejectionReason: null
      };
    });

    setRequests(updated);
    setFiltered(updated);
    updateLocalStorage(updated);
    toast.success(`${ids.length} request(s) approved`);
  };

  const handleFilter = (filters) => {
    let temp = [...requests];
    if (filters.name?.trim()) {
      temp = temp.filter((req) =>
        req.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    setFiltered(temp);
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
      />
    </div>
  );
}