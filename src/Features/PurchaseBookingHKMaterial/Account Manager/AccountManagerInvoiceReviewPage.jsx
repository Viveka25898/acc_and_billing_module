// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AMInvoiceFilter from "./AccountManagerInvoiceFilter";
// import AMInvoiceVerifyModal from "./AccountManagerInvoiceVerifyModal";
// import InvoiceJVDisplay from "../Components/InvoiceJVDisplay";

// const AMInvoiceReviewPage = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [filters, setFilters] = useState({
//     invoiceNumber: "",
//     vendorName: "",
//     date: "",
//   });
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isJVModalOpen, setIsJVModalOpen] = useState(false);
//   const [jvData, setJvData] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const navigate = useNavigate();

//   // Load Invoice Data from localStorage (AE Approved invoices)
//   const loadInvoiceData = () => {
//     try {
//       // Get invoices approved by AE
//       const pendingAMInvoices = localStorage.getItem("pending_am_invoices");
      
//       if (pendingAMInvoices) {
//         const parsedInvoices = JSON.parse(pendingAMInvoices);
//         setInvoices(parsedInvoices);
//         setFilteredInvoices(parsedInvoices);
//       } else {
//         // No invoices from AE yet
//         setInvoices([]);
//         setFilteredInvoices([]);
//       }
//     } catch (error) {
//       console.error("Error loading AM invoice data:", error);
//       setInvoices([]);
//       setFilteredInvoices([]);
//     }
//   };

//   // Refresh data from localStorage
//   const refreshData = () => {
//     loadInvoiceData();
//     alert("Data refreshed from localStorage!");
//   };

//   // Clear processed invoices (for demo purposes)
//   const clearProcessedInvoices = () => {
//     if (window.confirm("Clear all processed invoices from Account Manager queue?")) {
//       const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
//       const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
      
//       localStorage.setItem("pending_am_invoices", JSON.stringify([]));
      
//       setInvoices([]);
//       setFilteredInvoices([]);
      
//       alert(`Cleared AM queue. Total processed: ${processedInvoices.length + rejectedInvoices.length} invoices.`);
//     }
//   };

//   // View processed invoices summary
//   const viewProcessedSummary = () => {
//     const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
//     const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
//     const pendingAE = JSON.parse(localStorage.getItem("pending_ae_invoices") || "[]");
    
//     const summary = `
// Invoice Processing Summary:
// - Pending AE Approval: ${pendingAE.length}
// - Pending AM Approval: ${invoices.length}  
// - Total Processed: ${processedInvoices.length}
// - Total Rejected: ${rejectedInvoices.length}
//     `;
    
//     alert(summary);
//   };

//   // Load data on component mount
//   useEffect(() => {
//     loadInvoiceData();
//   }, []);

//   // Auto-refresh to check for new AE approvals
//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Silently refresh data every 30 seconds to check for new AE approvals
//       const pendingAMInvoices = localStorage.getItem("pending_am_invoices");
//       if (pendingAMInvoices) {
//         const parsedInvoices = JSON.parse(pendingAMInvoices);
//         setInvoices(parsedInvoices);
//         setFilteredInvoices(parsedInvoices);
//       }
//     }, 30000); // Check every 30 seconds

//     return () => clearInterval(interval);
//   }, []);

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

//   // Prepare JV Data
//   const prepareJVData = (invoice) => {
//     // Calculate base amount (excluding GST)
//     const baseAmount = Math.round(invoice.totalAmount / (1 + (invoice.gstRate / 100)));

//     // Calculate GST amount (should be exact)
//     const gstAmount = invoice.totalAmount - baseAmount;
//     // For CGST/SGST (equal split), handle rounding properly
//     const halfGst = gstAmount / 2;
//     const cgstAmount = Math.floor(halfGst); // Round down
//     const sgstAmount = gstAmount - cgstAmount; // Remainder to ensure total matches
      
//     // Calculate total debits
//     const totalDebits = baseAmount + cgstAmount + sgstAmount;
//     const adjustment = invoice.totalAmount - totalDebits;
      
//     // Net payable should equal total invoice amount
//     const netPayable = invoice.totalAmount;
//     // Verify balance (should be zero)
//     const balanceCheck = totalDebits - netPayable;

//     return {
//       header: {
//         company: "iSmart",
//         voucherNo: `JV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
//         financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
//         date: new Date().toISOString().split('T')[0],
//         reference: `${invoice.invoiceNumber}`,
//         preparedBy: "Account Manager"
//       },
//       entries: [
//         {
//           id: 1,
//           particulars: invoice.type === "Fixed Asset" ? "Fixed Asset Purchase" : "Material Purchase",
//           gl: invoice.type === "Fixed Asset" ? "1010" : "5010",
//           costCenter: "Operations",
//           debit: baseAmount + adjustment, // Add any rounding adjustment here
//           credit: 0,
//           note: `Vendor: ${invoice.vendorName}`,
//         },
//         {
//           id: 2,
//           particulars: "CGST Input",
//           gl: "1801",
//           costCenter: "",
//           debit: cgstAmount,
//           credit: 0,
//           note: `@${invoice.gstRate/2}%`,
//         },
//         {
//           id: 3,
//           particulars: "SGST Input",
//           gl: "1802",
//           costCenter: "",
//           debit: sgstAmount,
//           credit: 0,
//           note: `@${invoice.gstRate/2}%`,
//         },
//         {
//           id: 4,
//           particulars: `Accounts Payable - ${invoice.vendorName}`,
//           gl: "2000",
//           costCenter: "",
//           debit: 0,
//           credit: netPayable,
//           note: `Invoice: ${invoice.invoiceNumber}`,
//         },
//       ],
//       narration: `Payment against ${invoice.type} Invoice No. ${invoice.invoiceNumber} (₹${invoice.totalAmount.toLocaleString()}), including GST @${invoice.gstRate}%.`,
//       approvals: {
//         preparer: "Account Manager",
//         reviewer: "Pending",
//         approver: "Pending",
//         date: new Date().toISOString().split('T')[0]
//       }
//     };
//   };

