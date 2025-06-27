// File: src/features/prepaidEntry/pages/ph/PHRequestApprovalPage.jsx
import React, { useState } from "react";
import dummyRequests from "../../data/dummyRequests";
import FilterComponent from "../../Components/FilterComponent";
import RequestTable from "../../Components/RequestsTable";
import RejectionModal from "../../Components/RejectionModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PHRequestApprovalPage() {
    const navigate=useNavigate()

    const columns = [
    { label: "ID", accessor: "id" },
    { label: "Site", accessor: "site" },
    { label: "Uniform Type", accessor: "uniformType" },
    { label: "Quantity", accessor: "quantity" },
    { label: "Cost", accessor: "cost" },
    { label: "Status", accessor: "status" },
    { label: "Action", accessor: "action" },
  ];
  const [requests, setRequests] = useState(dummyRequests);
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Approved" } : req
      )
    );
    toast.success("Request Approved Successfully!")
  };

  const handleGeneratePO = (id) => {
  const selectedRequest = requests.find((req) => req.id === id);

  // Mark as PO generated
  setRequests((prev) =>
    prev.map((req) =>
      req.id === id ? { ...req, poGenerated: true } : req
    )
  );

  // Navigate with data
  navigate("/dashboard/ph/procurement-po-form", {
    state: { requestData: selectedRequest },
  });
};


  const handleRejectClick = (id) => {
    setSelectedRequestId(id);
    setModalOpen(true);
  };

  const handleRejectSubmit = (reason) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequestId
          ? { ...req, status: "Rejected", rejectionReason: reason }
          : req
      )
    );
    setModalOpen(false);
    setSelectedRequestId(null);
    toast.error("Request Rejected Successfully!")
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSite = r.site.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSite && matchesStatus;
  });

  return (
    <div className="p-4 max-w-screen-xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">PH Request Approval</h1>
      <FilterComponent
        filterText={filterText}
        setFilterText={setFilterText}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <RequestTable
        rows={filteredRequests}
        columns={columns}
        onApprove={handleApprove}
        onReject={handleRejectClick}
        onGeneratePO={handleGeneratePO}
      />
      <RejectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </div>
  );
}