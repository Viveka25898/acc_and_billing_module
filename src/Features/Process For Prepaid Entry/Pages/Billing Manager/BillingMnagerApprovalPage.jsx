/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import BillingManagerFilter from "../../Components/BillingManagerFilter";
import BillingManagerModal from "../../Components/BillingManagerModal";
import PurchaseVoucherModal from "../../Components/PurchaseVoucherModal";
import JournalVoucherModal from "../../Components/JournalVoucherModal";
import { toast } from "react-toastify";


 const dummyInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-101",
    poNumber: "PO-789",
    vendorName: "Alpha Traders",
    totalAmount: 120000,
    status: "Pending",
    documentUrl: "https://example.com/invoice101.pdf",
    poDocuments: [
      { name: "PO-789", url: "https://example.com/po789.pdf" },
      { name: "PO-790", url: "https://example.com/po790.pdf" }
    ],
    gstRate: 18,
    hsnCode: "998314",
    billingPeriod: "June 2025"
  },
  {
    id: 2,
    invoiceNumber: "INV-102",
    poNumber: "PO-001",
    vendorName: "BuildSmart Pvt Ltd",
    totalAmount: 84000,
    status: "Approved",
    documentUrl: "https://example.com/invoice102.pdf",
    poDocuments: [{ name: "PO-001", url: "https://example.com/po001.pdf" }],
    gstRate: 18,
    hsnCode: "998320",
    billingPeriod: "May 2025"
  },
  {
    id: 3,
    invoiceNumber: "INV-103",
    poNumber: "PO-002",
    vendorName: "NextGen Solutions",
    totalAmount: 58000,
    status: "Rejected",
    documentUrl: "https://example.com/invoice103.pdf",
    poDocuments: [{ name: "PO-002", url: "https://example.com/po002.pdf" }],
    gstRate: 12,
    hsnCode: "847130",
    billingPeriod: "April 2025"
  },
  {
    id: 4,
    invoiceNumber: "INV-104",
    poNumber: "PO-003",
    vendorName: "FastBuild Co.",
    totalAmount: 96000,
    status: "Pending",
    documentUrl: "https://example.com/invoice104.pdf",
    poDocuments: [{ name: "PO-003", url: "https://example.com/po003.pdf" }],
    gstRate: 18,
    hsnCode: "998714",
    billingPeriod: "March 2025"
  },
  {
    id: 5,
    invoiceNumber: "INV-105",
    poNumber: "PO-004",
    vendorName: "Omega Traders",
    totalAmount: 112000,
    status: "Pending",
    documentUrl: "https://example.com/invoice105.pdf",
    poDocuments: [{ name: "PO-004", url: "https://example.com/po004.pdf" }],
    gstRate: 5,
    hsnCode: "998399",
    billingPeriod: "February 2025"
  },
  {
    id: 6,
    invoiceNumber: "INV-106",
    poNumber: "PO-005",
    vendorName: "Sunrise Equipments",
    totalAmount: 132000,
    status: "Approved",
    documentUrl: "https://example.com/invoice106.pdf",
    poDocuments: [{ name: "PO-005", url: "https://example.com/po005.pdf" }],
    gstRate: 18,
    hsnCode: "998101",
    billingPeriod: "January 2025"
  },
  {
    id: 7,
    invoiceNumber: "INV-107",
    poNumber: "PO-006",
    vendorName: "MicroTech India",
    totalAmount: 76000,
    status: "Pending",
    documentUrl: "https://example.com/invoice107.pdf",
    poDocuments: [{ name: "PO-006", url: "https://example.com/po006.pdf" }],
    gstRate: 18,
    hsnCode: "847149",
    billingPeriod: "December 2024"
  },
  {
    id: 8,
    invoiceNumber: "INV-108",
    poNumber: "PO-007",
    vendorName: "Infratech Corp",
    totalAmount: 145000,
    status: "Pending",
    documentUrl: "https://example.com/invoice108.pdf",
    poDocuments: [{ name: "PO-007", url: "https://example.com/po007.pdf" }],
    gstRate: 12,
    hsnCode: "998727",
    billingPeriod: "November 2024"
  },
  {
    id: 9,
    invoiceNumber: "INV-109",
    poNumber: "PO-008",
    vendorName: "Skyline Works",
    totalAmount: 99000,
    status: "Approved",
    documentUrl: "https://example.com/invoice109.pdf",
    poDocuments: [{ name: "PO-008", url: "https://example.com/po008.pdf" }],
    gstRate: 18,
    hsnCode: "998654",
    billingPeriod: "October 2024"
  },
  {
    id: 10,
    invoiceNumber: "INV-110",
    poNumber: "PO-009",
    vendorName: "Vertex Systems",
    totalAmount: 67000,
    status: "Rejected",
    documentUrl: "https://example.com/invoice110.pdf",
    poDocuments: [{ name: "PO-009", url: "https://example.com/po009.pdf" }],
    gstRate: 18,
    hsnCode: "998989",
    billingPeriod: "September 2024"
  }
];