//   // Handle Update Invoice (Keep approved invoices in current view temporarily)
//   const handleUpdateInvoice = (id, status, remark = "") => {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
//     const timestamp = new Date().toISOString();

//     if (status === "Approved") {
//       // First update the local state to show the buttons
//       const updatedLocalInvoices = invoices.map(inv => {
//         if (inv.id === id) {
//           return {
//             ...inv,
//             accountManagerStatus: status,
//             finalStatus: status,
//             amRemarks: remark,
//             processedByAM: currentUser.username || "am1",
//             processedAtAM: timestamp,
//             showButtons: true // Flag to show buttons temporarily
//           };
//         }
//         return inv;
//       });

//       setInvoices(updatedLocalInvoices);
//       setFilteredInvoices(updatedLocalInvoices);

//       // Find the updated invoice for JV preparation
//       const updatedInvoice = updatedLocalInvoices.find(inv => inv.id === id);
      
//       // Prepare JV data if approved for Material or Fixed Asset
//       if (updatedInvoice && (updatedInvoice.type === "Material" || updatedInvoice.type === "Fixed Asset")) {
//         const jvDataPrepared = prepareJVData(updatedInvoice);
//         // Use setTimeout to ensure state updates complete before opening modal
//         setTimeout(() => {
//           setJvData(jvDataPrepared);
//           setIsJVModalOpen(true);
//         }, 100);
//       }

//       // Update localStorage after a delay to allow user to use buttons
//       setTimeout(() => {
//         // Get current invoice data from AM queue
//         const currentAMInvoices = JSON.parse(localStorage.getItem("pending_am_invoices") || "[]");
//         const invoiceToUpdate = currentAMInvoices.find(inv => inv.id === id);
        
//         if (!invoiceToUpdate) return;

//         // Update invoice with AM decision
//         const processedInvoice = {
//           ...invoiceToUpdate,
//           accountManagerStatus: status,
//           finalStatus: "Final Approved",
//           status: "Completed - Ready for Payment",
//           amRemarks: remark,
//           processedByAM: currentUser.username || "am1",
//           processedAtAM: timestamp
//         };

//         // Final Approval - Move to processed invoices
//         const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
        
//         // Add to processed queue
//         const updatedProcessedQueue = [...processedInvoices, processedInvoice];
//         localStorage.setItem("processed_invoices", JSON.stringify(updatedProcessedQueue));
        
//         // Remove from AM queue
//         const updatedAMQueue = currentAMInvoices.filter(inv => inv.id !== id);
//         localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));
        
//       }, 30000); // Keep invoice visible for 30 seconds to allow button usage

//       alert(`Invoice ${updatedInvoice.invoiceNumber} approved! You can now use Purchase Entry or Fixed Asset Entry buttons.`);
      
//     } else if (status === "Rejected") {
//       // Get current invoice data from AM queue
//       const currentAMInvoices = JSON.parse(localStorage.getItem("pending_am_invoices") || "[]");
//       const invoiceToUpdate = currentAMInvoices.find(inv => inv.id === id);
      
//       if (!invoiceToUpdate) return;

//       // AM Rejected - Move to rejected queue
//       const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
//       const rejectedInvoice = {
//         ...invoiceToUpdate,
//         accountManagerStatus: status,
//         finalStatus: "Rejected by Account Manager",
//         status: "Rejected - Return to Vendor",
//         amRemarks: remark,
//         processedByAM: currentUser.username || "am1",
//         processedAtAM: timestamp,
//         rejectedAtAM: timestamp
//       };
      
//       // Add to rejected queue
//       const updatedRejectedQueue = [...rejectedInvoices, rejectedInvoice];
//       localStorage.setItem("rejected_invoices", JSON.stringify(updatedRejectedQueue));
      
//       // Remove from AM queue
//       const updatedAMQueue = currentAMInvoices.filter(inv => inv.id !== id);
//       localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));
      
//       // Update local state
//       setInvoices(updatedAMQueue);
//       setFilteredInvoices(updatedAMQueue);
      
//       alert(`Invoice ${invoiceToUpdate.invoiceNumber} rejected by Account Manager and returned to vendor.`);
//     }

//     closeModal();
//   };

//   // Handle Filter
//   const handleFilter = (newFilters) => {
//     setFilters(newFilters);

//     const { invoiceNumber, vendorName, date } = newFilters;
//     const filtered = invoices.filter((inv) => {
//       return (
//         (!invoiceNumber || inv.invoiceNumber.includes(invoiceNumber)) &&
//         (!vendorName || inv.vendorName.toLowerCase().includes(vendorName.toLowerCase())) &&
//         (!date || inv.submittedAt?.includes(date))
//       );
//     });
//     setFilteredInvoices(filtered);
//     setCurrentPage(1);
//   };

//   // Function to remove invoice from local view after button usage
//   const handleButtonClick = (buttonType, invoice) => {
//     // Navigate to the respective page
//     if (buttonType === "purchase") {
//       navigate(`/dashboard/account-manager/invoice-purchase-entry/${invoice.id}`, {
//         state: { invoice: invoice },
//       });
//     } else if (buttonType === "asset") {
//       navigate(`/dashboard/account-manager/fixed-asset-entry/${invoice.id}`, {
//         state: { invoice: invoice },
//       });
//     }

//     // Remove invoice from local state after navigation
//     setTimeout(() => {
//       const updatedInvoices = invoices.filter(inv => inv.id !== invoice.id);
//       setInvoices(updatedInvoices);
//       setFilteredInvoices(updatedInvoices);
//     }, 1000);
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
//   const currentInvoices = filteredInvoices.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl md:text-2xl font-bold text-green-700">
//           Invoice Review (Account Manager)
//         </h1>
        
