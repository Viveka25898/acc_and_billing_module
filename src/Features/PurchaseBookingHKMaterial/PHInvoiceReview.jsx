/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import { useNavigate } from "react-router-dom";

export default function PHInvoiceReview() {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState({
    poNumber: "",
    invoiceNumber: "",
    status: "",
    type:""
  });
  const [selectedInvoice,setSelectedInvoice]=useState(null)
  const[isModalOpen,setIsModalOpen]=useState(false)

  const [currentPage, setCurrentPage] = useState(1);
const invoicesPerPage = 5;

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
    type: "Material",
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
    type: "Fixed Asset",
    documentUrl: "https://example.com/invoice/inv002.pdf"
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    vendorName: "Delta Corp",
    uploadedDate: "2025-06-01",
    totalAmount: 135000,
    posCovered: ["PO-104", "PO-105"],
    status: "Approved",
    poNumber: "PO-104",
    type: "Material",
    documentUrl: "https://example.com/invoice/inv003.pdf"
  },
  {
    id: 4,
    invoiceNumber: "INV-004",
    vendorName: "InfraBuild Ltd",
    uploadedDate: "2025-06-02",
    totalAmount: 89000,
    posCovered: ["PO-106"],
    status: "Rejected",
    poNumber: "PO-106",
    type: "Fixed Asset",
    documentUrl: "https://example.com/invoice/inv004.pdf"
  },
  {
    id: 5,
    invoiceNumber: "INV-005",
    vendorName: "Global Traders",
    uploadedDate: "2025-06-05",
    totalAmount: 115000,
    posCovered: ["PO-107"],
    status: "Pending",
    poNumber: "PO-107",
    type: "Material",
    documentUrl: "https://example.com/invoice/inv005.pdf"
  },
  {
    id: 6,
    invoiceNumber: "INV-006",
    vendorName: "Equipzone Pvt Ltd",
    uploadedDate: "2025-06-06",
    totalAmount: 212000,
    posCovered: ["PO-108", "PO-109"],
    status: "Approved",
    poNumber: "PO-108",
    type: "Fixed Asset",
    documentUrl: "https://example.com/invoice/inv006.pdf"
  },
  {
    id: 7,
    invoiceNumber: "INV-007",
    vendorName: "SteelWorks India",
    uploadedDate: "2025-06-07",
    totalAmount: 98000,
    posCovered: ["PO-110"],
    status: "Pending",
    poNumber: "PO-110",
    type: "Material",
    documentUrl: "https://example.com/invoice/inv007.pdf"
  },
  {
    id: 8,
    invoiceNumber: "INV-008",
    vendorName: "KraftBuild LLP",
    uploadedDate: "2025-06-08",
    totalAmount: 187000,
    posCovered: ["PO-111", "PO-112"],
    status: "Rejected",
    poNumber: "PO-111",
    type: "Fixed Asset",
    documentUrl: "https://example.com/invoice/inv008.pdf"
  },
  {
    id: 9,
    invoiceNumber: "INV-009",
    vendorName: "Core Materials Co.",
    uploadedDate: "2025-06-09",
    totalAmount: 124500,
    posCovered: ["PO-113"],
    status: "Pending",
    poNumber: "PO-113",
    type: "Material",
    documentUrl: "https://example.com/invoice/inv009.pdf"
  },
  {
    id: 10,
    invoiceNumber: "INV-010",
    vendorName: "AssetTech Solutions",
    uploadedDate: "2025-06-10",
    totalAmount: 310000,
    posCovered: ["PO-114", "PO-115"],
    status: "Approved",
    poNumber: "PO-114",
    type: "Fixed Asset",
    documentUrl: "https://example.com/invoice/inv010.pdf"
  },
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
  const navigate=useNavigate()

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

  //Filter Invoice
  const filteredInvoices = invoices.filter((inv) => {
  return (
    inv.poNumber.toLowerCase().includes(filter.poNumber.toLowerCase()) &&
    inv.invoiceNumber.toLowerCase().includes(filter.invoiceNumber.toLowerCase()) &&
    inv.status.toLowerCase().includes(filter.status.toLowerCase()) &&
    (filter.type === "" || inv.type === filter.type)
  );
});

  //Pagination
  const indexOfLast=currentPage * invoicesPerPage;
  const indexOfFirst=indexOfLast-invoicesPerPage;
  const currentInvoices=filteredInvoices.slice(indexOfFirst,indexOfLast)
  const totalPages=Math.ceil(filteredInvoices.length/invoicesPerPage)




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
     <div className="flex items-center justify-center mb-6 h-14 relative">
      {/* Center slot: Title */}
      <h2 className="text-2xl text-green-600 font-bold">Invoice Review - PH</h2>
    {/* Left slot: Invoice History button */}
    <div className="absolute left-4">
      <button
        onClick={() => navigate("/dashboard/ph/invoice-history")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Invoice History
      </button>
    </div>

  </div>

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

        {/* For Material Sorting Like Fixed Assets and Material  */}
        <select
          name="type"
          className="border border-gray-300 rounded px-4 py-2 w-full"
          value={filter.type}
          onChange={handleFilterChange}
        >
          <option value="">All Types</option>
          <option value="Material">Material</option>
          <option value="Fixed Asset">Fixed Asset</option>
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
              currentInvoices.map((invoice, index) => (
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
                        disabled={invoice.status !== "Pending"}
                        className={`px-3 py-1 rounded text-white ${
                          invoice.status !== "Pending"
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(invoice.id, "Rejected")}
                        disabled={invoice.status !== "Pending"}
                        className={`px-3 py-1 rounded text-white ${
                          invoice.status !== "Pending"
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Reject
                      </button>
                    </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

            {/* *******************Pagination**************************** */}
            <div className="flex justify-between mt-4">
              <button
              onClick={()=>setCurrentPage((prev)=>Math.max(prev-1,1))}
              disabled={currentPage===1}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
              onClick={()=>setCurrentPage((prev)=>Math.min(prev + 1,totalPages))}
              disabled={currentPage===totalPages}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>

      </div>
      {/* Modal Component  */}
      <InvoiceDetailsModal isOpen={isModalOpen} onClose={closeModal} invoice={selectedInvoice} />
    </div>
  );
}
