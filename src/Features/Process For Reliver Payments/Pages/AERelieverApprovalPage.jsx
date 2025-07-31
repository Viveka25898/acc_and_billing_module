// File: src/features/relieverPayments/pages/AccountsExecutivePage.jsx

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import relieverDummyData from "../data/relieverDummyData";
import FilterBar from "../Components/Filter";
import ReusableRelieverTable from "../Components/ReusableRelieverTable";
import AEApprovalTable from "../Components/AEApprovalTable";

export default function AERelieverApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ name: "", status: "" });
console.log(relieverDummyData);
  useEffect(() => {
    const pendingForAE = relieverDummyData.filter(
      (req) => req.status === "Pending Accounts Approval"
    );
    setRequests(pendingForAE);
    setFiltered(pendingForAE);
  }, []);
  console.log(requests);
  console.log("Requests",requests);

  const handleFilter = (filters) => {
    setFilters(filters);
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
  console.log(filtered);

  const handleStatusChange = (id, newStatus, reason = null) => {
    const updatedRequests = requests.map((req) =>
      req.id === id
        ? { ...req, status: newStatus, rejectionReason: reason || null }
        : req
    );

    setRequests(updatedRequests);

    let temp = [...updatedRequests];
    if (filters.name.trim()) {
      temp = temp.filter((req) =>
        req.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.status) {
      temp = temp.filter((req) => req.status === filters.status);
    }
    setFiltered(temp);

    if (newStatus.includes("Rejected")) {
      toast.error(`Request rejected: ${reason}`);
    } else {
      toast.success("Request approved successfully!");
    }
  };

  const handleReject = (id, reason) => {
    handleStatusChange(id, "Rejected by AE", reason);
  };
  
  //Bulk Approval

  const handleBulkApprove = (ids) => {
  const updated = filtered.map((req) =>
    ids.includes(req.id)
      ? { ...req, status: "Approved & Payment Done", rejectionReason: null }
      : req
  );
  setFiltered(updated);
  setRequests(updated);
  toast.success(`${ids.length} request(s) approved successfully!`);
};

// Bank Download File
  const downloadBankFile = () => {
  const approved = requests.filter(
    (req) => req.status === "Approved & Payment Done"
  );

  if (approved.length === 0) {
    toast.error("No approved payments to download!");
    return;
  }

  // Headers as per bank upload format
  const csvRows = [
    [
      "TYPE",
      "DEBIT BANK A/C NO",
      "DEBIT AMT",
      "CUR",
      "BENIFICARY A/C NO",
      "IFSC CODE",
      "NARRTION/NAME (20 chars)",
    ],
  ];

  approved.forEach((req) => {
    const debitAccountNo = "1234567890"; // Replace with actual debit account no if needed
    const beneficiaryAccountNo = req.benificiaryAcNo || req.accountNo || "";

    csvRows.push([
      "NEFT",
      `="${debitAccountNo}"`,
      req.amount || "",
      "INR",
      `="${beneficiaryAccountNo}"`,
      req.ifscCode || "",
      req.name ? req.name.substring(0, 20) : "",
    ]);
  });

  // Convert to CSV
  const csvContent = csvRows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `Bank_Upload_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">
          Accounts Executive - Payment Approvals
        </h1>
        <div className="space-x-2">
          <button
            onClick={downloadBankFile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download Bank File
          </button>
        </div>
      </div>

      <FilterBar onFilter={handleFilter} />
      <AEApprovalTable
        requests={filtered}
        onStatusChange={handleStatusChange}
        onReject={handleReject}
         onBulkApprove={handleBulkApprove} 
        showActions={true}
        role="ae"
      />
    </div>
  );
}