//         {/* Control Buttons for Demo/Development */}
//         <div className="flex gap-2">
//           <button
//             onClick={refreshData}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
//             title="Refresh data from localStorage"
//           >
//             Refresh
//           </button>
//           <button
//             onClick={viewProcessedSummary}
//             className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
//             title="View processing summary"
//           >
//             Summary
//           </button>
//           <button
//             onClick={clearProcessedInvoices}
//             className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
//             title="Clear processed invoices"
//           >
//             Clear Queue
//           </button>
//         </div>
//       </div>

//       <AMInvoiceFilter filters={filters} setFilters={handleFilter} />

//       <div className="overflow-x-auto rounded border mt-4">
//         <table className="w-full text-sm md:text-base">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-3 border">Invoice #</th>
//               <th className="p-3 border">Vendor Name</th>
//               <th className="p-3 border">Amount (₹)</th>
//               <th className="p-3 border">PO</th>
//               <th className="p-3 border">Type</th>
//               <th className="p-3 border">AE Status</th>
//               <th className="p-3 border">AM Status</th>
//               <th className="p-3 border text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentInvoices.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="p-4 text-center text-gray-500">
//                   No invoices approved by Account Executive yet.
//                   <br />
//                   <span className="text-xs">Invoices will appear here after AE approval.</span>
//                 </td>
//               </tr>
//             ) : (
//               currentInvoices.map((inv) => (
//                 <tr key={inv.id} className="hover:bg-gray-50">
//                   <td className="p-3 border">{inv.invoiceNumber}</td>
//                   <td className="p-3 border">{inv.vendorName}</td>
//                   <td className="p-3 border">₹{inv.totalAmount.toLocaleString()}</td>
//                   <td className="p-3 border text-sm space-y-1">
//                     {inv.poDocuments && inv.poDocuments.length > 0 ? (
//                       inv.poDocuments.map((doc, index) => (
//                         <div key={index}>
//                           {index + 1}]{" "}
//                           <a
//                             href={doc.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 underline hover:text-blue-800"
//                           >
//                             {doc.name}
//                           </a>
//                         </div>
//                       ))
//                     ) : (
//                       <span className="text-gray-500 italic">No PO</span>
//                     )}
//                   </td>
//                   <td className="p-3 border">{inv.type || "Material"}</td>
//                   <td className="p-3 border">
//                     <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
//                       Approved by AE
//                     </span>
//                     {inv.processedBy && (
//                       <div className="text-xs text-gray-500 mt-1">
//                         by {inv.processedBy}
//                       </div>
//                     )}
//                   </td>
//                   <td className="p-3 border">
//                     {inv.accountManagerStatus === "Approved" ? (
//                       <div className="flex items-center justify-center gap-2 flex-wrap">
//                         <span className="bg-green-200 rounded-full px-2 py-1 text-xs">
//                           {inv.accountManagerStatus}
//                         </span>

//                         {/* Purchase Entry and Fixed Asset Entry buttons for Account Manager */}
//                         {inv.type === "Material" && (
//                           <button
//                             className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer"
//                             onClick={() => handleButtonClick("purchase", inv)}
//                           >
//                             Purchase Entry
//                           </button>
//                         )}

//                         {inv.type === "Fixed Asset" && (
//                           <button
//                             className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer"
//                             onClick={() => handleButtonClick("asset", inv)}
//                           >
//                             Fixed Asset Entry
//                           </button>
//                         )}
//                       </div>
//                     ) : inv.accountManagerStatus === "Rejected" ? (
//                       <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">
//                         Rejected by AM
//                       </span>
//                     ) : (
//                       <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
//                         Pending AM Approval
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-3 border text-center">
//                     <button
//                       onClick={() => openModal(inv)}
//                       className={`px-4 py-1.5 rounded text-sm ${
//                         inv.accountManagerStatus === "Approved" || 
//                         inv.accountManagerStatus === "Rejected" || 
//                         inv.finalStatus === "Final Approved"
//                           ? "bg-gray-400 text-white cursor-not-allowed"
//                           : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
//                       }`}
//                       disabled={
//                         inv.accountManagerStatus === "Approved" || 
//                         inv.accountManagerStatus === "Rejected" || 
//                         inv.finalStatus === "Final Approved"
//                       }
//                     >
//                       View & Approve
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-4 space-x-2">
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`px-3 py-1 rounded border text-sm font-medium ${
//                 page === currentPage ? "bg-blue-600 text-white" : "bg-white"
//               }`}
//             >
//               {page}
//             </button>
//           ))}
//         </div>
//       )}

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
//         <InvoiceJVDisplay 
//           data={jvData}
//           onClose={() => setIsJVModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default AMInvoiceReviewPage;

// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AMInvoiceFilter from "./AccountManagerInvoiceFilter";
// import AMInvoiceVerifyModal from "./AccountManagerInvoiceVerifyModal";
// import InvoiceJVDisplay from "../Components/InvoiceJVDisplay";

// const AMInvoiceReviewPage = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [filters, setFilters] = useState({
//     invoiceNumber: "",
//     vendorName: "",
//     date: "",
//   });
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isJVModalOpen, setIsJVModalOpen] = useState(false);
//   const [jvData, setJvData] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const navigate = useNavigate();

//   // Load Invoice Data from localStorage (AE Approved invoices)
//   const loadInvoiceData = () => {
//     try {
//       // Get invoices approved by AE
//       const pendingAMInvoices = localStorage.getItem("pending_am_invoices");
      
//       if (pendingAMInvoices) {
//         const parsedInvoices = JSON.parse(pendingAMInvoices);
//         setInvoices(parsedInvoices);
//         setFilteredInvoices(parsedInvoices);
//       } else {
//         // No invoices from AE yet
//         setInvoices([]);
//         setFilteredInvoices([]);
//       }
//     } catch (error) {
//       console.error("Error loading AM invoice data:", error);
//       setInvoices([]);
//       setFilteredInvoices([]);
//     }
//   };

