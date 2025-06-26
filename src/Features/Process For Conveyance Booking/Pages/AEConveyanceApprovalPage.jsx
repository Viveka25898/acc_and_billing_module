/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import ConveyanceFilter from "../Components/ConveyanceFilter";
import Table from "../Components/Table";
import RejectReasonModal from "../Components/RejectionReasonModal";
import RejectionModal from "../Components/RejectionModal";
import DocumentPreviewModal from "../Components/DocumentPreviewModal";
import ConveyanceVoucherPreviewModal from "../Components/ConveyanceVoucherPreviewModal";

const dummyClaims = [
  {
    id: 1,
    employee: "Amit Sharma",
    date: "2025-06-20",
    purpose: "Client Visit",
    client: "ABC Corp",
    amount: 240,
    document: "/docs/visit1.pdf",
    status: "Pending"
  },
  {
    id: 2,
    employee: "Rina Patel",
    date: "2025-06-19",
    purpose: "Meeting",
    client: "XYZ Ltd",
    amount: 180,
    document: "/docs/visit2.pdf",
    status: "Pending"
  }
];

export default function AEConveyanceApprovalPage() {
  const [claims, setClaims] = useState(dummyClaims);
  const [filter, setFilter] = useState({ status: "", client: "", date: "" });
  const [rejectState, setRejectState] = useState({ show: false, claimId: null });
  const [viewDocUrl, setViewDocUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showVoucher, setShowVoucher] = useState(false);
const [selectedVoucher, setSelectedVoucher] = useState(null);
const [generatedVoucherIds, setGeneratedVoucherIds] = useState([]);

  const itemsPerPage = 5;

  const filteredClaims = claims.filter((c) => {
    return (
      (filter.status === "" || c.status === filter.status) &&
      (filter.client === "" || c.client.toLowerCase().includes(filter.client.toLowerCase())) &&
      (filter.date === "" || c.date === filter.date)
    );
  });

  const paginatedClaims = filteredClaims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);

  const handleApprove = (id) => {
    try {
      setClaims((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Approved" } : c))
      );
      toast.success("Request Approved");
    } catch {
      toast.error("Approval Failed");
    }
  };

  const handleReject = (id, reason) => {
    try {
      setClaims((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "Rejected", rejectionReason: reason } : c
        )
      );
      toast.info("Request Rejected");
    } catch {
      toast.error("Rejection Failed");
    }
  };

  const columns = [
    { label: "Employee", key: "employee" },
    { label: "Client", key: "client" },
    { label: "Date", key: "date" },
    { label: "Purpose", key: "purpose" },
    { label: "Amount", key: "amount" },
    {
      label: "Docs",
      render: (row) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setViewDocUrl(row.document)}
        >
          <FaEye />
        </button>
      )
    },
    {
      label: "Actions",
      render: (row) => {
        if (row.status === "Approved") {
                    const isGenerated = generatedVoucherIds.includes(row.id);
                    return (
                        <button
                        disabled={isGenerated}
                        className={`text-sm px-2 py-1 rounded ${
                            isGenerated
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-green-700 text-white hover:bg-green-800"
                        }`}
                        onClick={() => !isGenerated && handleFinalApproval(row)}
                        >
                        {isGenerated ? "Voucher Created" : "Generate Voucher"}
                        </button>
                    );
                    }

        if (row.status === "Rejected") return <span className="text-red-600">Rejected</span>;
        return (
          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-2 py-1 rounded text-sm"
              onClick={() => handleApprove(row.id)}
            >
              Approve
            </button>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
              onClick={() => setRejectState({ show: true, claimId: row.id })}
            >
              Reject
            </button>
          </div>
        );
      }
    }
  ];

  const handleFinalApproval = (claim) => {
  const voucher = {
    voucherNo: "EV-2025-0002", // Simulate unique voucher
    employee: claim.employee,
    purpose: claim.purpose,
    amount: claim.amount,
    approvedBy: "Billing Manager",
  };

  setSelectedVoucher(voucher);
  setShowVoucher(true);
  setGeneratedVoucherIds((prev) => [...prev, claim.id]); // Mark as generated
  toast.success("Voucher Generated");
};


  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold text-green-700">Accounts - Conveyance Approvals</h2>
      </div>

      <ConveyanceFilter filter={filter} setFilter={setFilter} />
      <Table columns={columns} data={paginatedClaims} />

      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPages).keys()].map((i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-green-600 text-white" : "bg-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {rejectState.show && (
        <RejectionModal
          onClose={() => setRejectState({ show: false, claimId: null })}
          onSubmit={(reason) => {
            handleReject(rejectState.claimId, reason);
            setRejectState({ show: false, claimId: null });
          }}
        />
      )}

      {viewDocUrl && (
        <DocumentPreviewModal url={viewDocUrl} onClose={() => setViewDocUrl(null)} />
      )}

      {showVoucher && (
    <ConveyanceVoucherPreviewModal
        voucher={selectedVoucher}
        onClose={() => setShowVoucher(false)}
    />
)}

    </div>
  );
}
