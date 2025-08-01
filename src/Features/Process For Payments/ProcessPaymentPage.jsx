/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import UploadPaymentFile from "./Components/UploadPaymentFile";
import PaymentPreviewModal from "./Components/PaymentPreviewModal";
import EditPaymentDetails from "./Components/EditPaymentDetails";
import { parseExcelFile } from "./utils/excelParser";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import VendorInvoiceTable from "./Components/VendorInvoiceTable";
import InvoiceViewer from "./Components/InvoiceReviewer";
import { toast } from "react-toastify";

// Mock data for vendors and invoices - replace with API calls in production
const mockVendorData = [
  {
    id: 1,
    vendorName: "ABC Suppliers Ltd",
    debitBankAccountNumber: "123456789012",
    debitAmount: 40000,
    currency: "INR",
    beneficiaryAccountNumber: "987654321001",
    ifscCode: "HDFC0001234",
    narration: "ABC Suppliers Ltd",
    invoices: [
      { id: 101, invoiceNumber: "INV-2024-001", amount: 15000, documentUrl: "/public/invoice.pdf" },
      { id: 102, invoiceNumber: "INV-2024-002", amount: 25000, documentUrl: "/public/invoice.pdf" },
    ]
  },
  {
    id: 2,
    vendorName: "XYZ Services Pvt Ltd",
    debitBankAccountNumber: "223456789012",
    debitAmount: 45000,
    currency: "INR",
    beneficiaryAccountNumber: "987654321002",
    ifscCode: "ICIC0005678",
    narration: "XYZ Services Pvt Ltd",
    invoices: [
      { id: 201, invoiceNumber: "INV-2024-003", amount: 45000, documentUrl: "/api/invoices/201/document" },
    ]
  },
  {
    id: 3,
    vendorName: "Tech Solutions Inc",
    debitBankAccountNumber: "323456789012",
    debitAmount: 70000,
    currency: "INR",
    beneficiaryAccountNumber: "987654321003",
    ifscCode: "SBIN0007890",
    narration: "Tech Solutions Inc",
    invoices: [
      { id: 301, invoiceNumber: "INV-2024-004", amount: 30000, documentUrl: "/api/invoices/301/document" },
      { id: 302, invoiceNumber: "INV-2024-005", amount: 18000, documentUrl: "/api/invoices/302/document" },
      { id: 303, invoiceNumber: "INV-2024-006", amount: 22000, documentUrl: "/api/invoices/303/document" },
    ]
  },
  {
    id: 4,
    vendorName: "Global Enterprises",
    debitBankAccountNumber: "423456789012",
    debitAmount: 67000,
    currency: "INR",
    beneficiaryAccountNumber: "987654321004",
    ifscCode: "YESB0004567",
    narration: "Global Enterprises",
    invoices: [
      { id: 401, invoiceNumber: "INV-2024-007", amount: 55000, documentUrl: "/api/invoices/401/document" },
      { id: 402, invoiceNumber: "INV-2024-008", amount: 12000, documentUrl: "/api/invoices/402/document" },
    ]
  },
];