//   // Refresh data from localStorage
//   const refreshData = () => {
//     loadInvoiceData();
//     alert("Data refreshed from localStorage!");
//   };

//   // Clear processed invoices (for demo purposes)
//   const clearProcessedInvoices = () => {
//     if (window.confirm("Clear all processed invoices from Account Manager queue?")) {
//       const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
//       const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
//       const billingManagerInvoices = JSON.parse(localStorage.getItem("billing_manager_invoices") || "[]");
      
//       localStorage.setItem("pending_am_invoices", JSON.stringify([]));
      
//       setInvoices([]);
//       setFilteredInvoices([]);
      
//       alert(`Cleared AM queue. Total processed: ${processedInvoices.length + rejectedInvoices.length + billingManagerInvoices.length} invoices.`);
//     }
//   };

//   // View processed invoices summary
//   const viewProcessedSummary = () => {
//     const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
//     const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
//     const pendingAE = JSON.parse(localStorage.getItem("pending_ae_invoices") || "[]");
//     const billingManagerInvoices = JSON.parse(localStorage.getItem("billing_manager_invoices") || "[]");
    
//     const summary = `
// Invoice Processing Summary:
// - Pending AE Approval: ${pendingAE.length}
// - Pending AM Approval: ${invoices.length}  
// - Sent to Billing Manager: ${billingManagerInvoices.length}
// - Total Processed (Material/Fixed Asset): ${processedInvoices.length}
// - Total Rejected: ${rejectedInvoices.length}
//     `;
    
//     alert(summary);
//   };

//   // Load data on component mount
//   useEffect(() => {
//     loadInvoiceData();
//   }, []);

//   // Auto-refresh to check for new AE approvals
//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Silently refresh data every 30 seconds to check for new AE approvals
//       const pendingAMInvoices = localStorage.getItem("pending_am_invoices");
//       if (pendingAMInvoices) {
//         const parsedInvoices = JSON.parse(pendingAMInvoices);
//         setInvoices(parsedInvoices);
//         setFilteredInvoices(parsedInvoices);
//       }
//     }, 30000); // Check every 30 seconds

//     return () => clearInterval(interval);
//   }, []);

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

//   // Prepare JV Data
//   const prepareJVData = (invoice) => {
//     // Calculate base amount (excluding GST)
//     const baseAmount = Math.round(invoice.totalAmount / (1 + (invoice.gstRate / 100)));

//     // Calculate GST amount (should be exact)
//     const gstAmount = invoice.totalAmount - baseAmount;
//     // For CGST/SGST (equal split), handle rounding properly
//     const halfGst = gstAmount / 2;
//     const cgstAmount = Math.floor(halfGst); // Round down
//     const sgstAmount = gstAmount - cgstAmount; // Remainder to ensure total matches
      
//     // Calculate total debits
//     const totalDebits = baseAmount + cgstAmount + sgstAmount;
//     const adjustment = invoice.totalAmount - totalDebits;
      
//     // Net payable should equal total invoice amount
//     const netPayable = invoice.totalAmount;
//     // Verify balance (should be zero)
//     const balanceCheck = totalDebits - netPayable;

//     return {
//       header: {
//         company: "iSmart",
//         voucherNo: `JV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
//         financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
//         date: new Date().toISOString().split('T')[0],
//         reference: `${invoice.invoiceNumber}`,
//         preparedBy: "Account Manager"
//       },
//       entries: [
//         {
//           id: 1,
//           particulars: invoice.type === "Fixed Asset" ? "Fixed Asset Purchase" : "Material Purchase",
//           gl: invoice.type === "Fixed Asset" ? "1010" : "5010",
//           costCenter: "Operations",
//           debit: baseAmount + adjustment, // Add any rounding adjustment here
//           credit: 0,
//           note: `Vendor: ${invoice.vendorName}`,
//         },
//         {
//           id: 2,
//           particulars: "CGST Input",
//           gl: "1801",
//           costCenter: "",
//           debit: cgstAmount,
//           credit: 0,
//           note: `@${invoice.gstRate/2}%`,
//         },
//         {
//           id: 3,
//           particulars: "SGST Input",
//           gl: "1802",
//           costCenter: "",
//           debit: sgstAmount,
//           credit: 0,
//           note: `@${invoice.gstRate/2}%`,
//         },
//         {
//           id: 4,
//           particulars: `Accounts Payable - ${invoice.vendorName}`,
//           gl: "2000",
//           costCenter: "",
//           debit: 0,
//           credit: netPayable,
//           note: `Invoice: ${invoice.invoiceNumber}`,
//         },
//       ],
//       narration: `Payment against ${invoice.type} Invoice No. ${invoice.invoiceNumber} (₹${invoice.totalAmount.toLocaleString()}), including GST @${invoice.gstRate}%.`,
//       approvals: {
//         preparer: "Account Manager",
//         reviewer: "Pending",
//         approver: "Pending",
//         date: new Date().toISOString().split('T')[0]
//       }
//     };
//   };

//   // Handle Update Invoice (Modified for Procurement Prepaid)
//   const handleUpdateInvoice = (id, status, remark = "") => {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
//     const timestamp = new Date().toISOString();

//     if (status === "Approved") {
//       // Get current invoice data from AM queue
//       const currentAMInvoices = JSON.parse(localStorage.getItem("pending_am_invoices") || "[]");
//       const invoiceToUpdate = currentAMInvoices.find(inv => inv.id === id);
      
//       if (!invoiceToUpdate) return;

//       // Check invoice type and handle differently
//       if (invoiceToUpdate.type === "Procurement Prepaid") {
//         // For Procurement Prepaid: Move to Billing Manager queue
//         const billingManagerInvoices = JSON.parse(localStorage.getItem("billing_manager_invoices") || "[]");
        
