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
    documentUrl: "https://example.com/invoice/inv001.pdf",
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
    documentUrl: "https://example.com/invoice/inv002.pdf",
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
    documentUrl: "https://example.com/invoice/inv003.pdf",
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
    documentUrl: "https://example.com/invoice/inv004.pdf",
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
    documentUrl: "https://example.com/invoice/inv005.pdf",
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
    documentUrl: "https://example.com/invoice/inv006.pdf",
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
    documentUrl: "https://example.com/invoice/inv007.pdf",
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
    documentUrl: "https://example.com/invoice/inv008.pdf",
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
    documentUrl: "https://example.com/invoice/inv009.pdf",
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
    documentUrl: "https://example.com/invoice/inv010.pdf",
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
  documentUrl: "https://example.com/invoice/inv011.pdf",
  poDocuments: [
    { name: "PO-003", url: "https://example.com/po-003.pdf" },
    { name: "PO-004", url: "https://example.com/po-004.pdf" }
  ]
}
];



const InvoiceReviewPage = () => {
    const [invoices,setInvoices]=useState(dummyInvoices)
    const [filters, setFilters] = useState({
                                              invoiceNumber: "",
                                              vendorName: "",
                                              date: "",
                                            });
    const [filteredInvoices,setFilteredInvoices]=useState(dummyInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate=useNavigate()
  //Open Modal
  const openModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };
//Close Modal
  const closeModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };
 
  // Handle Update Invoice 
 const handleUpdateInvoice = (id, status, remark = "") => {
  const updated = invoices.map((inv) => {
    if (inv.id === id) {
      let finalStatus = status;

      // 👉 Special condition for Procurement Material
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


  //Handle Filter
  const handleFilter = (newFilters) => {
  setFilters(newFilters); // update local filter state too

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


  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-green-700">Invoice Review (Accounts Executive)</h1>
      <AEInvoiceFilter filters={filters} setFilters={handleFilter}/>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm md:text-base">
  <thead className="bg-gray-100 text-left">
    <tr>
      <th className="p-3 border">Invoice #</th>
      <th className="p-3 border">Vendor Name</th>
      <th className="p-3 border">Amount (₹)</th>
      <th className="p-3 border">PO</th>
      <th className="p-3 border">Type</th>
      <th className="p-3 border">Status</th>
      <th className="p-3 border text-center">Action</th>
    </tr>
  </thead>
  <tbody>
    {currentInvoices.map((inv) => (
      <tr key={inv.id} className="hover:bg-gray-50">
        <td className="p-3 border">{inv.invoiceNumber}</td>
        <td className="p-3 border">{inv.vendorName}</td>
        <td className="p-3 border">₹{inv.totalAmount.toLocaleString()}</td>
       <td className="p-3 border text-sm space-y-1">
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
        <td className="p-3 border">{inv.type || "Material"}</td> {/* ✅ Show Type */}
        <td className="p-3 border">
                {inv.status === "Approved" ? (
                  <div className="flex items-center justify-evenly">
                    <span className="p-3 bg-green-200 rounded-full px-2 py-1">
                      {inv.status}
                    </span>

                    {/* ✅ Show button only if Approved */}
                    {inv.type === "Material" && (
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold  rounded cursor-pointer"
                        onClick={() =>
                          navigate(`/dashboard/ae/invoice-purchase-entry/${inv.id}`, {
                            state: { invoice: inv },
                          })
                        }
                      >
                        Purchase Entry
                      </button>
                    )}

                    {inv.type === "Fixed Asset" && (
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold  rounded cursor-pointer"
                        onClick={() =>
                          navigate(`/dashboard/ae/fixed-asset-entry/${inv.id}`, {
                            state: { invoice: inv },
                          })
                        }
                      >
                        Fixed Asset Entry
                      </button>
                    )}
                  </div>
                ) : (
                  inv.status
                )}
              </td>
        <td className="p-3 border text-center">
         <button
            onClick={() => openModal(inv)}
            className={`px-4 py-1.5 rounded text-sm ${
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


       {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded border text-sm font-medium ${
              page === currentPage ? "bg-green-600 text-white" : "bg-white"
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
