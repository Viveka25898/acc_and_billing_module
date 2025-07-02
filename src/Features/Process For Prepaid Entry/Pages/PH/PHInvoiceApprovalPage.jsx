// File: src/features/ph/pages/PHApprovalPage.jsx

import React, { useState } from "react";
import { toast } from "react-toastify";
import PHInvoiceFilter from "../../Components/PHInvoiceFilter";
import Table from "../../Components/Table";
import PeriodSelectionModal from "../../Components/PeriodSelectionModal";

const dummyInvoices = [
  {
    id: 1,
    invoiceNo: "INV-001",
    vendorName: "Vendor A",
    uploadedDate: "2025-06-25",
    poNumbers: ["PO001", "PO002"],
    totalAmount: 15000,
    status: "Pending",
    invoiceUrl: "/files/inv001.pdf",
    dcUrl: "/files/dc001.pdf",
    aeStatus:"Pending",
    financialHeadStatus:"Pending"
  },
  {
    id: 2,
    invoiceNo: "INV-002",
    vendorName: "Vendor B",
    uploadedDate: "2025-06-24",
    poNumbers: ["PO003"],
    totalAmount: 18000,
    status: "Pending",
    invoiceUrl: "/files/inv002.pdf",
    dcUrl: "/files/dc002.pdf",
    aeStatus:"Pending",
    financialHeadStatus:"Pending"
  },
];

export default function PHInvoiceApprovalPage() {
  const [filter, setFilter] = useState({ po: "", invoice: "", status: "" });
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
const [selectedApproveId, setSelectedApproveId] = useState(null);
  const invoicesPerPage = 5;

  const handleAccept = (id) => {
  setSelectedApproveId(id);
  setShowPeriodModal(true);
};

const handlePeriodSubmit = ({ fromMonth, toMonth }) => {
  toast.success("Invoice approved with period selected.");
  setInvoices((prev) =>
    prev.map((inv) =>
      inv.id === selectedApproveId
        ? { ...inv, status: "Accepted", approvedPeriod: { fromMonth, toMonth } }
        : inv
    )
  );
};

  

  const handleReject = (id, reason) => {
    toast.error("Invoice rejected.");
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "Rejected", rejectionReason: reason } : inv
      )
    );
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.poNumbers.some((po) => po.includes(filter.po)) &&
      inv.invoiceNo.toLowerCase().includes(filter.invoice.toLowerCase()) &&
      inv.status.toLowerCase().includes(filter.status.toLowerCase())
  );

  const indexOfLast = currentPage * invoicesPerPage;
  const indexOfFirst = indexOfLast - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const columns = [
    { key: "index", label: "#" },
    { key: "invoiceNo", label: "Invoice No." },
    { key: "vendorName", label: "Vendor" },
    { key: "uploadedDate", label: "Uploaded" },
    { key: "poNumbers", label: "POs Covered" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "status", label: "Status" },
    { key: "invoice", label: "Invoice View" },
    { key: "dc", label: "DC View" },
    { key: "action", label: "Action" },
    { key: "aeStatus", label: "AE Status" },
    { key: "financialHeadStatus", label: "Financial Head Status" },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-green-600 mb-4">PH Final Invoice Approval</h2>
      <PHInvoiceFilter filter={filter} setFilter={setFilter} />
      <Table columns={columns} data={currentInvoices.map((inv, idx) => ({ ...inv, index: indexOfFirst + idx + 1 }))} onAccept={handleAccept} onReject={handleReject} />

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-gray-100"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
      <PeriodSelectionModal
        isOpen={showPeriodModal}
        onClose={() => setShowPeriodModal(false)}
        onSubmit={handlePeriodSubmit}
      />
    </div>
  );
}
