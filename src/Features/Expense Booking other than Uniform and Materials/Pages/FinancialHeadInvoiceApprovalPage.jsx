// File: src/features/finance/pages/FinanceInvoiceApprovalPage.jsx

import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import ViewInvoiceModal from "../Components/ViewInvoiceModal";
import RejectInvoiceModal from "../Components/RejectInvoiceModal";
import VoucherPreviewModal from "../Components/VoucherPreviewModal";


const dummyInvoices = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  invoiceNo: `INV-20${i + 1}`,
  vendorName: `Vendor ${i + 1}`,
  poNo: `PO-20${i + 1}`,
  gstin: `29AAACX1111Q${i}ZP`,
  amount: 10000 + i * 500,
  status: "pending",
  managerApproval: "approved",
  documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
}));

export default function FinancialHeadInvoiceApprovalPage() {
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [rejectInvoice, setRejectInvoice] = useState(null);
  const [voucherPreview, setVoucherPreview] = useState(null);
  const itemsPerPage = 5;

  const handleApprove = (id) => {
  const updatedInvoices = invoices.map((inv) =>
    inv.id === id ? { ...inv, status: "Approved" } : inv
  );
  setInvoices(updatedInvoices);

  // Open Voucher Modal for the approved invoice
  const approvedInvoice = updatedInvoices.find((inv) => inv.id === id);
  setVoucherPreview(approvedInvoice);
};


  const handleReject = (id, reason) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? { ...inv, status: "Rejected", rejectionReason: reason }
          : inv
      )
    );
    setRejectInvoice(null);
  };

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.poNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.vendorName.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusTag = (status) => {
    const base = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case "approved":
        return `${base} bg-green-100 text-green-700`;
      case "rejected":
        return `${base} bg-red-100 text-red-700`;
      case "pending":
      default:
        return `${base} bg-yellow-100 text-yellow-700`;
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-green-600">Financial Head Invoice Approval</h1>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by vendor, invoice or PO number"
          className="border rounded px-4 py-2 w-full md:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/4"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Invoice No</th>
              <th className="border p-2">Vendor</th>
              <th className="border p-2">PO No</th>
              <th className="border p-2">GSTIN</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Manager Status</th>
              <th className="border p-2">Finance Status</th>
              <th className="border p-2">Invoice View</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((inv) => (
              <tr key={inv.id} className="text-center">
                <td className="border p-2">{inv.invoiceNo}</td>
                <td className="border p-2">{inv.vendorName}</td>
                <td className="border p-2">{inv.poNo}</td>
                <td className="border p-2">{inv.gstin}</td>
                <td className="border p-2">₹{inv.amount}</td>
                <td className="border p-2 text-green-700 font-semibold">Approved</td>
                <td className="border p-2">
                  <span className={getStatusTag(inv.status)}>{inv.status}</span>
                </td>
                <td className="border p-2">
                  <FaEye
                    onClick={() => setViewInvoice(inv)}
                    className="text-blue-600 cursor-pointer"
                  />
                </td>
                <td className="border p-2">
                  <button
                    disabled={inv.status !== "pending"}
                    onClick={() => handleApprove(inv.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 mb-1"
                  >
                    Approve
                  </button>
                  <button
                    disabled={inv.status !== "pending"}
                    onClick={() => setRejectInvoice(inv)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 mb-1"
                  >
                    Reject
                  </button>
                 {inv.status === "approved" && (
                            <button
                                onClick={() => setVoucherPreview(inv)}
                                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 mt-1"
                            >
                                Voucher
                            </button>
                            )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modals */}
      {viewInvoice && (
        <ViewInvoiceModal
          invoice={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}

      {rejectInvoice && (
        <RejectInvoiceModal
          invoice={rejectInvoice}
          onClose={() => setRejectInvoice(null)}
          onConfirm={(reason) => handleReject(rejectInvoice.id, reason)}
        />
      )}

      {voucherPreview && (
        <VoucherPreviewModal
            invoice={voucherPreview}
            onClose={() => setVoucherPreview(null)}
        />
)}
    </div>
  );
}
