/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import BillingManagerFilter from "../../Components/BillingManagerFilter";
import BillingManagerModal from "../../Components/BillingManagerModal";
import PurchaseVoucherModal from "../../Components/PurchaseVoucherModal";
import JournalVoucherModal from "../../Components/JournalVoucherModal";
import { toast } from "react-toastify";
import { processPrepaidUniformInvoice } from "../../../Master/utils/accountingHelpers";

export default function BillingManagerApprovalPage() {
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load Invoice Data from localStorage (AM Approved invoices for Procurement Prepaid)
  const loadInvoiceData = () => {
    try {
      // Get invoices approved by Account Manager that are of type "Procurement Prepaid"
      const processedInvoices = localStorage.getItem("processed_invoices");
      const billingManagerQueue = localStorage.getItem("billing_manager_invoices");
      
      let invoicesToShow = [];
      
      // Get existing billing manager invoices
      if (billingManagerQueue) {
        invoicesToShow = JSON.parse(billingManagerQueue);
      }
      
      // Check for new processed invoices that should come to billing manager
      if (processedInvoices) {
        const processed = JSON.parse(processedInvoices);
        
        // Filter for Procurement Prepaid type invoices that haven't been moved to BM queue yet
        const newProcurementInvoices = processed.filter(inv => 
          inv.type === "Procurement Prepaid" && 
          !invoicesToShow.some(existing => existing.id === inv.id)
        );
        
        // Add new procurement invoices to billing manager queue
        if (newProcurementInvoices.length > 0) {
          const updatedInvoices = newProcurementInvoices.map(inv => ({
            ...inv,
            billingManagerStatus: "Pending",
            bmRemarks: "",
            processedByBM: "",
            processedAtBM: ""
          }));
          
          invoicesToShow = [...invoicesToShow, ...updatedInvoices];
          
          // Save updated billing manager queue
          localStorage.setItem("billing_manager_invoices", JSON.stringify(invoicesToShow));
        }
      }
      
      setInvoices(invoicesToShow);
      
    } catch (error) {
      console.error("Error loading BM invoice data:", error);
      setInvoices([]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadInvoiceData();
  }, []);

  // Auto-refresh to check for new AM approvals
  useEffect(() => {
    const interval = setInterval(() => {
      loadInvoiceData();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Refresh data from localStorage
  const refreshData = () => {
    loadInvoiceData();
    toast.success("Data refreshed from localStorage!");
  };

  // Clear processed invoices (for demo purposes)
  const clearBillingQueue = () => {
    if (window.confirm("Clear all billing manager queue?")) {
      localStorage.setItem("billing_manager_invoices", JSON.stringify([]));
      setInvoices([]);
      toast.info("Billing Manager queue cleared!");
    }
  };

  // View processed invoices summary
  const viewProcessedSummary = () => {
    const processedInvoices = JSON.parse(localStorage.getItem("processed_invoices") || "[]");
    const billingManagerInvoices = JSON.parse(localStorage.getItem("billing_manager_invoices") || "[]");
    const finalProcessed = JSON.parse(localStorage.getItem("final_processed_invoices") || "[]");
    const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
    
    const summary = `
Invoice Processing Summary:
- Total AM Processed: ${processedInvoices.length}
- Pending BM Approval: ${billingManagerInvoices.filter(inv => inv.billingManagerStatus === "Pending").length}
- Final Processed: ${finalProcessed.length}
- Total Rejected: ${rejectedInvoices.length}
    `;
    
    alert(summary);
  };

  // UPDATED: Filter and sort invoices
  const filteredInvoices = invoices
    .filter((inv) => {
      const textMatch =
        inv.invoiceNumber.toLowerCase().includes(filterText.toLowerCase()) ||
        inv.vendorName?.toLowerCase().includes(filterText.toLowerCase());

      const statusMatch =
        !statusFilter || 
        (statusFilter === "Pending" && inv.billingManagerStatus === "Pending") ||
        (statusFilter === "Approved" && inv.billingManagerStatus === "Approved") ||
        (statusFilter === "Rejected" && inv.billingManagerStatus === "Rejected");

      return textMatch && statusMatch;
    })
    .sort((a, b) => {
      // Sort by status priority: Pending -> Approved -> Rejected
      const statusPriority = {
        "Pending": 1,
        "Approved": 2, 
        "Rejected": 3
      };
      
      const aPriority = statusPriority[a.billingManagerStatus] || 4;
      const bPriority = statusPriority[b.billingManagerStatus] || 4;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // If same status, sort by invoice number or date
      return a.invoiceNumber.localeCompare(b.invoiceNumber);
    });

  // Pagination 
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const handleApprove = (id) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const timestamp = new Date().toISOString();

    // Find the invoice to approve
    const invoiceToApprove = invoices.find(inv => inv.id === id);
    if (!invoiceToApprove) {
      toast.error("Invoice not found!");
      return;
    }

    // Process Prepaid Uniform invoice - automatically create Purchase Voucher and ledger entries
    const glResult = processPrepaidUniformInvoice(invoiceToApprove);
    
    if (!glResult.success) {
      toast.error(`Failed to process invoice: ${glResult.error}`);
      return;
    }

    // Update local state with approval and GL result
    const updated = invoices.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          billingManagerStatus: "Approved",
          bmRemarks: `Approved - Purchase Voucher ${glResult.purchaseVoucherNo} created`,
          processedByBM: currentUser.username || "bm1",
          processedAtBM: timestamp,
          approved: true,
          purchaseVoucherNo: glResult.purchaseVoucherNo,
          purchaseTransactionId: glResult.purchaseTransactionId,
          vendorGLCode: glResult.vendorGLCode,
          uniformPrepaidGLCode: glResult.uniformPrepaidGLCode,
          accountingResult: glResult
        };
      }
      return inv;
    });
    
    setInvoices(updated);
    setIsModalOpen(false);

    // Update localStorage
    const billingManagerInvoices = JSON.parse(localStorage.getItem("billing_manager_invoices") || "[]");
    const updatedBMInvoices = billingManagerInvoices.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          billingManagerStatus: "Approved",
          bmRemarks: `Approved - Purchase Voucher ${glResult.purchaseVoucherNo} created`,
          processedByBM: currentUser.username || "bm1",
          processedAtBM: timestamp,
          approved: true,
          purchaseVoucherNo: glResult.purchaseVoucherNo,
          purchaseTransactionId: glResult.purchaseTransactionId,
          vendorGLCode: glResult.vendorGLCode,
          uniformPrepaidGLCode: glResult.uniformPrepaidGLCode,
          accountingResult: glResult
        };
      }
      return inv;
    });

    localStorage.setItem("billing_manager_invoices", JSON.stringify(updatedBMInvoices));

    // Find the approved invoice for final processing
    const approvedInvoice = updatedBMInvoices.find(inv => inv.id === id);
    
    if (approvedInvoice) {
      // Move to final processed queue
      const finalProcessed = JSON.parse(localStorage.getItem("final_processed_invoices") || "[]");
      const finalInvoice = {
        ...approvedInvoice,
        finalStatus: "Completed - Purchase Voucher Created",
        completedAt: timestamp
      };
      
      const updatedFinalProcessed = [...finalProcessed, finalInvoice];
      localStorage.setItem("final_processed_invoices", JSON.stringify(updatedFinalProcessed));
      
      toast.success(`Invoice ${approvedInvoice.invoiceNumber} approved! Purchase Voucher ${glResult.purchaseVoucherNo} created successfully.`);
    }
  };

  const handleReject = (id) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const timestamp = new Date().toISOString();

    // Update local state first
    const updated = invoices.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          billingManagerStatus: "Rejected",
          bmRemarks: "Rejected by Billing Manager",
          processedByBM: currentUser.username || "bm1",
          processedAtBM: timestamp,
          approved: true
        };
      }
      return inv;
    });
    
    setInvoices(updated);
    setIsModalOpen(false);

    // Update localStorage
    const billingManagerInvoices = JSON.parse(localStorage.getItem("billing_manager_invoices") || "[]");
    const updatedBMInvoices = billingManagerInvoices.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          billingManagerStatus: "Rejected",
          bmRemarks: "Rejected by Billing Manager",
          processedByBM: currentUser.username || "bm1",
          processedAtBM: timestamp,
          approved: true
        };
      }
      return inv;
    });

    localStorage.setItem("billing_manager_invoices", JSON.stringify(updatedBMInvoices));

    // Move to rejected queue
    const rejectedInvoices = JSON.parse(localStorage.getItem("rejected_invoices") || "[]");
    const rejectedInvoice = updatedBMInvoices.find(inv => inv.id === id);
    
    if (rejectedInvoice) {
      const updatedRejected = [...rejectedInvoices, {
        ...rejectedInvoice,
        finalStatus: "Rejected by Billing Manager",
        rejectedAtBM: timestamp
      }];
      localStorage.setItem("rejected_invoices", JSON.stringify(updatedRejected));
      
      toast.error(`Invoice ${rejectedInvoice.invoiceNumber} rejected by Billing Manager.`);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-2xl font-bold text-green-600">
          Final Invoice Approval (Billing Manager)
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
            onClick={clearBillingQueue}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            title="Clear billing queue"
          >
            Clear Queue
          </button>
        </div>
      </div>

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
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No Procurement Prepaid invoices pending approval.
                  <br />
                  <span className="text-xs">Invoices will appear here after Account Manager approval.</span>
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((inv, i) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td className="p-3 border">{inv.invoiceNumber}</td>
                  <td className="p-3 border">{inv.vendorName}</td>
                  <td className="p-3 border">₹{inv.totalAmount.toLocaleString()}</td>
                  <td className="p-3 border">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {inv.type || "Procurement Prepaid"}
                    </span>
                  </td>
                  <td className="p-3 border">
                    {inv.billingManagerStatus === "Pending" && (
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                        Pending BM Approval
                      </span>
                    )}
                    {inv.billingManagerStatus === "Approved" && (
                      <div>
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
                          Approved
                        </span>
                        <div className="mt-1 space-x-2">
                          <button
                            className="bg-green-500 text-white text-xs px-2 py-1 rounded cursor-pointer"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setShowPurchaseModal(true);
                              toast.success("Purchase Entry Created!")
                            }}
                          >
                            View Purchase Voucher
                          </button>
                          <button
                            className="bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setShowJournalModal(true);
                              toast.success("Prepaid Expense Entry Created!")
                            }}
                          >
                            View Journal Voucher
                          </button>
                        </div>
                      </div>
                    )}
                    {inv.billingManagerStatus === "Rejected" && (
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setIsModalOpen(true);
                      }}
                      disabled={inv.billingManagerStatus !== "Pending"}
                      className={`px-3 py-1.5 rounded text-white text-sm ${
                        inv.billingManagerStatus !== "Pending"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
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

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}