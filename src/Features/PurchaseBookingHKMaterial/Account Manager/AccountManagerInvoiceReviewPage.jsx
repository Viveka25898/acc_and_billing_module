// /* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AMInvoiceFilter from "./AccountManagerInvoiceFilter";
// import AMInvoiceVerifyModal from "./AccountManagerInvoiceVerifyModal";
// import InvoiceJVDisplay from "../Components/InvoiceJVDisplay";
// const dummyInvoices = [
//   {
//     id: 1,
//     type: "Material",
//     invoiceNumber: "INV-001",
//     vendorName: "ABC Enterprises",
//     totalAmount: 125000,
//     status: "Pending GST Verification",
//     gstRate: 18,
//     hsnCode: "998314",
//     hsnSummary: "Construction Services",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-001", url: "https://example.com/po-001.pdf" },
//       { name: "PO-002", url: "https://example.com/po-002.pdf" }
//     ]
//   },
//   {
//     id: 2,
//     type: "Fixed Asset",
//     invoiceNumber: "INV-002",
//     vendorName: "XYZ Pvt Ltd",
//     totalAmount: 82000,
//     status: "Pending GST Verification",
//     gstRate: 12,
//     hsnCode: "847130",
//     hsnSummary: "Computer Systems",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-001", url: "https://example.com/po-001.pdf" },
//       { name: "PO-002", url: "https://example.com/po-002.pdf" }
//     ],
//     assetDetails: {
//       assetTag: "FA-2024-001",
//       serialNumber: "SN-AX2390",
//       warranty: "3 Years",
//       location: "Main Office, Pune",
//     },
//   },
//   {
//     id: 3,
//     type: "Procurement Prepaid",
//     invoiceNumber: "INV-003",
//     vendorName: "Delta Solutions",
//     totalAmount: 230000,
//     status: "Pending GST Verification",
//     gstRate: 18,
//     hsnCode: "998223",
//     hsnSummary: "Consultancy Services",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-001", url: "https://example.com/po-001.pdf" },
//       { name: "PO-002", url: "https://example.com/po-002.pdf" }
//     ],
//     assetDetails: {
//       assetTag: "FA-2024-002",
//       serialNumber: "SN-BX4591",
//       warranty: "2 Years",
//       location: "Factory Unit B",
//     },
//   },
//   {
//     id: 4,
//     type: "Material",
//     invoiceNumber: "INV-004",
//     vendorName: "FastBuild Supplies",
//     totalAmount: 45000,
//     status: "Pending GST Verification",
//     gstRate: 5,
//     hsnCode: "401693",
//     hsnSummary: "Rubber Gaskets",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-001", url: "https://example.com/po-001.pdf" },
//       { name: "PO-002", url: "https://example.com/po-002.pdf" }
//     ]
//   },
//   {
//     id: 5,
//     type: "Procurement Prepaid",
//     invoiceNumber: "INV-005",
//     vendorName: "TechFront Pvt Ltd",
//     totalAmount: 158000,
//     status: "Pending GST Verification",
//     gstRate: 18,
//     hsnCode: "847149",
//     hsnSummary: "Hardware Equipments",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-001", url: "https://example.com/po-001.pdf" },
//       { name: "PO-002", url: "https://example.com/po-002.pdf" }
//     ],
//     assetDetails: {
//       assetTag: "FA-2024-003",
//       serialNumber: "SN-CY1234",
//       warranty: "5 Years",
//       location: "Branch Office, Mumbai",
//     },
//   },
//   {
//     id: 6,
//     type: "Material",
//     invoiceNumber: "INV-006",
//     vendorName: "BuildSmart Inc",
//     totalAmount: 64000,
//     status: "Pending GST Verification",
//     gstRate: 12,
//     hsnCode: "730890",
//     hsnSummary: "Iron and Steel Fabrication",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-001", url: "https://example.com/po-001.pdf" },
//       { name: "PO-002", url: "https://example.com/po-002.pdf" }
//     ]
//   },
//   {
//     id: 7,
//     type: "Procurement Prepaid",
//     invoiceNumber: "INV-007",
//     vendorName: "Omega Traders",
//     totalAmount: 97200,
//     status: "Pending GST Verification",
//     gstRate: 5,
//     hsnCode: "300490",
//     hsnSummary: "Medical Supplies",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-001", url: "https://example.com/po-001.pdf" },
//       { name: "PO-002", url: "https://example.com/po-002.pdf" }
//     ]
//   },
//   {
//     id: 8,
//     type: "Fixed Asset",
//     invoiceNumber: "INV-008",
//     vendorName: "NextGen Equipments",
//     totalAmount: 298000,
//     status: "Pending GST Verification",
//     gstRate: 18,
//     hsnCode: "850440",
//     hsnSummary: "Power Equipment",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-001", url: "https://example.com/po-001.pdf" },
//       { name: "PO-002", url: "https://example.com/po-002.pdf" }
//     ],
//     assetDetails: {
//       assetTag: "FA-2024-004",
//       serialNumber: "SN-DT9911",
//       warranty: "4 Years",
//       location: "Warehouse C, Bengaluru",
//     },
//   },
//   {
//     id: 9,
//     type: "Procurement Prepaid",
//     invoiceNumber: "INV-009",
//     vendorName: "Sunrise Traders",
//     totalAmount: 52000,
//     status: "Pending GST Verification",
//     gstRate: 5,
//     hsnCode: "100630",
//     hsnSummary: "Food Supplies",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-001", url: "https://example.com/po-001.pdf" },
//       { name: "PO-002", url: "https://example.com/po-002.pdf" }
//     ]
//   },
//   {
//     id: 10,
//     type: "Fixed Asset",
//     invoiceNumber: "INV-010",
//     vendorName: "MicroTech Solutions",
//     totalAmount: 112500,
//     status: "Pending GST Verification",
//     gstRate: 12,
//     hsnCode: "902780",
//     hsnSummary: "Laboratory Equipment",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-001", url: "https://example.com/po-001.pdf" },
//       { name: "PO-002", url: "https://example.com/po-002.pdf" }
//     ],
//     assetDetails: {
//       assetTag: "FA-2024-005",
//       serialNumber: "SN-MT4432",
//       warranty: "1 Year",
//       location: "HO, Hyderabad",
//     },
//   },
//   {
//     id: 11,
//     type: "Procurement Prepaid",
//     invoiceNumber: "INV-011",
//     vendorName: "InfraZone Pvt Ltd",
//     totalAmount: 134000,
//     status: "Pending GST Verification",
//     gstRate: 18,
//     hsnCode: "995454",
//     hsnSummary: "Construction Turnkey Projects",
//     documentUrl: "/public/DxotBTxfHn.png",
//     poDocuments: [
//       { name: "PO-003", url: "https://example.com/po-003.pdf" },
//       { name: "PO-004", url: "https://example.com/po-004.pdf" }
//     ]
//   }
// ];

