// File: src/features/vendor/pages/MyInvoicesPage.jsx

import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import InvoiceRejectionModal from "../../Components/InvoiceRejectionModal";

const dummyInvoices = [
  {
    id: 1,
    invoiceNo: "INV-001",
    vendorName: "ABC Suppliers",
    uploadedDate: "2025-06-28",
    poNumbers: ["PO001", "PO002"],
    totalAmount: 18000,
    status: "Pending",
    financialHead: "Mr. Verma",
    fromDate: "2025-06-01",
    toDate: "2025-06-10",
    phApproval: "Rejected",
    aeApproval: "Approved",
    fhApproval: "Approved",
    rejectionReason: "Incorrect PO linkage."
  },
  {
    id: 2,
    invoiceNo: "INV-002",
    vendorName: "XYZ Pvt Ltd",
    uploadedDate: "2025-06-20",
    poNumbers: ["PO003"],
    totalAmount: 12500,
    status: "Approved",
    financialHead: "Ms. Sharma",
    fromDate: "2025-06-05",
    toDate: "2025-06-15",
    phApproval: "Approved",
    aeApproval: "Approved",
    fhApproval: "Approved",
    rejectionReason: ""
  },
  {
    id: 3,
    invoiceNo: "INV-003",
    vendorName: "MNO Enterprises",
    uploadedDate: "2025-06-18",
    poNumbers: ["PO004", "PO005"],
    totalAmount: 22000,
    status: "Rejected",
    financialHead: "Mr. Iyer",
    fromDate: "2025-06-01",
    toDate: "2025-06-12",
    phApproval: "Rejected",
    aeApproval: "Rejected",
    fhApproval: "Rejected",
    rejectionReason: "Duplicate entries found."
  },
  {
    id: 4,
    invoiceNo: "INV-004",
    vendorName: "SupplyTech",
    uploadedDate: "2025-06-25",
    poNumbers: ["PO006"],
    totalAmount: 9800,
    status: "Pending",
    financialHead: "Mr. Rao",
    fromDate: "2025-06-10",
    toDate: "2025-06-20",
    phApproval: "Approved",
    aeApproval: "Pending",
    fhApproval: "Pending",
    rejectionReason: ""
  },
  {
    id: 5,
    invoiceNo: "INV-005",
    vendorName: "CleanPro Ltd",
    uploadedDate: "2025-06-15",
    poNumbers: ["PO007"],
    totalAmount: 14500,
    status: "Approved",
    financialHead: "Ms. Kaur",
    fromDate: "2025-06-01",
    toDate: "2025-06-08",
    phApproval: "Approved",
    aeApproval: "Approved",
    fhApproval: "Approved",
    rejectionReason: ""
  },
  {
    id: 6,
    invoiceNo: "INV-006",
    vendorName: "Alpha Supply Co",
    uploadedDate: "2025-06-12",
    poNumbers: ["PO008", "PO009"],
    totalAmount: 17400,
    status: "Pending",
    financialHead: "Mr. Mehta",
    fromDate: "2025-06-01",
    toDate: "2025-06-11",
    phApproval: "Pending",
    aeApproval: "Pending",
    fhApproval: "Pending",
    rejectionReason: ""
  },
  {
    id: 7,
    invoiceNo: "INV-007",
    vendorName: "Quick Supplies",
    uploadedDate: "2025-06-10",
    poNumbers: ["PO010"],
    totalAmount: 11000,
    status: "Rejected",
    financialHead: "Mr. Khan",
    fromDate: "2025-06-01",
    toDate: "2025-06-07",
    phApproval: "Approved",
    aeApproval: "Rejected",
    fhApproval: "Pending",
    rejectionReason: "Mismatch in invoice total."
  },
  {
    id: 8,
    invoiceNo: "INV-008",
    vendorName: "BlueTech",
    uploadedDate: "2025-06-08",
    poNumbers: ["PO011", "PO012"],
    totalAmount: 19300,
    status: "Approved",
    financialHead: "Mr. Verma",
    fromDate: "2025-06-02",
    toDate: "2025-06-10",
    phApproval: "Approved",
    aeApproval: "Approved",
    fhApproval: "Approved",
    rejectionReason: ""
  },
  {
    id: 9,
    invoiceNo: "INV-009",
    vendorName: "BrightWorks",
    uploadedDate: "2025-06-06",
    poNumbers: ["PO013"],
    totalAmount: 8700,
    status: "Pending",
    financialHead: "Ms. Singh",
    fromDate: "2025-06-01",
    toDate: "2025-06-05",
    phApproval: "Pending",
    aeApproval: "Pending",
    fhApproval: "Pending",
    rejectionReason: ""
  },
  {
    id: 10,
    invoiceNo: "INV-010",
    vendorName: "Global Supplies",
    uploadedDate: "2025-06-01",
    poNumbers: ["PO014"],
    totalAmount: 15800,
    status: "Rejected",
    financialHead: "Mr. Reddy",
    fromDate: "2025-05-25",
    toDate: "2025-05-31",
    phApproval: "Rejected",
    aeApproval: "Approved",
    fhApproval: "Rejected",
    rejectionReason: "Late invoice submission."
  }
];