//         const approvedInvoice = {
//           ...invoiceToUpdate,
//           accountManagerStatus: "Approved",
//           amRemarks: remark,
//           processedByAM: currentUser.username || "am1",
//           processedAtAM: timestamp,
//           billingManagerStatus: "Pending",
//           bmRemarks: "",
//           processedByBM: "",
//           processedAtBM: ""
//         };
        
//         // Add to billing manager queue
//         const updatedBMQueue = [...billingManagerInvoices, approvedInvoice];
//         localStorage.setItem("billing_manager_invoices", JSON.stringify(updatedBMQueue));
        
//         // Remove from AM queue
//         const updatedAMQueue = currentAMInvoices.filter(inv => inv.id !== id);
//         localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));
        
//         // Update local state
//         setInvoices(updatedAMQueue);
//         setFilteredInvoices(updatedAMQueue);
        
//         alert(`Procurement Prepaid Invoice ${invoiceToUpdate.invoiceNumber} approved by Account Manager and sent to Billing Manager for final approval.`);
        
//       } else {
//         // For Material and Fixed Asset: Keep existing logic
//         // First update the local state to show the buttons
//         const updatedLocalInvoices = invoices.map(inv => {
//           if (inv.id === id) {
//             return {
//               ...inv,
//               accountManagerStatus: status,
//               finalStatus: status,
//               amRemarks: remark,
//               processedByAM: currentUser.username || "am1",
//               processedAtAM: timestamp,
//               showButtons: true // Flag to show buttons temporarily
//             };
//           }
//           return inv;
//         });

//         setInvoices(updatedLocalInvoices);
//         setFilteredInvoices(updatedLocalInvoices);

//         // Find the updated invoice for JV preparation
//         const updatedInvoice = updatedLocalInvoices.find(inv => inv.id === id);
        
//         // Prepare JV data if approved for Material or Fixed Asset
//         if (updatedInvoice && (updatedInvoice.type === "Material" || updatedInvoice.type === "Fixed Asset")) {
//           const jvDataPrepared = prepareJVData(updatedInvoice);
//           // Use setTimeout to ensure state updates complete before opening modal
//           setTimeout(() => {
//             setJvData(jvDataPrepared);
//             setIsJVModalOpen(true);
//           }, 100);
//         }

//         // Update localStorage after a delay to allow user to use buttons
//         setTimeout(() => {
//           // Update invoice with AM decision
//           const processedInvoice = {
//             ...invoiceToUpdate,
//             accountManagerStatus: status,
//             finalStatus: "Final Approved",
//             status: "Completed - Ready for Payment",
//             amRemarks: remark,
//             processedByAM: currentUser.username || "am1",
//             processedAtAM: timestamp
//           };

//           // Final Approval - Move to processed invoices
//           const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
          
//           // Add to processed queue
//           const updatedProcessedQueue = [...processedInvoices, processedInvoice];
//           localStorage.setItem("processed_invoices", JSON.stringify(updatedProcessedQueue));
          
//           // Remove from AM queue
//           const updatedAMQueue = currentAMInvoices.filter(inv => inv.id !== id);
//           localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));
          
//         }, 30000); // Keep invoice visible for 30 seconds to allow button usage

//         alert(`Invoice ${updatedInvoice.invoiceNumber} approved! You can now use Purchase Entry or Fixed Asset Entry buttons.`);
//       }
      
//     } else if (status === "Rejected") {
//       // Rejection logic remains same for all types
//       const currentAMInvoices = JSON.parse(localStorage.getItem("pending_am_invoices") || "[]");
//       const invoiceToUpdate = currentAMInvoices.find(inv => inv.id === id);
      
//       if (!invoiceToUpdate) return;

//       // AM Rejected - Move to rejected queue
//       const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
//       const rejectedInvoice = {
//         ...invoiceToUpdate,
//         accountManagerStatus: status,
//         finalStatus: "Rejected by Account Manager",
//         status: "Rejected - Return to Vendor",
//         amRemarks: remark,
//         processedByAM: currentUser.username || "am1",
//         processedAtAM: timestamp,
//         rejectedAtAM: timestamp
//       };
      
//       // Add to rejected queue
//       const updatedRejectedQueue = [...rejectedInvoices, rejectedInvoice];
//       localStorage.setItem("rejected_invoices", JSON.stringify(updatedRejectedQueue));
      
//       // Remove from AM queue
//       const updatedAMQueue = currentAMInvoices.filter(inv => inv.id !== id);
//       localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));
      
//       // Update local state
//       setInvoices(updatedAMQueue);
//       setFilteredInvoices(updatedAMQueue);
      
//       alert(`Invoice ${invoiceToUpdate.invoiceNumber} rejected by Account Manager and returned to vendor.`);
//     }

//     closeModal();
//   };

//   // Handle Filter
//   const handleFilter = (newFilters) => {
//     setFilters(newFilters);

//     const { invoiceNumber, vendorName, date } = newFilters;
//     const filtered = invoices.filter((inv) => {
//       return (
//         (!invoiceNumber || inv.invoiceNumber.includes(invoiceNumber)) &&
//         (!vendorName || inv.vendorName.toLowerCase().includes(vendorName.toLowerCase())) &&
//         (!date || inv.submittedAt?.includes(date))
//       );
//     });
//     setFilteredInvoices(filtered);
//     setCurrentPage(1);
//   };

//   // Function to remove invoice from local view after button usage
//   const handleButtonClick = (buttonType, invoice) => {
//     // Navigate to the respective page
//     if (buttonType === "purchase") {
//       navigate(`/dashboard/account-manager/invoice-purchase-entry/${invoice.id}`, {
//         state: { invoice: invoice },
//       });
//     } else if (buttonType === "asset") {
//       navigate(`/dashboard/account-manager/fixed-asset-entry/${invoice.id}`, {
//         state: { invoice: invoice },
//       });
//     }