// const AMInvoiceReviewPage = () => {
//   const [invoices, setInvoices] = useState(dummyInvoices);
//   const [filters, setFilters] = useState({
//     invoiceNumber: "",
//     vendorName: "",
//     date: "",
//   });
//   const [filteredInvoices, setFilteredInvoices] = useState(dummyInvoices);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isJVModalOpen, setIsJVModalOpen] = useState(false);
// const [jvData, setJvData] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const navigate = useNavigate();

//   // Open Modal
//   const openModal = (invoice) => {
//     setSelectedInvoice(invoice);
//     setIsModalOpen(true);
//   };

//   // Close Modal
//   const closeModal = () => {
//     setSelectedInvoice(null);
//     setIsModalOpen(false);
//   };

//   //Prepare JV Data
//   const prepareJVData = (invoice) => {
//  // Calculate base amount (excluding GST)
// const baseAmount = Math.round(invoice.totalAmount / (1 + (invoice.gstRate / 100)));

//   // Calculate GST amount (should be exact)
// const gstAmount = invoice.totalAmount - baseAmount;
// // For CGST/SGST (equal split), handle rounding properly
// const halfGst = gstAmount / 2;
// const cgstAmount = Math.floor(halfGst); // Round down
// const sgstAmount = gstAmount - cgstAmount; // Remainder to ensure total matches
  
//   // Calculate total debits
// const totalDebits = baseAmount + cgstAmount + sgstAmount;
//   const adjustment = invoice.totalAmount - totalDebits;
  
// // Net payable should equal total invoice amount
// const netPayable = invoice.totalAmount;
// // Verify balance (should be zero)
// const balanceCheck = totalDebits - netPayable;

