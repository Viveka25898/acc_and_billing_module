/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import ViewInvoiceModal from "../Components/ViewInvoiceModal";
import RejectInvoiceModal from "../Components/RejectInvoiceModal";
import VoucherPreviewModal from "../Components/VoucherPreviewModal"; // JV Modal
import ExpenseVoucherModal from "../Components/ExpenseVoucherModal";


const dummyInvoices = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  invoiceNo: `INV-20${i + 1}`,
  vendorName: `Vendor ${i + 1}`,
  poNo: `PO-20${i + 1}`,
  gstin: `29AAACX1111Q${i}ZP`,
  amount: 10000 + i * 500,
  status: "pending",
  managerApproval: "approved",
  documentUrl: "/public/invoice.pdf",
  // Add expense type to differentiate
  expenseType: i % 3 === 0 ? "Professional Fees" : i % 3 === 1 ? "Office Maintenance" : "Consultancy",
  // Add some additional fields for expense voucher
  department: "Operations",
  costCenter: "GENERAL"
}));

export default function FinancialHeadInvoiceApprovalPage() {
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [rejectInvoice, setRejectInvoice] = useState(null);
  
  // Separate states for both voucher modals
  const [expenseVoucherData, setExpenseVoucherData] = useState(null);
  const [jvVoucherData, setJvVoucherData] = useState(null);
  const [showExpenseVoucher, setShowExpenseVoucher] = useState(false);
  const [showJVVoucher, setShowJVVoucher] = useState(false);
  
  const itemsPerPage = 5;

  // Prepare Expense Voucher Data with corrected logic
  const prepareExpenseVoucherData = (invoice) => {
    const tdsRate = 10; // You can make this dynamic based on expense type
    const invoiceAmount = invoice.amount || 0;
    const tdsAmount = Math.round((invoiceAmount * tdsRate) / 100);
    const payableAmount = invoiceAmount - tdsAmount;

    return {
      header: {
        company: "iSmart",
        voucherNo: `EXP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        date: new Date().toISOString().split('T')[0],
        reference: `${invoice.poNo}/${invoice.invoiceNo}`,
        preparedBy: "Finance Head",
        expenseType: invoice.expenseType || "General Expense",
        department: invoice.department || "Operations"
      },
      
      // Vendor details adapted for expense voucher structure
     vendorDetails: {
      vendorId: `VND-${invoice.id}`,
      vendorName: invoice.vendorName,
      vendorType: "External Vendor",
      department: "External Services",
      poNumber: invoice.poNo,
      invoiceNumber: invoice.invoiceNo,
      submissionDate: new Date().toISOString().split('T')[0],
      approvalDate: new Date().toISOString().split('T')[0]
    },
      // Expense details adapted for vendor invoice
      conveyanceDetails: [{
        id: 1,
        date: new Date().toISOString().split('T')[0],
        clientName: "ABC Enterprises", // Internal company
        fromLocation: "Vendor",
        toLocation: "Company",
        purpose: invoice.expenseType || "Professional Services",
        transport: "Invoice Payment", // Adapted field
        distance: "N/A",
        amount: invoiceAmount,
        billAttached: "Yes"
      }],

      // Corrected accounting entries for vendor invoice (3 entries only)
      entries: [
        {
          id: 1,
          particulars: `${invoice.expenseType} Expense`,
          gl: "5000", // Expense GL code
          costCenter: invoice.costCenter || "GENERAL",
          debit: invoiceAmount,
          credit: 0,
          note: `Invoice: ${invoice.invoiceNo}, Vendor: ${invoice.vendorName}`,
        },
        {
          id: 2,
          particulars: `Vendor Payable - ${invoice.vendorName}`,
          gl: "2000", // Vendor payable GL
          costCenter: "",
          debit: 0,
          credit: payableAmount,
          note: `Net amount payable after TDS deduction`,
        },
        {
          id: 3,
          particulars: "TDS Payable",
          gl: "2100", // TDS payable GL
          costCenter: "",
          debit: 0,
          credit: tdsAmount,
          note: `TDS liability to government @ ${tdsRate}%`,
        }
      ],

      approvals: {
        preparer: "Finance Head",
        reviewer: "Approved",
        approver: "Completed",
        date: new Date().toISOString().split('T')[0]
      }
    };
  };

  // Prepare JV Data for TDS effect with corrected logic
  const prepareJVData = (invoice) => {
    const tdsRate = 10;
    const invoiceAmount = invoice.amount || 0;
    const tdsAmount = Math.round((invoiceAmount * tdsRate) / 100);

    return {
      header: {
        company: "ABC Enterprises",
        voucherNo: `JV-TDS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        date: new Date().toISOString().split('T')[0],
        reference: `TDS Effect for ${invoice.invoiceNo}`,
        preparedBy: "Finance Head"
      },
      entries: [
        {
          id: 1,
          particulars: "TDS Receivable",
          gl: "1200", // TDS Receivable from vendor
          costCenter: "",
          debit: tdsAmount,
          credit: 0,
          note: `TDS @ ${tdsRate}% on Invoice ${invoice.invoiceNo} - ${invoice.vendorName}`,
        },
        {
          id: 2,
          particulars: "TDS Payable to Government",
          gl: "2100", // TDS Payable to government
          costCenter: "",
          debit: 0,
          credit: tdsAmount,
          note: `TDS liability for ${invoice.vendorName} - Invoice ${invoice.invoiceNo}`,
        }
      ],
      narration: `TDS effect entry for Invoice ${invoice.invoiceNo} from ${invoice.vendorName}. TDS @ ${tdsRate}% = ₹${tdsAmount.toFixed(2)} deducted and liability created for government payment.`,
      approvals: {
        preparer: "Finance Head",
        reviewer: "Auto Generated",
        approver: "System",
        date: new Date().toISOString().split('T')[0]
      },
      // Add invoice details for display
      invoiceNo: invoice.invoiceNo,
      vendorName: invoice.vendorName,
      amount: invoiceAmount,
      poNo: invoice.poNo
    };
  };

  const handleApprove = (id) => {
    const updatedInvoices = invoices.map((inv) =>
      inv.id === id ? { ...inv, status: "approved" } : inv
    );
    setInvoices(updatedInvoices);

    // Get the approved invoice
    const approvedInvoice = updatedInvoices.find((inv) => inv.id === id);
    
    // Prepare both voucher data
    const expenseData = prepareExpenseVoucherData(approvedInvoice);
    const jvData = prepareJVData(approvedInvoice);
    
    // Set both data and show expense voucher first
    setExpenseVoucherData(expenseData);
    setJvVoucherData(jvData);
    setShowExpenseVoucher(true);
  };

  // Handle closing expense voucher and showing JV automatically
  const handleExpenseVoucherClose = () => {
    setShowExpenseVoucher(false);
    setExpenseVoucherData(null);
    
    // Automatically show JV modal after expense voucher closes
    setTimeout(() => {
      setShowJVVoucher(true);
    }, 300);
  };

  // Handle closing JV voucher
  const handleJVVoucherClose = () => {
    setShowJVVoucher(false);
    setJvVoucherData(null);
  };

  // Handle manual voucher view (for already approved invoices)
  const handleViewVoucher = (invoice, voucherType) => {
    if (voucherType === 'expense') {
      const expenseData = prepareExpenseVoucherData(invoice);
      setExpenseVoucherData(expenseData);
      setShowExpenseVoucher(true);
    } else if (voucherType === 'jv') {
      const jvData = prepareJVData(invoice);
      setJvVoucherData(jvData);
      setShowJVVoucher(true);
    }
  };

  const handleReject = (id, reason) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? { ...inv, status: "rejected", rejectionReason: reason }
          : inv
      )
    );
    setRejectInvoice(null);
  };

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.poNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.vendorName.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusTag = (status) => {
    const base = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case "approved":
        return `${base} bg-green-100 text-green-700`;
      case "rejected":
        return `${base} bg-red-100 text-red-700`;
      case "pending":
      default:
        return `${base} bg-yellow-100 text-yellow-700`;
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-green-600">Financial Head Invoice Approval</h1>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by vendor, invoice or PO number"
          className="border rounded px-4 py-2 w-full md:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/4"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Invoice No</th>
              <th className="border p-2">Vendor</th>
              <th className="border p-2">PO No</th>
              <th className="border p-2">Expense Type</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Manager Status</th>
              <th className="border p-2">Finance Status</th>
              <th className="border p-2">Invoice View</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((inv) => (
              <tr key={inv.id} className="text-center">
                <td className="border p-2">{inv.invoiceNo}</td>
                <td className="border p-2">{inv.vendorName}</td>
                <td className="border p-2">{inv.poNo}</td>
                <td className="border p-2">{inv.expenseType}</td>
                <td className="border p-2">₹{inv.amount.toLocaleString()}</td>
                <td className="border p-2 text-green-700 font-semibold">Approved</td>
                <td className="border p-2">
                  <span className={getStatusTag(inv.status)}>{inv.status}</span>
                </td>
                <td className="border p-2">
                  <FaEye
                    onClick={() => setViewInvoice(inv)}
                    className="text-blue-600 cursor-pointer mx-auto"
                  />
                </td>
                <td className="border p-2">
                  <div className="flex flex-col gap-1">
                    {inv.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(inv.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectInvoice(inv)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    {inv.status === "approved" && (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleViewVoucher(inv, 'expense')}
                          className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 text-xs"
                        >
                          Expense Voucher
                        </button>
                        <button
                          onClick={() => handleViewVoucher(inv, 'jv')}
                          className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 text-xs"
                        >
                          TDS Journal
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modals */}
      {viewInvoice && (
        <ViewInvoiceModal
          invoice={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}

      {rejectInvoice && (
        <RejectInvoiceModal
          invoice={rejectInvoice}
          onClose={() => setRejectInvoice(null)}
          onConfirm={(reason) => handleReject(rejectInvoice.id, reason)}
        />
      )}

      {/* Expense Voucher Modal */}
      {showExpenseVoucher && expenseVoucherData && (
        <ExpenseVoucherModal
          data={expenseVoucherData}
          onClose={handleExpenseVoucherClose}
        />
      )}

      {/* TDS Journal Voucher Modal */}
      {showJVVoucher && jvVoucherData && (
        <VoucherPreviewModal
          invoice={jvVoucherData}
          onClose={handleJVVoucherClose}
        />
      )}
    </div>
  );
}