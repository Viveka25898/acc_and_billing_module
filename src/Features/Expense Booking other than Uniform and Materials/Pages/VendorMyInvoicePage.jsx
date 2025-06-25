// File: src/features/vendor/pages/VendorMyInvoicesPage.jsx

import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import POSearchFilter from "../Components/POSearchFilter";


const dummyInvoices = [
  {
    id: 1,
    poNumber: "PO-2025-001",
    invoiceNumber: "INV-001",
    invoiceDate: "2025-06-01",
    amount: 25000,
    managerApproval: "approved",
    financeApproval: "approved",
    rejectionReason: "",
  },
  {
    id: 2,
    poNumber: "PO-2025-002",
    invoiceNumber: "INV-002",
    invoiceDate: "2025-06-02",
    amount: 18000,
    managerApproval: "rejected",
    financeApproval: "pending",
    rejectionReason: "Invoice amount mismatch.",
  },
  {
    id: 3,
    poNumber: "PO-2025-007",
    invoiceNumber: "INV-003",
    invoiceDate: "2025-06-03",
    amount: 56000,
    managerApproval: "approved",
    financeApproval: "rejected",
    rejectionReason: "GSTIN not valid.",
  },
  // Add more dummy invoices for pagination
  ...Array.from({ length: 17 }, (_, i) => ({
    id: i + 4,
    poNumber: `PO-2025-${100 + i}`,
    invoiceNumber: `INV-${100 + i}`,
    invoiceDate: `2025-06-${(i % 30) + 1}`,
    amount: 10000 + i * 500,
    managerApproval: i % 3 === 0 ? "rejected" : "approved",
    financeApproval: i % 4 === 0 ? "rejected" : "approved",
    rejectionReason: i % 3 === 0 ? "Sample rejection reason." : "",
  })),
];

export default function VendorMyInvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectionText, setRejectionText] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = dummyInvoices.filter((inv) => {
    const matchSearch = inv.poNumber.includes(search) || inv.invoiceNumber.includes(search);
    const matchStatus =
      statusFilter === "all" ||
      inv.managerApproval === statusFilter ||
      inv.financeApproval === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedInvoices = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4 bg-white shadow-md rounded-md">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4 text-green-600">My Invoices</h2>
      </div>

      <POSearchFilter
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">PO Number</th>
              <th className="p-2 border">Invoice No</th>
              <th className="p-2 border">Invoice Date</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Manager Approval</th>
              <th className="p-2 border">Finance Approval</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.map((inv) => (
              <tr key={inv.id} className="text-center">
                <td className="p-2 border">{inv.poNumber}</td>
                <td className="p-2 border">{inv.invoiceNumber}</td>
                <td className="p-2 border">{inv.invoiceDate}</td>
                <td className="p-2 border">₹{inv.amount}</td>
                <td className="p-2 border">
                  {inv.managerApproval === "rejected" ? (
                    <span className="text-red-600 flex gap-1 items-center justify-center">
                      Rejected <FaEye onClick={() => setRejectionText(inv.rejectionReason)} className="cursor-pointer" />
                    </span>
                  ) : (
                    <span className="capitalize">{inv.managerApproval}</span>
                  )}
                </td>
                <td className="p-2 border">
                  {inv.financeApproval === "rejected" ? (
                    <span className="text-red-600 flex gap-1 items-center justify-center">
                      Rejected <FaEye onClick={() => setRejectionText(inv.rejectionReason)} className="cursor-pointer" />
                    </span>
                  ) : (
                    <span className="capitalize">{inv.financeApproval}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded border ${
              page === currentPage
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 hover:bg-green-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Rejection Reason Modal */}
      {rejectionText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Rejection Reason</h3>
            <p className="text-sm text-gray-700">{rejectionText}</p>
            <div className="text-right mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setRejectionText(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}