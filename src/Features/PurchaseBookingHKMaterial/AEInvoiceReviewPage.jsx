import React, { useState } from "react";
import InvoiceVerifyModal from "./INvoiceVerifyModal";


const dummyInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    vendorName: "ABC Enterprises",
    totalAmount: 125000,
    status: "Pending GST Verification",
    documentUrl: "https://example.com/invoice/inv001.pdf",
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    vendorName: "XYZ Pvt Ltd",
    totalAmount: 82000,
    status: "Pending GST Verification",
    documentUrl: "https://example.com/invoice/inv002.pdf",
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
                <td className="p-3 border">{inv.status}</td>
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
