/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import InvoiceVerifyModal from "./INvoiceVerifyModal";
import { useNavigate } from "react-router-dom";
import AEInvoiceApproval from "./AEInvoiceApproval";


const dummyInvoices = [
  {
    id: 1,
    type: "Material", // 👈 new field
    invoiceNumber: "INV-001",
    vendorName: "ABC Enterprises",
    totalAmount: 125000,
    status: "Pending GST Verification",
    documentUrl: "https://example.com/invoice/inv001.pdf",
  },
  {
    id: 2,
    type: "Fixed Asset", // 👈 new field
    invoiceNumber: "INV-002",
    vendorName: "XYZ Pvt Ltd",
    totalAmount: 82000,
    status: "Pending GST Verification",
    documentUrl: "https://example.com/invoice/inv002.pdf",
    assetDetails: {
      assetTag: "FA-2024-001",
      serialNumber: "SN-AX2390",
      warranty: "3 Years",
      location: "Main Office, Pune",
    },
  },
  {
    id: 3,
    type: "Fixed Asset",
    invoiceNumber: "INV-003",
    vendorName: "Delta Solutions",
    totalAmount: 230000,
    status: "Pending GST Verification",
    documentUrl: "https://example.com/invoice/inv003.pdf",
    assetDetails: {
      assetTag: "FA-2024-002",
      serialNumber: "SN-BX4591",
      warranty: "2 Years",
      location: "Factory Unit B",
    },
  },
];


const InvoiceReviewPage = () => {
    const [invoices,setInvoices]=useState(dummyInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };
  const navigate=useNavigate()

  const closeModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };

  const handleUpdateInvoice=(id, status,remark="")=>{
    const update=invoices.map((inv)=>(
        inv.id===id ? {...inv,status,remark} : inv
    ))
    setInvoices(update)
    closeModal()

  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-green-700">Invoice Review (Accounts Executive)</h1>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm md:text-base">
  <thead className="bg-gray-100 text-left">
    <tr>
      <th className="p-3 border">Invoice #</th>
      <th className="p-3 border">Vendor Name</th>
      <th className="p-3 border">Amount (₹)</th>
      <th className="p-3 border">Type</th> {/* ✅ New Type Column */}
      <th className="p-3 border">Status</th>
      <th className="p-3 border text-center">Action</th>
    </tr>
  </thead>
  <tbody>
    {invoices.map((inv) => (
      <tr key={inv.id} className="hover:bg-gray-50">
        <td className="p-3 border">{inv.invoiceNumber}</td>
        <td className="p-3 border">{inv.vendorName}</td>
        <td className="p-3 border">₹{inv.totalAmount.toLocaleString()}</td>
        <td className="p-3 border">{inv.type || "Material"}</td> {/* ✅ Show Type */}
        <td className="p-3 border">
          {inv.status === "Approved" ? (
            <div className="flex items-center justify-evenly">
              <span className="p-3 bg-green-200 rounded-full px-2 py-1">
                {inv.status}
              </span>
              {/* ✅ Only show Purchase Entry for Material type */}
              {inv.type !== "Fixed Asset" && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/ae/invoice-purchase-entry/${inv.id}`, {
                      state: { invoice: inv },
                    })
                  }
                >
                  Purchase Entry
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
              inv.status === "Approved" || inv.status === "Rejected"
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
            disabled={inv.status === "Approved" || inv.status === "Rejected"}
          >
            View & Verify
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

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
