/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AEInvoiceFilter from "./Components/AEInvoiceFilter";
import InvoiceVerifyModal from "./InvoiceVerifyModal"

const dummyInvoices = [
  {
    id: 1,
    type: "Material",
    invoiceNumber: "INV-001",
    vendorName: "ABC Enterprises",
    totalAmount: 125000,
    status: "Pending GST Verification",
    gstRate: 18,
    hsnCode: "998314",
    hsnSummary: "Construction Services",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-001", url: "https://example.com/po-001.pdf" },
      { name: "PO-002", url: "https://example.com/po-002.pdf" }
    ]
  },
  {
    id: 2,
    type: "Fixed Asset",
    invoiceNumber: "INV-002",
    vendorName: "XYZ Pvt Ltd",
    totalAmount: 82000,
    status: "Pending GST Verification",
    gstRate: 12,
    hsnCode: "847130",
    hsnSummary: "Computer Systems",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-001", url: "https://example.com/po-001.pdf" },
      { name: "PO-002", url: "https://example.com/po-002.pdf" }
    ],
    assetDetails: {
      assetTag: "FA-2024-001",
      serialNumber: "SN-AX2390",
      warranty: "3 Years",
      location: "Main Office, Pune",
    },
  },
  {
    id: 3,
    type: "Procurement Prepaid",
    invoiceNumber: "INV-003",
    vendorName: "Delta Solutions",
    totalAmount: 230000,
    status: "Pending GST Verification",
    gstRate: 18,
    hsnCode: "998223",
    hsnSummary: "Consultancy Services",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-001", url: "https://example.com/po-001.pdf" },
      { name: "PO-002", url: "https://example.com/po-002.pdf" }
    ],
    assetDetails: {
      assetTag: "FA-2024-002",
      serialNumber: "SN-BX4591",
      warranty: "2 Years",
      location: "Factory Unit B",
    },
  },
  {
    id: 4,
    type: "Material",
    invoiceNumber: "INV-004",
    vendorName: "FastBuild Supplies",
    totalAmount: 45000,
    status: "Pending GST Verification",
    gstRate: 5,
    hsnCode: "401693",
    hsnSummary: "Rubber Gaskets",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-001", url: "https://example.com/po-001.pdf" },
      { name: "PO-002", url: "https://example.com/po-002.pdf" }
    ]
  },
  {
    id: 5,
    type: "Procurement Prepaid",
    invoiceNumber: "INV-005",
    vendorName: "TechFront Pvt Ltd",
    totalAmount: 158000,
    status: "Pending GST Verification",
    gstRate: 18,
    hsnCode: "847149",
    hsnSummary: "Hardware Equipments",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-001", url: "https://example.com/po-001.pdf" },
      { name: "PO-002", url: "https://example.com/po-002.pdf" }
    ],
    assetDetails: {
      assetTag: "FA-2024-003",
      serialNumber: "SN-CY1234",
      warranty: "5 Years",
      location: "Branch Office, Mumbai",
    },
  },
  {
    id: 6,
    type: "Material",
    invoiceNumber: "INV-006",
    vendorName: "BuildSmart Inc",
    totalAmount: 64000,
    status: "Pending GST Verification",
    gstRate: 12,
    hsnCode: "730890",
    hsnSummary: "Iron and Steel Fabrication",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-001", url: "https://example.com/po-001.pdf" },
      { name: "PO-002", url: "https://example.com/po-002.pdf" }
    ]
  },
  {
    id: 7,
    type: "Procurement Prepaid",
    invoiceNumber: "INV-007",
    vendorName: "Omega Traders",
    totalAmount: 97200,
    status: "Pending GST Verification",
    gstRate: 5,
    hsnCode: "300490",
    hsnSummary: "Medical Supplies",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-001", url: "https://example.com/po-001.pdf" },
      { name: "PO-002", url: "https://example.com/po-002.pdf" }
    ]
  },
  {
    id: 8,
    type: "Fixed Asset",
    invoiceNumber: "INV-008",
    vendorName: "NextGen Equipments",
    totalAmount: 298000,
    status: "Pending GST Verification",
    gstRate: 18,
    hsnCode: "850440",
    hsnSummary: "Power Equipment",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-001", url: "https://example.com/po-001.pdf" },
      { name: "PO-002", url: "https://example.com/po-002.pdf" }
    ],
    assetDetails: {
      assetTag: "FA-2024-004",
      serialNumber: "SN-DT9911",
      warranty: "4 Years",
      location: "Warehouse C, Bengaluru",
    },
  },
  {
    id: 9,
    type: "Procurement Prepaid",
    invoiceNumber: "INV-009",
    vendorName: "Sunrise Traders",
    totalAmount: 52000,
    status: "Pending GST Verification",
    gstRate: 5,
    hsnCode: "100630",
    hsnSummary: "Food Supplies",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-001", url: "https://example.com/po-001.pdf" },
      { name: "PO-002", url: "https://example.com/po-002.pdf" }
    ]
  },
  {
    id: 10,
    type: "Fixed Asset",
    invoiceNumber: "INV-010",
    vendorName: "MicroTech Solutions",
    totalAmount: 112500,
    status: "Pending GST Verification",
    gstRate: 12,
    hsnCode: "902780",
    hsnSummary: "Laboratory Equipment",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-001", url: "https://example.com/po-001.pdf" },
      { name: "PO-002", url: "https://example.com/po-002.pdf" }
    ],
    assetDetails: {
      assetTag: "FA-2024-005",
      serialNumber: "SN-MT4432",
      warranty: "1 Year",
      location: "HO, Hyderabad",
    },
  },
  {
    id: 11,
    type: "Procurement Prepaid",
    invoiceNumber: "INV-011",
    vendorName: "InfraZone Pvt Ltd",
    totalAmount: 134000,
    status: "Pending GST Verification",
    gstRate: 18,
    hsnCode: "995454",
    hsnSummary: "Construction Turnkey Projects",
    documentUrl: "/public/DxotBTxfHn.png",
    poDocuments: [
      { name: "PO-003", url: "https://example.com/po-003.pdf" },
      { name: "PO-004", url: "https://example.com/po-004.pdf" }
    ]
  }
];