//     // Remove invoice from local state after navigation
//     setTimeout(() => {
//       const updatedInvoices = invoices.filter(inv => inv.id !== invoice.id);
//       setInvoices(updatedInvoices);
//       setFilteredInvoices(updatedInvoices);
//     }, 1000);
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
//   const currentInvoices = filteredInvoices.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl md:text-2xl font-bold text-green-700">
//           Invoice Review (Account Manager)
//         </h1>
        
//         {/* Control Buttons for Demo/Development */}
//         <div className="flex gap-2">
//           <button
//             onClick={refreshData}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
//             title="Refresh data from localStorage"
//           >
//             Refresh
//           </button>
//           <button
//             onClick={viewProcessedSummary}
//             className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
//             title="View processing summary"
//           >
//             Summary
//           </button>
//           <button
//             onClick={clearProcessedInvoices}
//             className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
//             title="Clear processed invoices"
//           >
//             Clear Queue
//           </button>
//         </div>
//       </div>

//       <AMInvoiceFilter filters={filters} setFilters={handleFilter} />

//       <div className="overflow-x-auto rounded border mt-4">
//         <table className="w-full text-sm md:text-base">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-3 border">Invoice #</th>
//               <th className="p-3 border">Vendor Name</th>
//               <th className="p-3 border">Amount (₹)</th>
//               <th className="p-3 border">PO</th>
//               <th className="p-3 border">Type</th>
//               <th className="p-3 border">AE Status</th>
//               <th className="p-3 border">AM Status</th>
//               <th className="p-3 border text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentInvoices.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="p-4 text-center text-gray-500">
//                   No invoices approved by Account Executive yet.
//                   <br />
//                   <span className="text-xs">Invoices will appear here after AE approval.</span>
//                 </td>
//               </tr>
//             ) : (
//               currentInvoices.map((inv) => (
//                 <tr key={inv.id} className="hover:bg-gray-50">
//                   <td className="p-3 border">{inv.invoiceNumber}</td>
//                   <td className="p-3 border">{inv.vendorName}</td>
//                   <td className="p-3 border">₹{inv.totalAmount.toLocaleString()}</td>
//                   <td className="p-3 border text-sm space-y-1">
//                     {inv.poDocuments && inv.poDocuments.length > 0 ? (
//                       inv.poDocuments.map((doc, index) => (
//                         <div key={index}>
//                           {index + 1}]{" "}
//                           <a
//                             href={doc.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 underline hover:text-blue-800"
//                           >
//                             {doc.name}
//                           </a>
//                         </div>
//                       ))
//                     ) : (
//                       <span className="text-gray-500 italic">No PO</span>
//                     )}
//                   </td>
//                   <td className="p-3 border">
//                     <span className={`px-2 py-1 rounded text-xs ${
//                       inv.type === "Procurement Prepaid" ? "bg-purple-100 text-purple-800" :
//                       inv.type === "Fixed Asset" ? "bg-blue-100 text-blue-800" :
//                       "bg-gray-100 text-gray-800"
//                     }`}>
//                       {inv.type || "Material"}
//                     </span>
//                   </td>
//                   <td className="p-3 border">
//                     <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
//                       Approved by AE
//                     </span>
//                     {inv.processedBy && (
//                       <div className="text-xs text-gray-500 mt-1">
//                         by {inv.processedBy}
//                       </div>
//                     )}
//                   </td>
//                   <td className="p-3 border">
//                     {inv.accountManagerStatus === "Approved" ? (
//                       <div className="flex items-center justify-center gap-2 flex-wrap">
//                         <span className="bg-green-200 rounded-full px-2 py-1 text-xs">
//                           {inv.accountManagerStatus}
//                         </span>

//                         {/* Only show buttons for Material and Fixed Asset types */}
//                         {inv.type === "Material" && (
//                           <button
//                             className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer"
//                             onClick={() => handleButtonClick("purchase", inv)}
//                           >
//                             Purchase Entry
//                           </button>
//                         )}

//                         {inv.type === "Fixed Asset" && (
//                           <button
//                             className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer"
//                             onClick={() => handleButtonClick("asset", inv)}
//                           >
//                             Fixed Asset Entry
//                           </button>
//                         )}

//                         {/* For Procurement Prepaid, show different message */}
//                         {inv.type === "Procurement Prepaid" && (
//                           <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
//                             Sent to Billing Manager
//                           </span>
//                         )}
//                       </div>
//                     ) : inv.accountManagerStatus === "Rejected" ? (
//                       <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">
//                         Rejected by AM
//                       </span>
//                     ) : (
//                       <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
//                         Pending AM Approval
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-3 border text-center">
//                     <button
//                       onClick={() => openModal(inv)}
//                       className={`px-4 py-1.5 rounded text-sm ${
//                         inv.accountManagerStatus === "Approved" || 
//                         inv.accountManagerStatus === "Rejected" || 
//                         inv.finalStatus === "Final Approved"
//                           ? "bg-gray-400 text-white cursor-not-allowed"
//                           : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
//                       }`}
//                       disabled={
//                         inv.accountManagerStatus === "Approved" || 
//                         inv.accountManagerStatus === "Rejected" || 
//                         inv.finalStatus === "Final Approved"
//                       }
//                     >
//                       View & Approve
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-4 space-x-2">
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`px-3 py-1 rounded border text-sm font-medium ${
//                 page === currentPage ? "bg-blue-600 text-white" : "bg-white"
//               }`}
//             >
//               {page}
//             </button>
//           ))}
//         </div>
//       )}

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
//         <InvoiceJVDisplay 
//           data={jvData}
//           onClose={() => setIsJVModalOpen(false)}
//         />
//       )}
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
import { processHKMaterialInvoice } from "../../Master/utils/accountingHelpers";