export default function MyInvoicesPage() {
  const [filter, setFilter] = useState({ po: "", invoice: "", status: "" });
  const [selectedReason, setSelectedReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
    setCurrentPage(1);
  };

  const filteredInvoices = dummyInvoices.filter((inv) => {
    return (
      inv.poNumbers.some((po) => po.includes(filter.po)) &&
      inv.invoiceNo.includes(filter.invoice) &&
      inv.status.toLowerCase().includes(filter.status.toLowerCase())
    );
  });

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-green-600 mb-4">My Invoices</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" name="po" value={filter.po} onChange={handleFilterChange} placeholder="Filter by PO No." className="border px-3 py-2 rounded" />
        <input type="text" name="invoice" value={filter.invoice} onChange={handleFilterChange} placeholder="Filter by Invoice No." className="border px-3 py-2 rounded" />
        <input type="text" name="status" value={filter.status} onChange={handleFilterChange} placeholder="Filter by Status" className="border px-3 py-2 rounded" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Invoice No.</th>
              <th className="border px-2 py-1">Vendor</th>
              <th className="border px-2 py-1">Uploaded</th>
              <th className="border px-2 py-1">POs</th>
              <th className="border px-2 py-1">From - To</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">PH Approval</th>
              <th className="border px-2 py-1">AE Approval</th>
              <th className="border px-2 py-1">FH Approval</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map((inv, idx) => (
              <tr key={inv.id} className="text-center">
                <td className="border px-2 py-1">{indexOfFirstInvoice + idx + 1}</td>
                <td className="border px-2 py-1">{inv.invoiceNo}</td>
                <td className="border px-2 py-1">{inv.vendorName}</td>
                <td className="border px-2 py-1">{inv.uploadedDate}</td>
                <td className="border px-2 py-1">{inv.poNumbers.join(", ")}</td>
                <td className="border px-2 py-1">{inv.fromDate} → {inv.toDate}</td>
                <td className="border px-2 py-1 text-right">₹{inv.totalAmount.toFixed(2)}</td>
                <td className="border px-2 py-1">{inv.status}</td>
                {["phApproval", "aeApproval", "fhApproval"].map((field) => (
                  <td key={field} className="border px-2 py-1">
                    <div className="flex justify-center items-center gap-1">
                      {inv[field]}
                      {inv[field] === "Rejected" && (
                        <FaEye className="text-blue-500 cursor-pointer" onClick={() => {
                          setSelectedReason(inv.rejectionReason);
                          setShowModal(true);
                        }} />
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <div className="flex gap-1">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded bg-gray-100">Prev</button>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded bg-gray-100">Next</button>
        </div>
      </div>

      <InvoiceRejectionModal isOpen={showModal} onClose={() => setShowModal(false)} reason={selectedReason} />
    </div>
  );
}