const InvoiceReviewPage = () => {
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [filters, setFilters] = useState({
    invoiceNumber: "",
    vendorName: "",
    date: "",
  });
  const [filteredInvoices, setFilteredInvoices] = useState(dummyInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const openModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };

  const handleUpdateInvoice = (id, status, remark = "") => {
    const updated = invoices.map((inv) => {
      if (inv.id === id) {
        let finalStatus = status;
        if (inv.type === "Procurement Material" && status === "Approved") {
          finalStatus = "Forwarded to Billing Manager";
        }
        return { ...inv, status: finalStatus, remark };
      }
      return inv;
    });

    setInvoices(updated);
    setFilteredInvoices(updated);
    closeModal();
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    const { invoiceNumber, vendorName, date } = newFilters;
    const filtered = invoices.filter((inv) => {
      return (
        (!invoiceNumber || inv.invoiceNumber.includes(invoiceNumber)) &&
        (!vendorName || inv.vendorName.toLowerCase().includes(vendorName.toLowerCase())) &&
        (!date || inv.date === date)
      );
    });
    setFilteredInvoices(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-2 md:p-4 lg:p-6 max-w-7xl mx-auto bg-white shadow-md rounded-md overflow-hidden">
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-green-700">
        Invoice Review (Accounts Executive)
      </h1>

      <AEInvoiceFilter filters={filters} setFilters={handleFilter} />

      <div className="overflow-x-auto mt-4 rounded border">
        <table className="min-w-[700px] text-xs sm:text-sm md:text-base table-auto">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="p-2 sm:p-3 border">Invoice #</th>
              <th className="p-2 sm:p-3 border">Vendor Name</th>
              <th className="p-2 sm:p-3 border">Amount (₹)</th>
              <th className="p-2 sm:p-3 border">PO</th>
              <th className="p-2 sm:p-3 border">Type</th>
              <th className="p-2 sm:p-3 border">Status</th>
              <th className="p-2 sm:p-3 border text-center">Account Manager Status</th>
              <th className="p-2 sm:p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="p-2 sm:p-3 border">{inv.invoiceNumber}</td>
                <td className="p-2 sm:p-3 border">{inv.vendorName}</td>
                <td className="p-2 sm:p-3 border">₹{inv.totalAmount.toLocaleString()}</td>
                <td className="p-2 sm:p-3 border text-xs space-y-1">
                  {inv.poDocuments && inv.poDocuments.length > 0 ? (
                    inv.poDocuments.map((doc, index) => (
                      <div key={index}>
                        {index + 1}]{" "}
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 underline hover:text-green-800"
                        >
                          {doc.name}
                        </a>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">No PO</span>
                  )}
                </td>
                <td className="p-2 sm:p-3 border">{inv.type || "Material"}</td>
                <td className="p-2 sm:p-3 border">
                  {inv.status === "Approved" ? (
                    <div className="flex items-center justify-center">
                      <span className="bg-green-200 rounded-full px-2 py-1 text-xs">
                        {inv.status}
                      </span>
                    </div>
                  ) : (
                    inv.status
                  )}
                </td>
                <td className="p-2 sm:p-3 border text-center text-gray-600 text-sm">
                  Pending Approval
                </td>
                <td className="p-2 sm:p-3 border text-center">
                  <button
                    onClick={() => openModal(inv)}
                    className={`px-3 py-1.5 rounded text-xs md:text-sm ${
                      inv.status === "Approved" ||
                      inv.status === "Rejected" ||
                      inv.status === "Forwarded to Billing Manager"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    }`}
                    disabled={
                      inv.status === "Approved" ||
                      inv.status === "Rejected" ||
                      inv.status === "Forwarded to Billing Manager"
                    }
                  >
                    View & Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 flex-wrap gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded border text-xs md:text-sm font-medium ${
              page === currentPage
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedInvoice && (
        <InvoiceVerifyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          invoice={selectedInvoice}
          handleUpdateInvoice={handleUpdateInvoice}
        />
      )}
    </div>
  );
};



export default InvoiceReviewPage;
