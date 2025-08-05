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
      { id: 101, invoiceNumber: "INV-2024-001", amount: 15000, documentUrl: "/public/DxotBTxfHn.png" },
      { id: 102, invoiceNumber: "INV-2024-002", amount: 25000, documentUrl: "/public/DxotBTxfHn.png" },
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
      { id: 201, invoiceNumber: "INV-2024-003", amount: 45000, documentUrl: "/public/DxotBTxfHn.png" },
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
      { id: 301, invoiceNumber: "INV-2024-004", amount: 30000, documentUrl: "/public/DxotBTxfHn.png" },
      { id: 302, invoiceNumber: "INV-2024-005", amount: 18000, documentUrl: "/public/DxotBTxfHn.png" },
      { id: 303, invoiceNumber: "INV-2024-006", amount: 22000, documentUrl: "/public/DxotBTxfHn.png" },
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
      { id: 401, invoiceNumber: "INV-2024-007", amount: 55000, documentUrl: "/public/DxotBTxfHn.png" },
      { id: 402, invoiceNumber: "INV-2024-008", amount: 12000, documentUrl: "/public/DxotBTxfHn.png" },
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

  // 🔥 NEW: Generate System Upload File
  const generateSystemUploadFile = (approvedInvoices) => {
    // Group approved invoices by vendor
    const vendorGroups = {};
    
    approvedInvoices.forEach(invoice => {
      if (!vendorGroups[invoice.vendorId]) {
        vendorGroups[invoice.vendorId] = {
          vendorName: invoice.vendorName,
          invoices: []
        };
      }
      vendorGroups[invoice.vendorId].invoices.push(invoice);
    });

    // Create system upload data
    const systemUploadData = [];
    
    Object.values(vendorGroups).forEach(vendor => {
      const totalOriginalAmount = vendor.invoices.reduce((sum, inv) => sum + inv.originalAmount, 0);
      const totalPaidAmount = vendor.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
      const totalRemainingAmount = totalOriginalAmount - totalPaidAmount;
      
      const invoiceNumbers = vendor.invoices.map(inv => inv.invoiceNumber).join(', ');
      
      systemUploadData.push({
        'Vendor Name': vendor.vendorName,
        'Invoice Numbers': invoiceNumbers,
        'Total Amount': totalOriginalAmount,
        'Payment Done': totalPaidAmount,
        'Remaining Payment': totalRemainingAmount,
        'UTR': ''
      });
    });

    return systemUploadData;
  };

  // 🔥 UPDATED: Download function now generates both files
  const handleDownloadTemplate = () => {
    if (approvedInvoices.length === 0) {
      toast.warning("No approved invoices found. Please approve some invoices first.");
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');

    // 1. Generate Bank Upload File - GROUP BY VENDOR
    const vendorPaymentGroups = {};
    
    // Group approved invoices by vendor for bank file
    approvedInvoices.forEach(invoice => {
      const vendorKey = invoice.vendorId;
      
      if (!vendorPaymentGroups[vendorKey]) {
        vendorPaymentGroups[vendorKey] = {
          debitBankAccountNumber: invoice.debitBankAccountNumber,
          totalPaidAmount: 0,
          currency: invoice.currency,
          beneficiaryAccountNumber: invoice.beneficiaryAccountNumber,
          ifscCode: invoice.ifscCode,
          narration: invoice.narration,
          vendorName: invoice.vendorName
        };
      }
      
      // Add this invoice's paid amount to vendor total
      vendorPaymentGroups[vendorKey].totalPaidAmount += invoice.paidAmount;
    });

    // Convert grouped data to bank upload format
    const bankUploadData = Object.values(vendorPaymentGroups).map(vendor => ({
      'DEBIT BANK A/C NO': vendor.debitBankAccountNumber,
      'DEBIT AMT': vendor.totalPaidAmount,
      'CUR': vendor.currency,
      'BENEFICIARY A/C NO': vendor.beneficiaryAccountNumber,
      'IFSC CODE': vendor.ifscCode,
      'NARRATION/NAME': vendor.narration,
      'UTR': "",
    }));

    // Create Bank Upload Excel file
    const bankWorksheet = XLSX.utils.json_to_sheet(bankUploadData);
    const bankWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(bankWorkbook, bankWorksheet, "Bank_Payment_File");

    // Auto-size columns for bank file
    const bankColWidths = [];
    const bankHeaders = Object.keys(bankUploadData[0] || {});
    bankHeaders.forEach((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...bankUploadData.map(row => String(row[header] || '').length)
      );
      bankColWidths[index] = { width: Math.min(maxLength + 2, 30) };
    });
    bankWorksheet['!cols'] = bankColWidths;

    const bankExcelBuffer = XLSX.write(bankWorkbook, {
      bookType: "xlsx",
      type: "array",
    });
    
    const bankBlob = new Blob([bankExcelBuffer], {
      type: "application/octet-stream",
    });
    
    saveAs(bankBlob, `Bank_Payment_File_${timestamp}.xlsx`);

    // 2. Generate System Upload File (new functionality)
    const systemUploadData = generateSystemUploadFile(approvedInvoices);

    // Create System Upload Excel file
    const systemWorksheet = XLSX.utils.json_to_sheet(systemUploadData);
    const systemWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(systemWorkbook, systemWorksheet, "System_Upload_File");

    // Auto-size columns for system file
    const systemColWidths = [];
    const systemHeaders = Object.keys(systemUploadData[0] || {});
    systemHeaders.forEach((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...systemUploadData.map(row => String(row[header] || '').length)
      );
      systemColWidths[index] = { width: Math.min(maxLength + 2, 40) };
    });
    systemWorksheet['!cols'] = systemColWidths;

    const systemExcelBuffer = XLSX.write(systemWorkbook, {
      bookType: "xlsx",
      type: "array",
    });
    
    const systemBlob = new Blob([systemExcelBuffer], {
      type: "application/octet-stream",
    });
    
    saveAs(systemBlob, `System_Upload_File_${timestamp}.xlsx`);
    
    const downloadedCount = approvedInvoices.length;
    const vendorCount = Object.keys(vendorPaymentGroups).length; // Use actual vendor count from bank file
    
    // 🔥 CLEAR approved invoices after successful download
    setApprovedInvoices([]);
    
    toast.success(`Both files downloaded successfully! Bank file: ${vendorCount} vendors (${downloadedCount} invoices), System file: ${vendorCount} vendors. Ready for new approvals.`);
    
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
            ⬇️ Download Pre-Formatted Payment Files ({approvedInvoices.length})
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