// Prepaid Period Selection Modal Component
const PrepaidPeriodModal = ({ invoice, onClose, onConfirm }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("12");
  const [startMonth, setStartMonth] = useState("");

  useEffect(() => {
    // Set default start month to current month
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    setStartMonth(currentMonth);
  }, []);

  const handleConfirm = () => {
    const periodData = {
      period: parseInt(selectedPeriod),
      startMonth: startMonth,
      monthlyAmount: Math.round(invoice.totalAmount / parseInt(selectedPeriod))
    };
    onConfirm(invoice.id, periodData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">
          Prepaid Period Selection - {invoice.invoiceNumber}
        </h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Invoice Amount:</strong> ₹{invoice.totalAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Vendor:</strong> {invoice.vendorName}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prepaid Period (Months)
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
            <option value="18">18 Months</option>
            <option value="24">24 Months</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Month
          </label>
          <input
            type="month"
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="bg-purple-50 p-3 rounded mb-4">
          <p className="text-sm text-purple-800">
            <strong>Monthly Amortization:</strong> ₹{Math.round(invoice.totalAmount / parseInt(selectedPeriod)).toLocaleString()}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            This amount will be expensed each month for {selectedPeriod} months starting from {startMonth}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Confirm Period
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [isPrepaidModalOpen, setIsPrepaidModalOpen] = useState(false);
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
      const billingManagerInvoices = JSON.parse(localStorage.getItem("billing_manager_invoices") || "[]");
      
      localStorage.setItem("pending_am_invoices", JSON.stringify([]));
      
      setInvoices([]);
      setFilteredInvoices([]);
      
      alert(`Cleared AM queue. Total processed: ${processedInvoices.length + rejectedInvoices.length + billingManagerInvoices.length} invoices.`);
    }
  };

  // View processed invoices summary
  const viewProcessedSummary = () => {
    const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
    const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
    const pendingAE = JSON.parse(localStorage.getItem("pending_ae_invoices") || "[]");
    const billingManagerInvoices = JSON.parse(localStorage.getItem("billing_manager_invoices") || "[]");
    
    const summary = `
Invoice Processing Summary:
- Pending AE Approval: ${pendingAE.length}
- Pending AM Approval: ${invoices.length}  
- Sent to Billing Manager: ${billingManagerInvoices.length}
- Total Processed (Material/Fixed Asset): ${processedInvoices.length}
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

  // Handle Prepaid Period Confirmation
  const handlePrepaidPeriodConfirm = (invoiceId, periodData) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const timestamp = new Date().toISOString();

    // Get current invoice data from AM queue
    const currentAMInvoices = JSON.parse(localStorage.getItem("pending_am_invoices") || "[]");
    const invoiceToUpdate = currentAMInvoices.find(inv => inv.id === invoiceId);
    
    if (!invoiceToUpdate) return;

    // Create the approved invoice with prepaid data
    const approvedInvoice = {
      ...invoiceToUpdate,
      accountManagerStatus: "Approved",
      amRemarks: `Prepaid period set for ${periodData.period} months`,
      processedByAM: currentUser.username || "am1",
      processedAtAM: timestamp,
      prepaidPeriod: periodData.period,
      prepaidStartMonth: periodData.startMonth,
      monthlyAmortization: periodData.monthlyAmount,
      billingManagerStatus: "Pending",
      bmRemarks: "",
      processedByBM: "",
      processedAtBM: ""
    };

    // Move to billing manager queue
    const billingManagerInvoices = JSON.parse(localStorage.getItem("billing_manager_invoices") || "[]");
    const updatedBMQueue = [...billingManagerInvoices, approvedInvoice];
    localStorage.setItem("billing_manager_invoices", JSON.stringify(updatedBMQueue));
    
    // Remove from AM queue
    const updatedAMQueue = currentAMInvoices.filter(inv => inv.id !== invoiceId);
    localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));
    
    // Update local state - remove from table
    setInvoices(updatedAMQueue);
    setFilteredInvoices(updatedAMQueue);
    
    // Close the prepaid modal
    setIsPrepaidModalOpen(false);
    setSelectedInvoice(null); // Clear selected invoice
    
    alert(`Prepaid period set successfully! Invoice ${invoiceToUpdate.invoiceNumber} sent to Billing Manager for final approval.`);
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
          debit: baseAmount + adjustment,
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

  // Handle Update Invoice (Modified for different invoice types)
  // Handle Update Invoice (Modified for different invoice types)
const handleUpdateInvoice = async (id, status, remark = "") => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const timestamp = new Date().toISOString();

  // Get current invoice data from AM queue
  const currentAMInvoices = JSON.parse(localStorage.getItem("pending_am_invoices") || "[]");
  const invoiceToUpdate = currentAMInvoices.find(inv => inv.id === id);
  
  if (!invoiceToUpdate) return;

  if (status === "Approved") {
    // Check invoice type and handle differently
    if (invoiceToUpdate.type === "Procurement Prepaid") {
      // For Procurement Prepaid: DON'T close the modal, just open prepaid period selection
      setIsPrepaidModalOpen(true);
      // The invoice will be processed when prepaid period is confirmed
      return; // Don't close the main modal or do anything else yet
      
    } else if (invoiceToUpdate.type === "Material") {
      // ========================================
      // HK MATERIAL INVOICE - AUTO GL POSTING
      // ========================================
      try {
        // Process HK Material invoice with auto-GL posting
        const glResult = await processHKMaterialInvoice(invoiceToUpdate, {
          bankCode: "A3004003001", // Default bank for now
          bankName: "SBI Current Account"
        });
        
        if (glResult.success) {
          // Move to processed queue with GL reference
          const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
          const processedInvoice = {
            ...invoiceToUpdate,
            accountManagerStatus: "Approved",
            finalStatus: "GL Posted - Completed",
            amRemarks: remark || "HK Material invoice processed with auto-GL posting",
            processedByAM: currentUser.username || "am1",
            processedAtAM: timestamp,
            voucher_id: glResult.voucherNo,
            vendor_gl_code: glResult.vendorGLCode,
            gl_entries: glResult.transactionId,
            accounting_result: glResult
          };
          
          const updatedProcessedQueue = [...processedInvoices, processedInvoice];
          localStorage.setItem("processed_invoices", JSON.stringify(updatedProcessedQueue));
          
          // Remove from AM queue
          const updatedAMQueue = currentAMInvoices.filter(inv => inv.id !== id);
          localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));
          
          // Update local state
          setInvoices(updatedAMQueue);
          setFilteredInvoices(updatedAMQueue);
          
          // Show success message
          alert(`✅ HK Material invoice ${invoiceToUpdate.invoiceNumber} approved and GL entries posted!\nVoucher: ${glResult.voucherNo}\nVendor GL: ${glResult.vendorGLCode}`);
          
          closeModal();
          return;
        } else {
          // GL posting failed - keep invoice in AM queue and show error
          alert(`❌ HK Material invoice approval failed: ${glResult.message}\nInvoice remains in queue for retry.`);
          // Don't close modal - let user see the error and potentially retry
          return;
        }
        
      } catch (error) {
        console.error('❌ Error in HK Material approval:', error);
        alert(`❌ HK Material invoice approval failed: ${error.message}\nInvoice remains in queue.`);
        return; // Keep invoice in queue
      }
      
    } else if (invoiceToUpdate.type === "Fixed Asset") {
      // ========================================
      // FIXED ASSET - KEEP EXISTING BUTTON LOGIC
      // ========================================
      const updatedLocalInvoices = invoices.map(inv => {
        if (inv.id === id) {
          return {
            ...inv,
            accountManagerStatus: "Approved",
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
      
      // Close the verify modal first
      closeModal();
      
      // Prepare JV data for Fixed Asset
      if (updatedInvoice) {
        const jvDataPrepared = prepareJVData(updatedInvoice);
        setTimeout(() => {
          setJvData(jvDataPrepared);
          setIsJVModalOpen(true);
        }, 300);
      }

      alert(`Fixed Asset invoice ${updatedInvoice.invoiceNumber} approved! Use the Fixed Asset Entry button to complete processing.`);
    }
    
  } else if (status === "Rejected") {
    // AM Rejected - Move to rejected queue (same for all types)
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
    
    // Close modal for rejections
    closeModal();
  }
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

  // Function to handle button clicks and complete invoice processing
  const handleButtonClick = (buttonType, invoice) => {
    if (buttonType === "purchase") {
      // For Material invoices - open Purchase Entry form
      navigate(`/dashboard/account-manager/invoice-purchase-entry/${invoice.id}`, {
        state: { invoice: invoice },
      });
      
      // After navigation, complete the processing
      completeInvoiceProcessing(invoice, "Purchase Entry Completed");
      
    } else if (buttonType === "asset") {
      // For Fixed Asset invoices - open Fixed Asset Entry form
      navigate(`/dashboard/account-manager/fixed-asset-entry/${invoice.id}`, {
        state: { invoice: invoice },
      });
      
      // After navigation, complete the processing
      completeInvoiceProcessing(invoice, "Fixed Asset Entry Completed");
    }
  };

  // Complete invoice processing after form submission
  const completeInvoiceProcessing = (invoice, completionStatus) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const timestamp = new Date().toISOString();

    // Move invoice to final processed queue
    const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
    const finalProcessedInvoice = {
      ...invoice,
      finalStatus: "Completed",
      completionStatus: completionStatus,
      completedByAM: currentUser.username || "am1",
      completedAtAM: timestamp
    };
    
    const updatedProcessedQueue = [...processedInvoices, finalProcessedInvoice];
    localStorage.setItem("processed_invoices", JSON.stringify(updatedProcessedQueue));

    // Remove from current AM queue after a delay to allow navigation
    setTimeout(() => {
      // Get current AM queue
      const currentAMInvoices = JSON.parse(localStorage.getItem("pending_am_invoices") || "[]");
      const updatedAMQueue = currentAMInvoices.filter(inv => inv.id !== invoice.id);
      localStorage.setItem("pending_am_invoices", JSON.stringify(updatedAMQueue));

      // Update local state
      const updatedInvoices = invoices.filter(inv => inv.id !== invoice.id);
      setInvoices(updatedInvoices);
      setFilteredInvoices(updatedInvoices);
    }, 2000); // 2 second delay to allow navigation
  };

  // Close prepaid modal handler
  const closePrepaidModal = () => {
    setIsPrepaidModalOpen(false);
    // Don't clear selectedInvoice here as the main modal might still be open
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
                  <td className="p-3 border">
                    <span className={`px-2 py-1 rounded text-xs ${
                      inv.type === "Procurement Prepaid" ? "bg-purple-100 text-purple-800" :
                      inv.type === "Fixed Asset" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {inv.type || "Material"}
                    </span>
                  </td>
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
                          Approved
                        </span>
                        {inv.type === "Fixed Asset" && inv.showButtons && (
                          <button
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer"
                            onClick={() => handleButtonClick("asset", inv)}
                          >
                            Fixed Asset Entry
                          </button>
                        )}

                        {/* For Procurement Prepaid, just show status as it goes directly to BM */}
                        {inv.type === "Procurement Prepaid" && (
                          <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
                            Sent to Billing Manager
                          </span>
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

      {/* Prepaid Period Selection Modal */}
      {isPrepaidModalOpen && selectedInvoice && (
        <PrepaidPeriodModal
          invoice={selectedInvoice}
          onClose={closePrepaidModal}
          onConfirm={handlePrepaidPeriodConfirm}
        />
      )}

      {/* JV Modal */}
      {isJVModalOpen && jvData && (
        <InvoiceJVDisplay 
          data={jvData}
          onClose={() => {
            setIsJVModalOpen(false);
            setJvData(null); // Clear JV data when closing
          }}
        />
      )}
    </div>
  );
};

export default AMInvoiceReviewPage;