export default function BillingManagerApprovalPage() {
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;



  const filteredInvoices = invoices.filter((inv) => {
    const textMatch =
      inv.invoiceNumber.toLowerCase().includes(filterText.toLowerCase()) ||
      inv.poNumber?.toLowerCase().includes(filterText.toLowerCase());

    const statusMatch =
      !statusFilter || inv.status.toLowerCase() === statusFilter.toLowerCase();

    return textMatch && statusMatch;
  });
//   Pagination 
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);


  const handleApprove = (id) => {
    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, status: "Approved", approved: true } : inv
    );
    setInvoices(updated);
    setIsModalOpen(false);
  };

  const handleReject = (id) => {
    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, status: "Rejected", approved: true } : inv
    );
    setInvoices(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl md:text-2xl font-bold mb-4 text-green-600">Final Invoice Approval</h1>

      <BillingManagerFilter
        filterText={filterText}
        setFilterText={setFilterText}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="overflow-x-auto rounded border mt-4">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Sr No</th>
              <th className="p-3 border">Invoice #</th>
              <th className="p-3 border">Vendor</th>
              <th className="p-3 border">Amount (₹)</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.map((inv, i) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="p-3 border">{i + 1}</td>
                <td className="p-3 border">{inv.invoiceNumber}</td>
                <td className="p-3 border">{inv.vendorName}</td>
                <td className="p-3 border">₹{inv.totalAmount.toLocaleString()}</td>
                <td className="p-3 border">
                  {inv.status}
                  {inv.status === "Approved" && (
                    <div className="mt-1 space-x-2">
                      <button
                        className="bg-green-500 text-white text-xs px-2 py-1 rounded cursor-pointer"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowPurchaseModal(true);
                          toast.success("Purchase Entry Created!")
                        }}
                      >
                        Purchase Voucher
                      </button>
                      <button
                        className="bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowJournalModal(true);
                          toast.success("Prepaid Expense entry Created!")
                        }}
                      >
                        Journal Voucher
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => {
                      setSelectedInvoice(inv);
                      setIsModalOpen(true);
                    }}
                    disabled={inv.status !== "Pending"}
                    className={`px-3 py-1.5 rounded text-white text-sm ${
                      inv.status !== "Pending"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
   


        {isModalOpen && selectedInvoice && (
          <BillingManagerModal
            invoice={selectedInvoice}
            onClose={() => setIsModalOpen(false)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {showPurchaseModal && selectedInvoice && (
          <PurchaseVoucherModal
            invoice={selectedInvoice}
            onClose={() => setShowPurchaseModal(false)}
          />
        )}

        {showJournalModal && selectedInvoice && (
          <JournalVoucherModal
            invoice={selectedInvoice}
            onClose={() => setShowJournalModal(false)}
          />
        )}
      </div>

               {/* Pagination  */}
        <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded border text-sm ${
                    currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                >
                {index + 1}
                </button>
            ))}
            </div>
    </div>
  );
}