//   return {
//     header: {
//       company: "iSmart",
//       voucherNo: `JV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
//       financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
//       date: new Date().toISOString().split('T')[0],
//       reference: `${invoice.invoiceNumber}`,
//       preparedBy: "Account Manager"
//     },
//     entries: [
//       {
//         id: 1,
//         particulars: invoice.type === "Fixed Asset" ? "Fixed Asset Purchase" : "Material Purchase",
//         gl: invoice.type === "Fixed Asset" ? "1010" : "5010",
//         costCenter: "Operations",
//         debit: baseAmount + adjustment, // Add any rounding adjustment here
//         credit: 0,
//         note: `Vendor: ${invoice.vendorName}`,
//       },
//       {
//         id: 2,
//         particulars: "CGST Input",
//         gl: "1801",
//         costCenter: "",
//         debit: cgstAmount,
//         credit: 0,
//         note: `@${invoice.gstRate/2}%`,
//       },
//       {
//         id: 3,
//         particulars: "SGST Input",
//         gl: "1802",
//         costCenter: "",
//         debit: sgstAmount,
//         credit: 0,
//         note: `@${invoice.gstRate/2}%`,
//       },
//       {
//         id: 4,
//         particulars: `Accounts Payable - ${invoice.vendorName}`,
//         gl: "2000",
//         costCenter: "",
//         debit: 0,
//         credit: netPayable,
//         note: `Invoice: ${invoice.invoiceNumber}`,
//       },
//     ],
//     narration: `Payment against ${invoice.type} Invoice No. ${invoice.invoiceNumber} (₹${invoice.totalAmount.toLocaleString()}), including GST @${invoice.gstRate}%.`,
//     approvals: {
//       preparer: "Account Manager",
//       reviewer: "Pending",
//       approver: "Pending",
//       date: new Date().toISOString().split('T')[0]
//     }
//   };
// };

//   // Handle Update Invoice 
//   const handleUpdateInvoice = (id, status, remark = "") => {
//   const updated = invoices.map((inv) => {
//     if (inv.id === id) {
//       let finalStatus = status;
//       let accountManagerStatus = status;

//       // Special condition for Procurement Material
//       if (inv.type === "Procurement Material" && status === "Approved") {
//         finalStatus = "Forwarded to Billing Manager";
//         accountManagerStatus = "Approved";
//       } else if (status === "Approved") {
//         accountManagerStatus = "Approved";
//         finalStatus = "Approved"; // Add this line to ensure status is updated
//       } else if (status === "Rejected") {
//         accountManagerStatus = "Rejected by Account Manager";
//         finalStatus = "Rejected";
//       }

//       // Prepare JV data if approved for Material or Fixed Asset
//       if (status === "Approved" && (inv.type === "Material" || inv.type === "Fixed Asset")) {
//         const jvData = prepareJVData(inv);
//         // Use setTimeout to ensure state updates complete before opening modal
//         setTimeout(() => {
//           setJvData(jvData);
//           setIsJVModalOpen(true);
//         }, 100);
//       }

//       return { 
//         ...inv, 
//         status: finalStatus, 
//         accountManagerStatus, 
//         remark 
//       };
//     }
//     return inv;
//   });

//   setInvoices(updated);
//   setFilteredInvoices(updated);
//   closeModal();
// };

//   // Handle Filter
//   const handleFilter = (newFilters) => {
//     setFilters(newFilters);

//     const { invoiceNumber, vendorName, date } = newFilters;
//     const filtered = invoices.filter((inv) => {
//       return (
//         (!invoiceNumber || inv.invoiceNumber.includes(invoiceNumber)) &&
//         (!vendorName || inv.vendorName.toLowerCase().includes(vendorName.toLowerCase())) &&
//         (!date || inv.date === date)
//       );
//     });
//     setFilteredInvoices(filtered);
//     setCurrentPage(1);
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
//   const currentInvoices = filteredInvoices.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
//       <h1 className="text-xl md:text-2xl font-bold mb-6 text-green-700">Invoice Review (Account Manager)</h1>
//       <AMInvoiceFilter filters={filters} setFilters={handleFilter} />

