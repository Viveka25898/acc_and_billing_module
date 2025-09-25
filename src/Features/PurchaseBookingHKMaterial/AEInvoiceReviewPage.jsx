/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AEInvoiceFilter from "./Components/AEInvoiceFilter";
import InvoiceVerifyModal from "./InvoiceVerifyModal"

const InvoiceReviewPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    invoiceNumber: "",
    vendorName: "",
    date: "",
  });
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // Initialize Invoice Data (From Procurement - Step 9)
  const initializeInvoiceData = () => {
    const initialInvoicesForAE = [
      {
        id: "INV-001",
        type: "Material",
        invoiceNumber: "INV-001",
        vendorName: "ABC Enterprises",
        totalAmount: 125000,
        status: "Pending GST Verification", // Step 10: AE needs to verify GST
        gstRate: 18,
        hsnCode: "998314",
        hsnSummary: "Construction Services",
        documentUrl: "/public/DxotBTxfHn.png",
        submittedBy: "procurement",
        submittedAt: new Date().toISOString(),
        processedBy: null,
        processedAt: null,
        remarks: "",
        poDocuments: [
          { name: "PO-001", url: "https://example.com/po-001.pdf" },
          { name: "PO-002", url: "https://example.com/po-002.pdf" }
        ]
      },
      {
        id: "INV-002",
        type: "Fixed Asset",
        invoiceNumber: "INV-002",
        vendorName: "XYZ Pvt Ltd",
        totalAmount: 82000,
        status: "Pending GST Verification",
        gstRate: 12,
        hsnCode: "847130",
        hsnSummary: "Computer Systems",
        documentUrl: "/public/DxotBTxfHn.png",
        submittedBy: "procurement",
        submittedAt: new Date().toISOString(),
        processedBy: null,
        processedAt: null,
        remarks: "",
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
        id: "INV-003",
        type: "Procurement Prepaid",
        invoiceNumber: "INV-003",
        vendorName: "Delta Solutions",
        totalAmount: 230000,
        status: "Pending GST Verification",
        gstRate: 18,
        hsnCode: "998223",
        hsnSummary: "Consultancy Services",
        documentUrl: "/public/DxotBTxfHn.png",
        submittedBy: "procurement",
        submittedAt: new Date().toISOString(),
        processedBy: null,
        processedAt: null,
        remarks: "",
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
        id: "INV-004",
        type: "Material",
        invoiceNumber: "INV-004",
        vendorName: "FastBuild Supplies",
        totalAmount: 45000,
        status: "Pending GST Verification",
        gstRate: 5,
        hsnCode: "401693",
        hsnSummary: "Rubber Gaskets",
        documentUrl: "/public/DxotBTxfHn.png",
        submittedBy: "procurement",
        submittedAt: new Date().toISOString(),
        processedBy: null,
        processedAt: null,
        remarks: "",
        poDocuments: [
          { name: "PO-001", url: "https://example.com/po-001.pdf" },
          { name: "PO-002", url: "https://example.com/po-002.pdf" }
        ]
      },
      {
        id: "INV-005",
        type: "Procurement Prepaid",
        invoiceNumber: "INV-005",
        vendorName: "TechFront Pvt Ltd",
        totalAmount: 158000,
        status: "Pending GST Verification",
        gstRate: 18,
        hsnCode: "847149",
        hsnSummary: "Hardware Equipments",
        documentUrl: "/public/DxotBTxfHn.png",
        submittedBy: "procurement",
        submittedAt: new Date().toISOString(),
        processedBy: null,
        processedAt: null,
        remarks: "",
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
      }
    ];

    // Initialize localStorage with invoice data
    localStorage.setItem("pending_ae_invoices", JSON.stringify(initialInvoicesForAE));
    localStorage.setItem("pending_am_invoices", JSON.stringify([])); // Empty AM queue initially
    localStorage.setItem("processed_invoices", JSON.stringify([]));
    localStorage.setItem("rejected_invoices", JSON.stringify([]));
    localStorage.setItem("invoice_counter", "1006");
    localStorage.setItem("last_data_refresh", new Date().toISOString());
    
    return initialInvoicesForAE;
  };

  // Load Invoice Data from localStorage
  const loadInvoiceData = () => {
    try {
      const pendingInvoices = localStorage.getItem("pending_ae_invoices");
      
      if (pendingInvoices) {
        const parsedInvoices = JSON.parse(pendingInvoices);
        setInvoices(parsedInvoices);
        setFilteredInvoices(parsedInvoices);
      } else {
        // Initialize if no data exists
        const initialData = initializeInvoiceData();
        setInvoices(initialData);
        setFilteredInvoices(initialData);
      }
    } catch (error) {
      console.error("Error loading invoice data:", error);
      // Fallback to initialization if loading fails
      const initialData = initializeInvoiceData();
      setInvoices(initialData);
      setFilteredInvoices(initialData);
    }
  };

  // Generate new invoices (Simulating new invoices from Procurement)
  const generateNewInvoice = () => {
    const vendors = [
      "Tech Solutions Pvt Ltd", "Office Supplies Co", "Marketing Agency Ltd",
      "Industrial Equipment Corp", "Construction Materials Inc", "Software Services Ltd"
    ];
    
    const types = ["Material", "Fixed Asset", "Procurement Prepaid"];
    const priorities = ["High", "Medium", "Low"];
    
    const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const currentCounter = parseInt(localStorage.getItem("invoice_counter") || "1006");
    const newInvoiceId = `INV-${String(currentCounter).padStart(3, '0')}`;
    
    const newInvoice = {
      id: newInvoiceId,
      type: randomType,
      invoiceNumber: newInvoiceId,
      vendorName: randomVendor,
      totalAmount: Math.floor(Math.random() * 200000) + 50000,
      status: "Pending GST Verification",
      gstRate: [5, 12, 18][Math.floor(Math.random() * 3)],
      hsnCode: Math.floor(Math.random() * 900000) + 100000,
      hsnSummary: `${randomType} Services`,
      documentUrl: "/public/DxotBTxfHn.png",
      submittedBy: "procurement",
      submittedAt: new Date().toISOString(),
      processedBy: null,
      processedAt: null,
      remarks: "",
      priority: randomPriority,
      poDocuments: [
        { name: `PO-${currentCounter}`, url: `https://example.com/po-${currentCounter}.pdf` }
      ]
    };
    
    if (randomType === "Fixed Asset") {
      newInvoice.assetDetails = {
        assetTag: `FA-2024-${String(currentCounter).padStart(3, '0')}`,
        serialNumber: `SN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        warranty: `${Math.floor(Math.random() * 5) + 1} Years`,
        location: ["Main Office, Pune", "Factory Unit B", "Branch Office, Mumbai"][Math.floor(Math.random() * 3)],
      };
    }
    
    // Update localStorage
    const currentInvoices = JSON.parse(localStorage.getItem("pending_ae_invoices") || "[]");
    const updatedInvoices = [...currentInvoices, newInvoice];
    
    localStorage.setItem("pending_ae_invoices", JSON.stringify(updatedInvoices));
    localStorage.setItem("invoice_counter", String(currentCounter + 1));
    localStorage.setItem("last_data_refresh", new Date().toISOString());
    
    // Update state
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    
    alert(`New invoice ${newInvoiceId} from ${randomVendor} added to your queue!`);
  };

  // Reset Invoice Data
  const resetInvoiceData = () => {
    if (window.confirm("Are you sure you want to reset all invoice data? This will clear all processed invoices.")) {
      localStorage.removeItem("pending_ae_invoices");
      localStorage.removeItem("pending_am_invoices");
      localStorage.removeItem("processed_invoices");
      localStorage.removeItem("rejected_invoices");
      localStorage.removeItem("invoice_counter");
      localStorage.removeItem("last_data_refresh");
      
      const initialData = initializeInvoiceData();
      setInvoices(initialData);
      setFilteredInvoices(initialData);
      
      alert("Invoice data has been reset!");
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadInvoiceData();
  }, []);

  // Auto-refresh mechanism (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if we should add new invoices (simulate procurement team adding invoices)
      const lastRefresh = localStorage.getItem("last_data_refresh");
      if (lastRefresh) {
        const timeDiff = new Date() - new Date(lastRefresh);
        // Add new invoice every 5 minutes (for demo purposes)
        if (timeDiff > 5 * 60 * 1000) {
          const shouldAdd = Math.random() > 0.7; // 30% chance to add new invoice
          if (shouldAdd) {
            generateNewInvoice();
          }
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const openModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };

  // Modified handleUpdateInvoice - This is the key function for workflow
  const handleUpdateInvoice = (id, status, remark = "") => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const timestamp = new Date().toISOString();

    // Get current invoice data
    const currentInvoices = JSON.parse(localStorage.getItem("pending_ae_invoices") || "[]");
    const invoiceToUpdate = currentInvoices.find(inv => inv.id === id);
    
    if (!invoiceToUpdate) return;

    // Update invoice with AE decision
    const updatedInvoice = {
      ...invoiceToUpdate,
      status: status,
      remark: remark,
      processedBy: currentUser.username || "ae1",
      processedAt: timestamp
    };

    if (status === "Approved") {
      // Step 12: AE Approved - Move to Account Manager queue
      const pendingAMInvoices = JSON.parse(localStorage.getItem("pending_am_invoices") || "[]");
      updatedInvoice.status = "Approved by AE - Pending AM Review";
      
      // Add to AM queue
      const updatedAMQueue = [...pendingAMInvoices, updatedInvoice];
      localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));
      
      // Remove from AE queue
      const updatedAEQueue = currentInvoices.filter(inv => inv.id !== id);
      localStorage.setItem("pending_ae_invoices", JSON.stringify(updatedAEQueue));
      
      // Update local state
      setInvoices(updatedAEQueue);
      setFilteredInvoices(updatedAEQueue);
      
      alert(`Invoice ${invoiceToUpdate.invoiceNumber} approved and sent to Account Manager for final processing!`);
      
    } else if (status === "Rejected") {
      // Step 11: AE Rejected - Move to rejected queue
      const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
      updatedInvoice.status = "Rejected by AE";
      updatedInvoice.rejectedAt = timestamp;
      
      // Add to rejected queue
      const updatedRejectedQueue = [...rejectedInvoices, updatedInvoice];
      localStorage.setItem("rejected_invoices", JSON.stringify(updatedRejectedQueue));
      
      // Remove from AE queue
      const updatedAEQueue = currentInvoices.filter(inv => inv.id !== id);
      localStorage.setItem("pending_ae_invoices", JSON.stringify(updatedAEQueue));
      
      // Update local state
      setInvoices(updatedAEQueue);
      setFilteredInvoices(updatedAEQueue);
      
      alert(`Invoice ${invoiceToUpdate.invoiceNumber} rejected and sent back to vendor with remarks.`);
    }

    closeModal();
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    const { invoiceNumber, vendorName, date } = newFilters;
    const filtered = invoices.filter((inv) => {
      return (
        (!invoiceNumber || inv.invoiceNumber.includes(invoiceNumber)) &&
        (!vendorName || inv.vendorName.toLowerCase().includes(vendorName.toLowerCase())) &&
        (!date || inv.submittedAt?.includes(date))
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-green-700">
          Invoice Review (Account Executive)
        </h1>
        
        {/* Control Buttons for Demo/Development */}
        <div className="flex gap-2">
          <button
            onClick={generateNewInvoice}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            title="Simulate new invoice from Procurement"
          >
            + Add New Invoice
          </button>
          <button
            onClick={resetInvoiceData}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            title="Reset all invoice data"
          >
            Reset Data
          </button>
          <button
            onClick={loadInvoiceData}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
            title="Refresh invoice data"
          >
            Refresh
          </button>
        </div>
      </div>

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
            {currentInvoices.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No invoices pending for review
                </td>
              </tr>
            ) : (
              currentInvoices.map((inv) => (
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
                    <span className={`px-2 py-1 rounded text-xs ${
                      inv.status === "Pending GST Verification" 
                        ? "bg-yellow-200 text-yellow-800"
                        : inv.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : inv.status === "Rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-gray-200 text-gray-800"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3 border text-center text-gray-600 text-sm">
                    Pending AE Approval
                  </td>
                  <td className="p-2 sm:p-3 border text-center">
                    <button
                      onClick={() => openModal(inv)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs md:text-sm"
                    >
                      View & Verify
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}

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