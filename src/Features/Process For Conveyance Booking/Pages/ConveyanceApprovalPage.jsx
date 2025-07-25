/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConveyanceFilter from "../Components/ConveyanceFilter";
import ManagerConveyanceTable from "../Components/ManagerConveyanceTable";
import DocumentPreviewModal from "../Components/DocumentPreviewModal";
import RejectionModal from "../Components/RejectionModal";
import { useNavigate } from "react-router-dom";

const dummyClaims = [
  {
    id: 101,
    employee: "Ravi Kumar",
    date: "2025-06-24",
    purpose: "Client audit",
    site: "Delhi Zone",
    client: "ABC Ltd",
    transport: "Cab",
    distance: 14,
    amount: 280,
    status: "Pending",
    receiptUrl: "https://example.com/receipt1.pdf"
  },
  {
    id: 102,
    employee: "Neha Verma",
    date: "2025-06-23",
    purpose: "Site visit",
    site: "Mumbai Central",
    client: "XYZ Pvt Ltd",
    transport: "Auto",
    distance: 6,
    amount: 60,
    status: "Pending",
    receiptUrl: "https://example.com/receipt2.pdf"
  },
  {
    id: 103,
    employee: "Ravi Kumar",
    date: "2025-06-24",
    purpose: "Client audit",
    site: "Delhi Zone",
    client: "ABC Ltd",
    transport: "Cab",
    distance: 14,
    amount: 280,
    status: "Pending",
    receiptUrl: "https://example.com/receipt1.pdf"
  },
  {
    id: 104,
    employee: "Neha Verma",
    date: "2025-06-23",
    purpose: "Site visit",
    site: "Mumbai Central",
    client: "XYZ Pvt Ltd",
    transport: "Auto",
    distance: 6,
    amount: 60,
    status: "Pending",
    receiptUrl: "https://example.com/receipt2.pdf"
  },
  {
    id: 105,
    employee: "Ravi Kumar",
    date: "2025-06-24",
    purpose: "Client audit",
    site: "Delhi Zone",
    client: "ABC Ltd",
    transport: "Cab",
    distance: 14,
    amount: 280,
    status: "Pending",
    receiptUrl: "https://example.com/receipt1.pdf"
  },
  {
    id: 106,
    employee: "Neha Verma",
    date: "2025-06-23",
    purpose: "Site visit",
    site: "Mumbai Central",
    client: "XYZ Pvt Ltd",
    transport: "Auto",
    distance: 6,
    amount: 60,
    status: "Pending",
    receiptUrl: "https://example.com/receipt2.pdf"
  },
  {
    id: 107,
    employee: "Ravi Kumar",
    date: "2025-06-24",
    purpose: "Client audit",
    site: "Delhi Zone",
    client: "ABC Ltd",
    transport: "Cab",
    distance: 14,
    amount: 280,
    status: "Pending",
    receiptUrl: "https://example.com/receipt1.pdf"
  },
  {
    id: 108,
    employee: "Neha Verma",
    date: "2025-06-23",
    purpose: "Site visit",
    site: "Mumbai Central",
    client: "XYZ Pvt Ltd",
    transport: "Auto",
    distance: 6,
    amount: 60,
    status: "Pending",
    receiptUrl: "https://example.com/receipt2.pdf"
  },
];

export default function ManagerConveyanceApprovalsPage() {
  const [claims, setClaims] = useState(dummyClaims);
  const [filter, setFilter] = useState({ date: "", status: "", client: "" });
  const [rejection, setRejection] = useState({ show: false, claimId: null });
  const [viewDocUrl, setViewDocUrl] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const navigate=useNavigate()

  const itemsPerPage = 5;

  const filtered = claims.filter((c) => {
    return (
      (filter.client === "" || c.client.toLowerCase().includes(filter.client.toLowerCase())) &&
      (filter.status === "" || c.status === filter.status) &&
      (filter.date === "" || c.date === filter.date)
    );
  });

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleApprove = (id) => {
    try {
      setClaims((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Approved" } : c))
      );
      toast.success("Request Approved");
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const handleReject = (id, reason) => {
  try {
    setClaims(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: "Rejected", rejectionReason: reason } : c
      )
    );
    toast.info("Request Rejected");
  } catch {
    toast.error("Rejection failed");
  }
};


  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-green-600">
                Pending Conveyance Approvals
            </h2>
        </div>



      <ConveyanceFilter filter={filter} setFilter={setFilter} />

      <ManagerConveyanceTable
        claims={paginated}
        onApprove={handleApprove}
        onReject={(id) => setRejection({ show: true, claimId: id })}
        onViewReceipt={(url) => setViewDocUrl(url)}
      />

      <div className="mt-4 flex justify-center gap-2">
        {[...Array(totalPages).keys()].map((i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {rejection.show && (
        <RejectionModal
          onClose={() => setRejection({ show: false, claimId: null })}
          onSubmit={(reason) => {
            handleReject(rejection.claimId, reason);
            setRejection({ show: false, claimId: null });
          }}
        />
      )}

      {viewDocUrl && (
        <DocumentPreviewModal url={viewDocUrl} onClose={() => setViewDocUrl(null)} />
      )}
    </div>
  );
}
