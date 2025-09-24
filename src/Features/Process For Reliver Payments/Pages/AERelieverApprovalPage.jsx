import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import FilterBar from "../Components/Filter";
import AEApprovalTable from "../Components/AEApprovalTable";
import RelieverPaymentEntryModal from "../Components/RelieverPaymentEntryModal"; // Import the modal

export default function AERelieverApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedApprovedRequests, setSelectedApprovedRequests] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadRequests = () => {
      try {
        const allRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
        
        // Filter requests that are either pending for current user or already processed by current user
        const relevantRequests = allRequests.filter(req => {
          // Pending requests for current user
          if (req.status === "Pending Account Executive Approval" && 
              req.currentApprover === currentUser.username) {
            return true;
          }
          
          // Approved or rejected requests by current user
          if ((req.status === "Approved" || req.status.includes("Rejected by Account Executive")) &&
              req.history?.some(h => h.by === currentUser.username && 
                (h.action === "Approved by Account Executive" || h.action === "Rejected by Account Executive"))) {
            return true;
          }
          
          return false;
        });

        // Sort requests: Pending first, then Approved, then Rejected
        const sortedRequests = relevantRequests.sort((a, b) => {
          const getStatusPriority = (status) => {
            if (status === "Pending Account Executive Approval") return 1;
            if (status === "Approved") return 2;
            if (status.includes("Rejected")) return 3;
            return 4;
          };
          
          return getStatusPriority(a.status) - getStatusPriority(b.status);
        });

        setRequests(sortedRequests);
        setFiltered(sortedRequests);
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
    const now = new Date();
    const request = requests.find(req => req.id === id);

    if (!request) return;

    const historyEntry = {
      action: newStatus.includes("Rejected") ? 
        "Rejected by Account Executive" : 
        "Approved by Account Executive",
      by: currentUser.username,
      at: now.toISOString(),
      comments: reason || "Approved"
    };

    const updatedRequest = {
      ...request,
      status: newStatus,
      currentApprover: newStatus.includes("Rejected") 
        ? request.submittedBy 
        : null, // No further approver needed
      history: [...request.history, historyEntry],
      rejectionReason: reason || null,
      approvedAt: newStatus === "Approved" ? now.toISOString() : null
    };

    const updated = requests.map(req => 
      req.id === id ? updatedRequest : req
    );

    // Re-sort after status change
    const sortedUpdated = updated.sort((a, b) => {
      const getStatusPriority = (status) => {
        if (status === "Pending Account Executive Approval") return 1;
        if (status === "Approved") return 2;
        if (status.includes("Rejected")) return 3;
        return 4;
      };
      
      return getStatusPriority(a.status) - getStatusPriority(b.status);
    });

    setRequests(sortedUpdated);
    setFiltered(sortedUpdated);
    updateLocalStorage(sortedUpdated);

    // Show payment modal if approved
    if (newStatus === "Approved") {
      const approvedRequest = sortedUpdated.find(req => req.id === id);
      setSelectedApprovedRequests([approvedRequest]);
      setShowPaymentModal(true);
    }

    if (reason) {
      toast.error(`Request #${id.slice(-6)} rejected`);
    } else {
      toast.success(`Request #${id.slice(-6)} approved`);
    }
  };

  const handleBulkApprove = (ids) => {
    const now = new Date();
    const updated = requests.map(req => {
      if (!ids.includes(req.id)) return req;

      const historyEntry = {
        action: "Approved by Account Executive",
        by: currentUser.username,
        at: now.toISOString(),
        comments: "Bulk approved"
      };

      return {
        ...req,
        status: "Approved",
        currentApprover: null,
        history: [...req.history, historyEntry],
        rejectionReason: null,
        approvedAt: now.toISOString()
      };
    });

    // Re-sort after bulk approval
    const sortedUpdated = updated.sort((a, b) => {
      const getStatusPriority = (status) => {
        if (status === "Pending Account Executive Approval") return 1;
        if (status === "Approved") return 2;
        if (status.includes("Rejected")) return 3;
        return 4;
      };
      
      return getStatusPriority(a.status) - getStatusPriority(b.status);
    });

    setRequests(sortedUpdated);
    setFiltered(sortedUpdated);
    updateLocalStorage(sortedUpdated);
    
    // Show payment modal with multiple requests
    const approvedRequests = sortedUpdated.filter(req => ids.includes(req.id));
    setSelectedApprovedRequests(approvedRequests);
    setShowPaymentModal(true);
    
    toast.success(`${ids.length} request(s) approved`);
  };

  const downloadBankFile = () => {
    const approvedRequests = requests.filter(
      req => req.status === "Approved"
    );

    if (approvedRequests.length === 0) {
      toast.error("No approved requests to download");
      return;
    }

    // Prepare Excel data with only required columns
    const excelData = approvedRequests.map(req => ({
      "TYPE": "NEFT",
      "DEBIT BANK A/C NO": req.debitAccountNo || "123456789",
      "DEBIT AMT": req.amount,
      "CUR": "INR",
      "BENIFICARY A/C NO": req.accountNo,
      "IFSC CODE": req.ifscCode,
      "NARRTION/NAME (20 chars)": req.name.substring(0, 20)
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Bank Payments");

    // Generate file and download
    const fileName = `Bank_Payments_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    // Remove downloaded requests from state and localStorage
    const remainingRequests = requests.filter(req => req.status !== "Approved");
    setRequests(remainingRequests);
    setFiltered(remainingRequests);
    
    // Update localStorage
    localStorage.setItem("relieverRequests", JSON.stringify(remainingRequests));
    
    toast.success(`${approvedRequests.length} payment(s) downloaded and removed`);
  };

  const handleFilter = (filters) => {
    let temp = [...requests];
    if (filters.name?.trim()) {
      temp = temp.filter(req =>
        req.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    // Maintain sorting after filtering
    temp.sort((a, b) => {
      const getStatusPriority = (status) => {
        if (status === "Pending Account Executive Approval") return 1;
        if (status === "Approved") return 2;
        if (status.includes("Rejected")) return 3;
        return 4;
      };
      
      return getStatusPriority(a.status) - getStatusPriority(b.status);
    });
    
    setFiltered(temp);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedApprovedRequests([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">
          Account Executive - Payment Approvals
        </h1>
        <button
          onClick={downloadBankFile}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download Approved Payments
        </button>
      </div>

      <FilterBar onFilter={handleFilter} />
      <AEApprovalTable
        requests={filtered}
        onStatusChange={handleStatusChange}
        onBulkApprove={handleBulkApprove}
        showActions={true}
      />

      {/* Payment Entry Modal */}
      <RelieverPaymentEntryModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        approvedRequests={selectedApprovedRequests}
      />
    </div>
  );
}