export default function ProcessPaymentPage() {
  const [parsedData, setParsedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState([]);
  
  // New state for vendor invoice management
  const [vendorData, setVendorData] = useState(mockVendorData);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoicePayments, setInvoicePayments] = useState({});
  
  // 🔥 NEW STATE: Store approved invoices for download
  const [approvedInvoices, setApprovedInvoices] = useState([]);

  const handleFileUpload = async (file) => {
    const data = await parseExcelFile(file);
    setParsedData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setParsedData([]);
  };

  const handleRequestChanges = (data) => {
    setEditableData(data);
    setEditMode(true);
    setIsModalOpen(false);
  };

  // Handle invoice selection for viewing
  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
  };

  // Handle payment amount updates
  const handlePaymentUpdate = (invoiceId, amount, paymentType) => {
    setInvoicePayments(prev => ({
      ...prev,
      [invoiceId]: {
        amount: amount,
        paymentType: paymentType,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  // 🔥 FIXED: Download function now uses approvedInvoices
  const handleDownloadTemplate = () => {
    if (approvedInvoices.length === 0) {
      toast.warning("No approved invoices found. Please approve some invoices first.");
      return;
    }

    // Format data for Excel export
    const exportData = approvedInvoices.map(invoice => ({
      'DEBIT BANK A/C NO': invoice.debitBankAccountNumber,
      'DEBIT AMT': invoice.paidAmount,
      'CUR': invoice.currency,
      'BENEFICIARY A/C NO': invoice.beneficiaryAccountNumber,
      'IFSC CODE': invoice.ifscCode,
      'NARRATION/NAME': invoice.narration,
      'UTR': invoice.utr,
    }));

    // Create Excel file
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bank_Payment_File");

    // Auto-size columns
    const colWidths = [];
    const headers = Object.keys(exportData[0] || {});
    headers.forEach((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...exportData.map(row => String(row[header] || '').length)
      );
      colWidths[index] = { width: Math.min(maxLength + 2, 30) };
    });
    worksheet['!cols'] = colWidths;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    saveAs(blob, `Bank_Payment_File_${timestamp}.xlsx`);
    
    const downloadedCount = approvedInvoices.length;
    
    // 🔥 CLEAR approved invoices after successful download
    setApprovedInvoices([]);
    
    toast.success(`${downloadedCount} approved invoice(s) exported for bank processing! Ready for new approvals.`);
    
    console.log("Approved invoices cleared after download");
  };

  // 🔥 FIXED: Store approved invoices before deleting them
  const handleInvoiceApproval = (selectedVendors, currentPayments = {}) => {
    const updatedVendors = [];
    const newlyApprovedInvoices = []; // 🔥 Store newly approved invoices

    vendorData.forEach((vendor) => {
      const isVendorSelected = selectedVendors[vendor.id];
      if (!isVendorSelected) {
        updatedVendors.push(vendor);
        return;
      }

      const updatedInvoices = [];

      vendor.invoices.forEach((invoice) => {
        // Use currentPayments passed from VendorInvoiceTable, fallback to invoicePayments, then default
        const payment = currentPayments[invoice.id] || 
                       invoicePayments[invoice.id] || 
                       { amount: invoice.amount, paymentType: 'full' };
                       
        const paidAmount = Number(payment?.amount || invoice.amount);
        const fullAmount = invoice.amount;
        const paymentType = payment?.paymentType || 'full';

        console.log(`Processing Invoice ${invoice.invoiceNumber}:`, {
          originalAmount: fullAmount,
          paidAmount,
          paymentType,
          payment
        });

        // 🔥 STORE approved invoice data BEFORE processing
        if (paidAmount > 0) {
          newlyApprovedInvoices.push({
            vendorId: vendor.id,
            vendorName: vendor.vendorName,
            debitBankAccountNumber: vendor.debitBankAccountNumber,
            debitAmount: paidAmount,
            currency: vendor.currency || 'INR',
            beneficiaryAccountNumber: vendor.beneficiaryAccountNumber,
            ifscCode: vendor.ifscCode,
            narration: vendor.narration ? vendor.narration.substring(0, 20) : vendor.vendorName.substring(0, 20),
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            originalAmount: fullAmount,
            paidAmount: paidAmount,
            paymentType: paymentType,
            approvedDate: new Date().toISOString(),
            utr: 'Bank'
          });
        }

        // Full payment → don't keep this invoice (remove completely)
        if (paymentType === 'full' || paidAmount >= fullAmount) {
          console.log(`Full payment for ${invoice.invoiceNumber} - removing from table`);
          return; // Invoice is fully paid, remove it
        }

        // Partial payment → keep with reduced amount
        if (paymentType === 'partial' && paidAmount < fullAmount && paidAmount > 0) {
          const remainingAmount = fullAmount - paidAmount;
          console.log(`Partial payment for ${invoice.invoiceNumber} - keeping with remaining amount: ${remainingAmount}`);
          
          updatedInvoices.push({
            ...invoice,
            amount: remainingAmount,
          });
        } else if (paymentType === 'partial' && paidAmount <= 0) {
          // Invalid partial payment, keep original invoice
          updatedInvoices.push(invoice);
        }
      });

      // If there are still invoices left → vendor stays
      if (updatedInvoices.length > 0) {
        const newDebitAmount = updatedInvoices.reduce(
          (sum, inv) => sum + inv.amount,
          0
        );

        updatedVendors.push({
          ...vendor,
          invoices: updatedInvoices,
          debitAmount: newDebitAmount,
        });
      }
      // If no invoices left, vendor is completely removed from the table
    });

    // 🔥 UPDATE approved invoices state
    setApprovedInvoices(prev => [...prev, ...newlyApprovedInvoices]);

    const processedInvoices = newlyApprovedInvoices.length;

    if (processedInvoices === 0) {
      toast.warning("No valid invoices approved. Check vendor selection and payment details.");
    } else {
      toast.success(`${processedInvoices} invoice(s) processed successfully.`);
    }

    setVendorData(updatedVendors);
    
    // Clear payment data for processed invoices
    const newInvoicePayments = { ...invoicePayments };
    vendorData.forEach(vendor => {
      if (selectedVendors[vendor.id]) {
        vendor.invoices.forEach(invoice => {
          delete newInvoicePayments[invoice.id];
        });
      }
    });
    setInvoicePayments(newInvoicePayments);

    console.log("Updated vendor data:", updatedVendors);
    console.log("Newly approved invoices:", newlyApprovedInvoices);
  };

  console.log("Current approved invoices:", approvedInvoices);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Original Payment Processing Section */}
      <div className="p-4 max-w-6xl mx-auto bg-white shadow-md rounded-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-green-600">
            Process for Payments
          </h1>
          <button
            onClick={handleDownloadTemplate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            ⬇️ Download Pre-Formatted Payment File ({approvedInvoices.length})
          </button>
        </div>

        <UploadPaymentFile onFileUpload={handleFileUpload} />

        {isModalOpen && (
          <PaymentPreviewModal
            data={parsedData}
            onClose={handleCloseModal}
            onRequestChanges={handleRequestChanges}
          />
        )}

        {editMode && (
          <EditPaymentDetails
            data={editableData}
            setData={setParsedData}
            onCancel={handleCloseModal}
          />
        )}
      </div>

      {/* New Vendor Invoice Management Section */}
      <div className="max-w-7xl mx-auto px-2 pb-4">
        <div className="bg-white overflow-hidden rounded shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] gap-0">
            {/* Left Part - Vendor Invoice Table */}
            <div className="border-r border-gray-200 h-full">
            <div className="p-2 bg-gray-100 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-800">
                Vendor Invoice Management
              </h2>
            </div>
            <div className="h-full overflow-y-auto">
              <VendorInvoiceTable
                vendorData={vendorData}
                onInvoiceSelect={handleInvoiceSelect}
                onPaymentUpdate={handlePaymentUpdate}
                invoicePayments={invoicePayments}
                onVendorDataUpdate={setVendorData}
                onInvoiceApprove={handleInvoiceApproval}
              />

            </div>
          </div>
            {/* Right Part - Invoice Viewer */}
            <div className="bg-gray-50 h-full">
            <div className="p-2 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-800">
                Invoice Display
              </h2>
            </div>
            <div className="h-full max-h-[calc(400px-40px)] overflow-y-auto">
              <InvoiceViewer selectedInvoice={selectedInvoice} />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}