//       <div className="overflow-x-auto rounded border">
//         <table className="w-full text-sm md:text-base">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-3 border">Invoice #</th>
//               <th className="p-3 border">Vendor Name</th>
//               <th className="p-3 border">Amount (₹)</th>
//               <th className="p-3 border">PO</th>
//               <th className="p-3 border">Type</th>
//               <th className="p-3 border">Status</th>
//               <th className="p-3 border text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentInvoices.map((inv) => (
//               <tr key={inv.id} className="hover:bg-gray-50">
//                 <td className="p-3 border">{inv.invoiceNumber}</td>
//                 <td className="p-3 border">{inv.vendorName}</td>
//                 <td className="p-3 border">₹{inv.totalAmount.toLocaleString()}</td>
//                 <td className="p-3 border text-sm space-y-1">
//                   {inv.poDocuments && inv.poDocuments.length > 0 ? (
//                     inv.poDocuments.map((doc, index) => (
//                       <div key={index}>
//                         {index + 1}]{" "}
//                         <a
//                           href={doc.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 underline hover:text-blue-800"
//                         >
//                           {doc.name}
//                         </a>
//                       </div>
//                     ))
//                   ) : (
//                     <span className="text-gray-500 italic">No PO</span>
//                   )}
//                 </td>
//                 <td className="p-3 border">{inv.type || "Material"}</td>
//                <td className="p-3 border">
//                     {inv.accountManagerStatus === "Approved" ? (
//                       <div className="flex items-center justify-evenly">
//                         <span className="p-3 bg-green-200 rounded-full px-2 py-1">
//                           {inv.accountManagerStatus}
//                         </span>

//                         {/* 🔹 Purchase Entry and Fixed Asset Entry buttons for Account Manager */}
//                         {inv.type === "Material" && (
//                           <button
//                             className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer"
//                             onClick={() =>
//                               navigate(`/dashboard/account-manager/invoice-purchase-entry/${inv.id}`, {
//                                 state: { invoice: inv },
//                               })
//                             }
//                           >
//                             Purchase Entry
//                           </button>
//                         )}

//                         {inv.type === "Fixed Asset" && (
//                           <button
//                             className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer"
//                             onClick={() =>
//                               navigate(`/dashboard/account-manager/fixed-asset-entry/${inv.id}`, {
//                                 state: { invoice: inv },
//                               })
//                             }
//                           >
//                             Fixed Asset Entry
//                           </button>
//                         )}
//                       </div>
//                     ) : (
//                       inv.accountManagerStatus || "Pending Approval"
//                     )}
//                   </td>
//                 <td className="p-3 border text-center">
//                  <button
//                   onClick={() => openModal(inv)}
//                   className={`px-4 py-1.5 rounded text-sm ${
//                     inv.accountManagerStatus === "Approved" || 
//                     inv.accountManagerStatus === "Rejected by Account Manager" || 
//                     inv.status === "Forwarded to Billing Manager"
//                       ? "bg-gray-400 text-white cursor-not-allowed"
//                       : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
//                   }`}
//                   disabled={
//                     inv.accountManagerStatus === "Approved" || 
//                     inv.accountManagerStatus === "Rejected by Account Manager" || 
//                     inv.status === "Forwarded to Billing Manager"
//                   }
//                 >
//                   View & Approve
//                 </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex justify-center mt-4 space-x-2">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             onClick={() => setCurrentPage(page)}
//             className={`px-3 py-1 rounded border text-sm font-medium ${
//               page === currentPage ? "bg-blue-600 text-white" : "bg-white"
//             }`}
//           >
//             {page}
//           </button>
//         ))}
//       </div>

//       {/* Modal */}
//       {selectedInvoice && (
//         <AMInvoiceVerifyModal
//           isOpen={isModalOpen}
//           onClose={closeModal}
//           invoice={selectedInvoice}
//           handleUpdateInvoice={handleUpdateInvoice}
//         />
//       )}

//       {/* JV Modal */}
//       {isJVModalOpen && jvData && (
//   <InvoiceJVDisplay 
//     data={jvData}
//     onClose={() => setIsJVModalOpen(false)}
//   />
// )}
//     </div>
//   );
// };

// export default AMInvoiceReviewPage;
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AMInvoiceFilter from "./AccountManagerInvoiceFilter";
import AMInvoiceVerifyModal from "./AccountManagerInvoiceVerifyModal";
import InvoiceJVDisplay from "../Components/InvoiceJVDisplay";

const AMInvoiceReviewPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    invoiceNumber: "",
    vendorName: "",
    date: "",
  });
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJVModalOpen, setIsJVModalOpen] = useState(false);
  const [jvData, setJvData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // Load Invoice Data from localStorage (AE Approved invoices)
  const loadInvoiceData = () => {
    try {
      // Get invoices approved by AE
      const pendingAMInvoices = localStorage.getItem("pending_am_invoices");
      
      if (pendingAMInvoices) {
        const parsedInvoices = JSON.parse(pendingAMInvoices);
        setInvoices(parsedInvoices);
        setFilteredInvoices(parsedInvoices);
      } else {
        // No invoices from AE yet
        setInvoices([]);
        setFilteredInvoices([]);
      }
    } catch (error) {
      console.error("Error loading AM invoice data:", error);
      setInvoices([]);
      setFilteredInvoices([]);
    }
  };

  // Refresh data from localStorage
  const refreshData = () => {
    loadInvoiceData();
    alert("Data refreshed from localStorage!");
  };

  // Clear processed invoices (for demo purposes)
  const clearProcessedInvoices = () => {
    if (window.confirm("Clear all processed invoices from Account Manager queue?")) {
      const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
      const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
      
      localStorage.setItem("pending_am_invoices", JSON.stringify([]));
      
      setInvoices([]);
      setFilteredInvoices([]);
      
      alert(`Cleared AM queue. Total processed: ${processedInvoices.length + rejectedInvoices.length} invoices.`);
    }
  };

  // View processed invoices summary
  const viewProcessedSummary = () => {
    const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
    const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
    const pendingAE = JSON.parse(localStorage.getItem("pending_ae_invoices") || "[]");
    
    const summary = `
Invoice Processing Summary:
- Pending AE Approval: ${pendingAE.length}
- Pending AM Approval: ${invoices.length}  
- Total Processed: ${processedInvoices.length}
- Total Rejected: ${rejectedInvoices.length}
    `;
    
    alert(summary);
  };

  // Load data on component mount
  useEffect(() => {
    loadInvoiceData();
  }, []);

  // Auto-refresh to check for new AE approvals
  useEffect(() => {
    const interval = setInterval(() => {
      // Silently refresh data every 30 seconds to check for new AE approvals
      const pendingAMInvoices = localStorage.getItem("pending_am_invoices");
      if (pendingAMInvoices) {
        const parsedInvoices = JSON.parse(pendingAMInvoices);
        setInvoices(parsedInvoices);
        setFilteredInvoices(parsedInvoices);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Open Modal
  const openModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };

  // Prepare JV Data
  const prepareJVData = (invoice) => {
    // Calculate base amount (excluding GST)
    const baseAmount = Math.round(invoice.totalAmount / (1 + (invoice.gstRate / 100)));

    // Calculate GST amount (should be exact)
    const gstAmount = invoice.totalAmount - baseAmount;
    // For CGST/SGST (equal split), handle rounding properly
    const halfGst = gstAmount / 2;
    const cgstAmount = Math.floor(halfGst); // Round down
    const sgstAmount = gstAmount - cgstAmount; // Remainder to ensure total matches
      
    // Calculate total debits
    const totalDebits = baseAmount + cgstAmount + sgstAmount;
    const adjustment = invoice.totalAmount - totalDebits;
      
    // Net payable should equal total invoice amount
    const netPayable = invoice.totalAmount;
    // Verify balance (should be zero)
    const balanceCheck = totalDebits - netPayable;

    return {
      header: {
        company: "iSmart",
        voucherNo: `JV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        date: new Date().toISOString().split('T')[0],
        reference: `${invoice.invoiceNumber}`,
        preparedBy: "Account Manager"
      },
      entries: [
        {
          id: 1,
          particulars: invoice.type === "Fixed Asset" ? "Fixed Asset Purchase" : "Material Purchase",
          gl: invoice.type === "Fixed Asset" ? "1010" : "5010",
          costCenter: "Operations",
          debit: baseAmount + adjustment, // Add any rounding adjustment here
          credit: 0,
          note: `Vendor: ${invoice.vendorName}`,
        },
        {
          id: 2,
          particulars: "CGST Input",
          gl: "1801",
          costCenter: "",
          debit: cgstAmount,
          credit: 0,
          note: `@${invoice.gstRate/2}%`,
        },
        {
          id: 3,
          particulars: "SGST Input",
          gl: "1802",
          costCenter: "",
          debit: sgstAmount,
          credit: 0,
          note: `@${invoice.gstRate/2}%`,
        },
        {
          id: 4,
          particulars: `Accounts Payable - ${invoice.vendorName}`,
          gl: "2000",
          costCenter: "",
          debit: 0,
          credit: netPayable,
          note: `Invoice: ${invoice.invoiceNumber}`,
        },
      ],
      narration: `Payment against ${invoice.type} Invoice No. ${invoice.invoiceNumber} (₹${invoice.totalAmount.toLocaleString()}), including GST @${invoice.gstRate}%.`,
      approvals: {
        preparer: "Account Manager",
        reviewer: "Pending",
        approver: "Pending",
        date: new Date().toISOString().split('T')[0]
      }
    };
  };

  // Handle Update Invoice (Keep approved invoices in current view temporarily)
  const handleUpdateInvoice = (id, status, remark = "") => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const timestamp = new Date().toISOString();

    if (status === "Approved") {
      // First update the local state to show the buttons
      const updatedLocalInvoices = invoices.map(inv => {
        if (inv.id === id) {
          return {
            ...inv,
            accountManagerStatus: status,
            finalStatus: status,
            amRemarks: remark,
            processedByAM: currentUser.username || "am1",
            processedAtAM: timestamp,
            showButtons: true // Flag to show buttons temporarily
          };
        }
        return inv;
      });

      setInvoices(updatedLocalInvoices);
      setFilteredInvoices(updatedLocalInvoices);

      // Find the updated invoice for JV preparation
      const updatedInvoice = updatedLocalInvoices.find(inv => inv.id === id);
      
      // Prepare JV data if approved for Material or Fixed Asset
      if (updatedInvoice && (updatedInvoice.type === "Material" || updatedInvoice.type === "Fixed Asset")) {
        const jvDataPrepared = prepareJVData(updatedInvoice);
        // Use setTimeout to ensure state updates complete before opening modal
        setTimeout(() => {
          setJvData(jvDataPrepared);
          setIsJVModalOpen(true);
        }, 100);
      }

      // Update localStorage after a delay to allow user to use buttons
      setTimeout(() => {
        // Get current invoice data from AM queue
        const currentAMInvoices = JSON.parse(localStorage.getItem("pending_am_invoices") || "[]");
        const invoiceToUpdate = currentAMInvoices.find(inv => inv.id === id);
        
        if (!invoiceToUpdate) return;

        // Update invoice with AM decision
        const processedInvoice = {
          ...invoiceToUpdate,
          accountManagerStatus: status,
          finalStatus: "Final Approved",
          status: "Completed - Ready for Payment",
          amRemarks: remark,
          processedByAM: currentUser.username || "am1",
          processedAtAM: timestamp
        };

        // Final Approval - Move to processed invoices
        const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
        
        // Add to processed queue
        const updatedProcessedQueue = [...processedInvoices, processedInvoice];
        localStorage.setItem("processed_invoices", JSON.stringify(updatedProcessedQueue));
        
        // Remove from AM queue
        const updatedAMQueue = currentAMInvoices.filter(inv => inv.id !== id);
        localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));
        
      }, 30000); // Keep invoice visible for 30 seconds to allow button usage

      alert(`Invoice ${updatedInvoice.invoiceNumber} approved! You can now use Purchase Entry or Fixed Asset Entry buttons.`);
      
    } else if (status === "Rejected") {
      // Get current invoice data from AM queue
      const currentAMInvoices = JSON.parse(localStorage.getItem("pending_am_invoices") || "[]");
      const invoiceToUpdate = currentAMInvoices.find(inv => inv.id === id);
      
      if (!invoiceToUpdate) return;

      // AM Rejected - Move to rejected queue
      const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
      const rejectedInvoice = {
        ...invoiceToUpdate,
        accountManagerStatus: status,
        finalStatus: "Rejected by Account Manager",
        status: "Rejected - Return to Vendor",
        amRemarks: remark,
        processedByAM: currentUser.username || "am1",
        processedAtAM: timestamp,
        rejectedAtAM: timestamp
      };
      
      // Add to rejected queue
      const updatedRejectedQueue = [...rejectedInvoices, rejectedInvoice];
      localStorage.setItem("rejected_invoices", JSON.stringify(updatedRejectedQueue));
      
      // Remove from AM queue
      const updatedAMQueue = currentAMInvoices.filter(inv => inv.id !== id);
      localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));
      
      // Update local state
      setInvoices(updatedAMQueue);
      setFilteredInvoices(updatedAMQueue);
      
      alert(`Invoice ${invoiceToUpdate.invoiceNumber} rejected by Account Manager and returned to vendor.`);
    }

    closeModal();
  };

  // Handle Filter
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

  // Function to remove invoice from local view after button usage
  const handleButtonClick = (buttonType, invoice) => {
    // Navigate to the respective page
    if (buttonType === "purchase") {
      navigate(`/dashboard/account-manager/invoice-purchase-entry/${invoice.id}`, {
        state: { invoice: invoice },
      });
    } else if (buttonType === "asset") {
      navigate(`/dashboard/account-manager/fixed-asset-entry/${invoice.id}`, {
        state: { invoice: invoice },
      });
    }

    // Remove invoice from local state after navigation
    setTimeout(() => {
      const updatedInvoices = invoices.filter(inv => inv.id !== invoice.id);
      setInvoices(updatedInvoices);
      setFilteredInvoices(updatedInvoices);
    }, 1000);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-green-700">
          Invoice Review (Account Manager)
        </h1>
        
        {/* Control Buttons for Demo/Development */}
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            title="Refresh data from localStorage"
          >
            Refresh
          </button>
          <button
            onClick={viewProcessedSummary}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            title="View processing summary"
          >
            Summary
          </button>
          <button
            onClick={clearProcessedInvoices}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            title="Clear processed invoices"
          >
            Clear Queue
          </button>
        </div>
      </div>

      <AMInvoiceFilter filters={filters} setFilters={handleFilter} />

      <div className="overflow-x-auto rounded border mt-4">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Invoice #</th>
              <th className="p-3 border">Vendor Name</th>
              <th className="p-3 border">Amount (₹)</th>
              <th className="p-3 border">PO</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">AE Status</th>
              <th className="p-3 border">AM Status</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No invoices approved by Account Executive yet.
                  <br />
                  <span className="text-xs">Invoices will appear here after AE approval.</span>
                </td>
              </tr>
            ) : (
              currentInvoices.map((inv) => (
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
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {doc.name}
                          </a>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">No PO</span>
                    )}
                  </td>
                  <td className="p-3 border">{inv.type || "Material"}</td>
                  <td className="p-3 border">
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
                      Approved by AE
                    </span>
                    {inv.processedBy && (
                      <div className="text-xs text-gray-500 mt-1">
                        by {inv.processedBy}
                      </div>
                    )}
                  </td>
                  <td className="p-3 border">
                    {inv.accountManagerStatus === "Approved" ? (
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span className="bg-green-200 rounded-full px-2 py-1 text-xs">
                          {inv.accountManagerStatus}
                        </span>

                        {/* Purchase Entry and Fixed Asset Entry buttons for Account Manager */}
                        {inv.type === "Material" && (
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer"
                            onClick={() => handleButtonClick("purchase", inv)}
                          >
                            Purchase Entry
                          </button>
                        )}

                        {inv.type === "Fixed Asset" && (
                          <button
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer"
                            onClick={() => handleButtonClick("asset", inv)}
                          >
                            Fixed Asset Entry
                          </button>
                        )}
                      </div>
                    ) : inv.accountManagerStatus === "Rejected" ? (
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">
                        Rejected by AM
                      </span>
                    ) : (
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                        Pending AM Approval
                      </span>
                    )}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => openModal(inv)}
                      className={`px-4 py-1.5 rounded text-sm ${
                        inv.accountManagerStatus === "Approved" || 
                        inv.accountManagerStatus === "Rejected" || 
                        inv.finalStatus === "Final Approved"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      }`}
                      disabled={
                        inv.accountManagerStatus === "Approved" || 
                        inv.accountManagerStatus === "Rejected" || 
                        inv.finalStatus === "Final Approved"
                      }
                    >
                      View & Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border text-sm font-medium ${
                page === currentPage ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedInvoice && (
        <AMInvoiceVerifyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          invoice={selectedInvoice}
          handleUpdateInvoice={handleUpdateInvoice}
        />
      )}

      {/* JV Modal */}
      {isJVModalOpen && jvData && (
        <InvoiceJVDisplay 
          data={jvData}
          onClose={() => setIsJVModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AMInvoiceReviewPage;