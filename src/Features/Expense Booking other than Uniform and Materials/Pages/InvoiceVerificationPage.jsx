import React, { useState } from "react";
import InvoiceFilters from "../Components/InvoiceFilter";
import InvoiceTable from "../Components/InvoiceTable";
import ViewInvoiceModal from "../Components/ViewInvoiceModal";
import RejectInvoiceModal from "../Components/RejectInvoiceModal";

const dummyInvoices = [
  {
    id: 1,
    invoiceNo: "INV-001",
    vendorName: "ABC Pvt Ltd",
    poNo: "PO-2025-001",
    gstin: "29AAACX1111Q1ZP",
    amount: 50000,
    status: "pending",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    financialHeadStatus:"pending"
  },
  {
    id: 2,
    invoiceNo: "INV-001",
    vendorName: "ABC Pvt Ltd",
    poNo: "PO-2025-001",
    gstin: "29AAACX1111Q1ZP",
    amount: 50000,
    status: "pending",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    financialHeadStatus:"pending"
  },
  {
    id: 3,
    invoiceNo: "INV-001",
    vendorName: "ABC Pvt Ltd",
    poNo: "PO-2025-001",
    gstin: "29AAACX1111Q1ZP",
    amount: 50000,
    status: "pending",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    financialHeadStatus:"pending"
  },
  {
    id: 4,
    invoiceNo: "INV-001",
    vendorName: "ABC Pvt Ltd",
    poNo: "PO-2025-001",
    gstin: "29AAACX1111Q1ZP",
    amount: 50000,
    status: "pending",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    financialHeadStatus:"pending"
  },
  {
    id: 5,
    invoiceNo: "INV-001",
    vendorName: "ABC Pvt Ltd",
    poNo: "PO-2025-001",
    gstin: "29AAACX1111Q1ZP",
    amount: 50000,
    status: "pending",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    financialHeadStatus:"pending"
  },
  {
    id: 6,
    invoiceNo: "INV-001",
    vendorName: "ABC Pvt Ltd",
    poNo: "PO-2025-001",
    gstin: "29AAACX1111Q1ZP",
    amount: 50000,
    status: "pending",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    financialHeadStatus:"pending"
  },
  {
    id: 7,
    invoiceNo: "INV-001",
    vendorName: "ABC Pvt Ltd",
    poNo: "PO-2025-001",
    gstin: "29AAACX1111Q1ZP",
    amount: 50000,
    status: "pending",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    financialHeadStatus:"pending"
  },
  {
    id: 8,
    invoiceNo: "INV-001",
    vendorName: "ABC Pvt Ltd",
    poNo: "PO-2025-001",
    gstin: "29AAACX1111Q1ZP",
    amount: 50000,
    status: "pending",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    financialHeadStatus:"pending"
  }
];

export default function InvoiceVerificationPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [invoices, setInvoices] = useState(dummyInvoices);

  // ✅ Updated modal states
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);
  const [selectedInvoiceForReject, setSelectedInvoiceForReject] = useState(null);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Accept handler
  const handleApprove = (invoiceId) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "approved" } : inv
      )
    );
  };

  // ✅ Reject handler
  const handleReject = (invoiceId, remarks) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: "rejected", rejectionRemarks: remarks }
          : inv
      )
    );
    setSelectedInvoiceForReject(null); // Close reject modal
  };

  // ✅ Filter logic
  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNo.includes(search) ||
      inv.poNo.includes(search) ||
      inv.vendorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchDate = dateFilter ? inv.invoiceDate === dateFilter : true;
    return matchSearch && matchStatus && matchDate;
  });

   // ✅ Apply pagination after filtering
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedInvoices = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 bg-white shadow-md rounded md">
      <h1 className="text-2xl font-bold text-green-600">Invoice Verification</h1>
      <InvoiceFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
      <InvoiceTable
        invoices={paginatedInvoices}
        onView={(inv) => setSelectedInvoiceForView(inv)}
        onReject={(inv) => setSelectedInvoiceForReject(inv)}
        onApprove={handleApprove}
      />

      {/* ✅ Pagination Controls */}
      <div className="flex justify-center gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded border ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/*  View Modal */}
      {selectedInvoiceForView && (
        <ViewInvoiceModal
          invoice={selectedInvoiceForView}
          onClose={() => setSelectedInvoiceForView(null)}
        />
      )}

      {/*  Reject Modal */}
      {selectedInvoiceForReject && (
        <RejectInvoiceModal
          invoice={selectedInvoiceForReject}
          onClose={() => setSelectedInvoiceForReject(null)}
          onConfirm={handleReject}
        />
      )}
    </div>
  );
}
