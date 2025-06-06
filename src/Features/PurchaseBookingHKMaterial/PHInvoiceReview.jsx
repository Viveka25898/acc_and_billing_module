import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import InvoiceDetailsModal from "./InvoiceDetailsModal";

export default function PHInvoiceReview() {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState({
    poNumber: "",
    invoiceNumber: "",
    status: ""
  });
  const [selectedInvoice,setSelectedInvoice]=useState(null)
  const[isModalOpen,setIsModalOpen]=useState(false)

  useEffect(() => {
    try {
      const mockData = [
        {
          id: 1,
          invoiceNumber: "INV-001",
          vendorName: "ABC Suppliers",
          uploadedDate: "2025-05-01",
          totalAmount: 120000,
          posCovered: ["PO-101", "PO-102"],
          status: "Pending",
          poNumber: "PO-101",
           documentUrl: "https://example.com/invoice/inv001.pdf"
        },
        {
          id: 2,
          invoiceNumber: "INV-002",
          vendorName: "XYZ Enterprises",
          uploadedDate: "2025-05-15",
          totalAmount: 95000,
          posCovered: ["PO-103"],
          status: "Pending",
          poNumber: "PO-103",
           documentUrl: "https://example.com/invoice/inv002.pdf"
        }
      ];
      setInvoices(mockData);
    } catch (error) {
      console.error("Failed to load invoice data", error);
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleStatusChange = (id, newStatus) => {
    try {
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, status: newStatus } : invoice
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    return (
      inv.poNumber.toLowerCase().includes(filter.poNumber.toLowerCase()) &&
      inv.invoiceNumber.toLowerCase().includes(filter.invoiceNumber.toLowerCase()) &&
      inv.status.toLowerCase().includes(filter.status.toLowerCase())
    );
  });
  //Open Modal

  const openModal=(invoice)=>{
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }
  //Close Modal
  const closeModal=()=>{
    setSelectedInvoice(null)
    setIsModalOpen(false)
  } 

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Invoice Review - PH</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <input
          name="poNumber"
          type="text"
          placeholder="Filter by PO Number"
          className="border border-gray-300 rounded px-4 py-2 w-full"
          value={filter.poNumber}
          onChange={handleFilterChange}
        />
        <input
          name="invoiceNumber"
          type="text"
          placeholder="Filter by Invoice Number"
          className="border border-gray-300 rounded px-4 py-2 w-full"
          value={filter.invoiceNumber}
          onChange={handleFilterChange}
        />
        <select
          name="status"
          className="border border-gray-300 rounded px-4 py-2 w-full"
          value={filter.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Invoice No.</th>
              <th className="border p-2">Vendor Name</th>
              <th className="border p-2">Uploaded Date</th>
              <th className="border p-2">POs Covered</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Invoice Details</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6">No invoices found.</td>
              </tr>
            ) : (
              filteredInvoices.map((invoice, index) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{invoice.invoiceNumber}</td>
                  <td className="border p-2">{invoice.vendorName}</td>
                  <td className="border p-2">{invoice.uploadedDate}</td>
                  <td className="border p-2">{invoice.posCovered.join(", ")}</td>
                  <td className="border p-2">₹{invoice.totalAmount.toLocaleString()}</td>
                  <td className="border p-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : invoice.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                    onClick={()=>openModal(invoice)}
                    className="text-blue-600 hover:text-blue-900">
                        <FaEye/>
                    </button>
                    
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleStatusChange(invoice.id, "Approved")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(invoice.id, "Rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal Component  */}
      <InvoiceDetailsModal isOpen={isModalOpen} onClose={closeModal} invoice={selectedInvoice} />
    </div>
  );
}
