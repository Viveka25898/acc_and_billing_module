/* eslint-disable no-undef */
import React, { useRef, useState, useEffect } from 'react';
import PaymentEntriesFilter from "../Components/PaymentEntriesFilter";
import AERejectionModal from "../Components/AERejectionModal";
import SalaryPaymentEntryModal from "../Components/SalaryPaymentEntryModal"; // Import the modal
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export default function AEPendingRequestsPage() {
  // Initialize state with data from localStorage
  const [payrollBatches, setPayrollBatches] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user')) || { username: 'ae1', role: 'ae' };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedBatches = JSON.parse(localStorage.getItem('salaryPayments')) || [];
    // Filter batches assigned to the current user
    const filteredBatches = savedBatches.filter(batch => batch.assignedTo === currentUser.username);
    setPayrollBatches(filteredBatches);
  }, [currentUser.username]);

  // Save to localStorage whenever payrollBatches changes
  useEffect(() => {
    const allPayments = JSON.parse(localStorage.getItem('salaryPayments')) || [];
    const updatedPayments = allPayments.map(payment => {
      const updatedBatch = payrollBatches.find(b => b.id === payment.id);
      return updatedBatch || payment;
    });
    localStorage.setItem('salaryPayments', JSON.stringify(updatedPayments));
  }, [payrollBatches]);

  // Rest of your existing state
  const [filters, setFilters] = useState({ name: "", code: "", status: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [editingAmount, setEditingAmount] = useState({});
  const fileInputRef = useRef(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentRejectId, setCurrentRejectId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // NEW STATE FOR PAYMENT ENTRY MODAL
  const [showPaymentEntryModal, setShowPaymentEntryModal] = useState(false);
  const [approvedBatchData, setApprovedBatchData] = useState(null);
  const [approvedBatches, setApprovedBatches] = useState([]); // For bulk approval

  // For Sorting
  const getStatusOrder = (status) => {
    switch (status) {
      case "Pending Approval":
        return 1;
      case "Approved":
        return 2;
      case "Rejected":
        return 3;
      default:
        return 4;
    }
  };

  // Filter by payroll period and status
  const filteredBatches = payrollBatches.filter((batch) => {
    const matchStatus = filters.status === "All" || batch.status === filters.status;
    const matchName = batch.payrollPeriod.toLowerCase().includes(filters.name.toLowerCase());
    const matchCode = batch.id.toLowerCase().includes(filters.code.toLowerCase());
    return matchStatus && matchName && matchCode;
  });

  // Sort the filtered batches by status order before paginating
  const sortedBatches = [...filteredBatches].sort((a, b) => {
    return getStatusOrder(a.status) - getStatusOrder(b.status);
  });

  const totalPages = Math.ceil(sortedBatches.length / entriesPerPage);
  const paginatedBatches = sortedBatches.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Convert your data structure to match the table display
  const getTableData = (batch) => ({
    id: batch.id,
    batchName: `${batch.payrollPeriod} - ${batch.id.slice(-4)}`,
    type: batch.bankFile?.TYPE || "NEFT",
    debitAccount: batch.bankFile?.["DEBIT BANK A/C NO"] || "",
    totalAmount: batch.totalAmount,
    currency: batch.bankFile?.CUR || "INR",
    narration: batch.payrollPeriod,
    status: batch.status,
    excelFileName: `salary_batch_${batch.id}.xlsx`,
    employees: batch.employeeDetails?.map(emp => ({
      id: emp["BENEFICIARY A/C NO"],
      code: emp["BENEFICIARY A/C NO"]?.slice(-6),
      name: emp["NARRATION/NAME (NOT MORE THAN 20)"],
      amount: emp["DEBIT AMT"],
      account: emp["BENEFICIARY A/C NO"],
      ifsc: emp["IFSC CODE"]
    })) || []
  });

  // Handle batch expansion
  const handleBatchClick = (batchId) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId);
  };

  // Handle amount editing
  const handleAmountEdit = (batchId, newAmount) => {
    setEditingAmount(prev => ({
      ...prev,
      [batchId]: newAmount
    }));
  };

  const saveAmountEdit = (batchId) => {
    const newAmount = parseFloat(editingAmount[batchId]);
    if (isNaN(newAmount) || newAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setPayrollBatches(prev => prev.map(batch => {
      if (batch.id === batchId) {
        const ratio = newAmount / batch.totalAmount;
        const updatedEmployeeDetails = batch.employeeDetails.map(emp => ({
          ...emp,
          "DEBIT AMT": emp["DEBIT AMT"] * ratio
        }));
        
        return {
          ...batch,
          totalAmount: newAmount,
          employeeDetails: updatedEmployeeDetails,
          bankFile: {
            ...batch.bankFile,
            "DEBIT AMT": newAmount
          }
        };
      }
      return batch;
    }));

    setEditingAmount(prev => {
      const updated = { ...prev };
      delete updated[batchId];
      return updated;
    });

    toast.success("Amount updated successfully!");
  };

  const cancelAmountEdit = (batchId) => {
    setEditingAmount(prev => {
      const updated = { ...prev };
      delete updated[batchId];
      return updated;
    });
  };

  // Download Excel file for editing
  const handleDownloadExcel = (batch) => {
    const employeeData = batch.employeeDetails?.map(emp => ({
      "TYPE": batch.bankFile?.TYPE || "NEFT",
      "DEBIT BANK A/C NO": batch.bankFile?.["DEBIT BANK A/C NO"] || "",
      "DEBIT AMT": emp["DEBIT AMT"],
      "CUR": batch.bankFile?.CUR || "INR",
      "BENEFICIARY A/C NO": emp["BENEFICIARY A/C NO"],
      "IFSC CODE": emp["IFSC CODE"],
      "NARRATION/NAME (NOT MORE THAN 20)": emp["NARRATION/NAME (NOT MORE THAN 20)"]
    })) || [];

    const ws = XLSX.utils.json_to_sheet(employeeData);
    ws["!cols"] = [
      { wch: 10 }, { wch: 20 }, { wch: 12 }, { wch: 8 }, { wch: 20 }, { wch: 15 }, { wch: 25 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employee_Data");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `salary_batch_${batch.id}.xlsx`;
    link.click();

    toast.success("Excel file downloaded for editing!");
  };

  // Delete batch functionality
  const handleDeleteBatch = (batchId) => {
    if (window.confirm("Are you sure you want to delete this batch? This action cannot be undone.")) {
      setPayrollBatches(prev => prev.filter(batch => batch.id !== batchId));
      toast.success("Batch deleted successfully!");
    }
  };

  // File reupload functionality
  const handleReupload = (batchId) => {
    fileInputRef.current.dataset.batchId = batchId;
    fileInputRef.current.click();
  };

  const handleFileReupload = (e) => {
    const file = e.target.files[0];
    const batchId = e.target.dataset.batchId;
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsedData = XLSX.utils.sheet_to_json(ws, { defval: "" });

        const newTotalAmount = parsedData.reduce((sum, row) => sum + (parseFloat(row["DEBIT AMT"]) || 0), 0);
        const employeeCount = parsedData.length;

        setPayrollBatches(prev => prev.map(batch => {
          if (batch.id === batchId) {
            return {
              ...batch,
              employeeDetails: parsedData,
              employeeCount,
              totalAmount: newTotalAmount,
              bankFile: {
                ...batch.bankFile,
                "DEBIT AMT": newTotalAmount
              },
              history: [
                ...batch.history,
                {
                  action: "reuploaded",
                  by: currentUser.username,
                  date: new Date().toISOString(),
                  comments: "File reuploaded"
                }
              ]
            };
          }
          return batch;
        }));

        toast.success("Excel file reuploaded successfully!");
      } catch (error) {
        toast.error("Error processing the file: " + error.message);
      }
    };
    reader.readAsBinaryString(file);

    e.target.value = "";
  };

  // Multiple Select and Approve
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = paginatedBatches.map((batch) => batch.id);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : allIds);
  };

  // NEW: Handle bulk approval with modal
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) {
      toast.warn("Please select at least one batch to approve.");
      return;
    }

    const updatedBatches = payrollBatches.map(batch => {
      if (selectedIds.includes(batch.id)) {
        return {
          ...batch,
          status: "Approved",
          history: [
            ...batch.history,
            {
              action: "approved",
              by: currentUser.username,
              date: new Date().toISOString(),
              comments: "Bulk approved by AE"
            }
          ]
        };
      }
      return batch;
    });

    setPayrollBatches(updatedBatches);
    
    // Get the approved batches data for the modal
    const approvedBatchData = payrollBatches.filter(batch => selectedIds.includes(batch.id));
    setApprovedBatches(approvedBatchData);
    setApprovedBatchData(null); // Clear single batch data
    setShowPaymentEntryModal(true);
    
    setSelectedIds([]);
    toast.success(`${selectedIds.length} batches approved!`);
  };

  // NEW: Handle single approval with modal
  const handleApprove = (id) => {
    const updatedBatches = payrollBatches.map(batch => {
      if (batch.id === id) {
        return {
          ...batch,
          status: "Approved",
          history: [
            ...batch.history,
            {
              action: "approved",
              by: currentUser.username,
              date: new Date().toISOString(),
              comments: "Approved by AE"
            }
          ]
        };
      }
      return batch;
    });

    setPayrollBatches(updatedBatches);
    
    // Get the approved batch data for the modal
    const approvedBatch = payrollBatches.find(batch => batch.id === id);
    setApprovedBatchData(approvedBatch);
    setApprovedBatches([]); // Clear bulk batches data
    setShowPaymentEntryModal(true);
    
    toast.success("Batch approved!");
  };

  const openRejectModal = (id) => {
    setCurrentRejectId(id);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    setPayrollBatches(prev => prev.map(batch => {
      if (batch.id === currentRejectId) {
        return {
          ...batch,
          status: "Rejected",
          reason: rejectionReason,
          history: [
            ...batch.history,
            {
              action: "rejected",
              by: currentUser.username,
              date: new Date().toISOString(),
              comments: rejectionReason
            }
          ]
        };
      }
      return batch;
    }));
    
    setShowRejectModal(false);
    setRejectionReason("");
    setCurrentRejectId(null);
    toast.error("Payment Batch Rejected!");
  };

  // NEW: Close payment entry modal
  const closePaymentEntryModal = () => {
    setShowPaymentEntryModal(false);
    setApprovedBatchData(null);
    setApprovedBatches([]);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-green-600 mb-6">
        Pending Salary Payment Approvals
      </h1>

      <PaymentEntriesFilter filters={filters} onChange={setFilters} />

      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls, .csv"
        onChange={handleFileReupload}
        className="hidden"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">
                <input
                  type="checkbox"
                  checked={
                    paginatedBatches.length > 0 &&
                    paginatedBatches.every(batch => selectedIds.includes(batch.id))
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-2 border">TYPE</th>
              <th className="p-2 border">DEBIT BANK A/C NO</th>
              <th className="p-2 border">DEBIT AMT</th>
              <th className="p-2 border">CUR</th>
              <th className="p-2 border">PAYROLL PERIOD</th>
              <th className="p-2 border">Excel File</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBatches.map(batch => {
              const tableData = getTableData(batch);
              return (
                <React.Fragment key={batch.id}>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-2 border">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(batch.id)}
                        onChange={() => handleSelect(batch.id)}
                        disabled={batch.status !== "Pending Approval"}
                      />
                    </td>
                    <td className="p-2 border font-medium">{tableData.type}</td>
                    <td className="p-2 border">{tableData.debitAccount}</td>
                    <td className="p-2 border">
                      {editingAmount[batch.id] !== undefined ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editingAmount[batch.id]}
                            onChange={(e) => handleAmountEdit(batch.id, e.target.value)}
                            className="w-24 px-1 py-1 border rounded text-xs"
                          />
                          <button
                            onClick={() => saveAmountEdit(batch.id)}
                            className="bg-green-600 text-white px-1 py-1 rounded text-xs"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => cancelAmountEdit(batch.id)}
                            className="bg-gray-500 text-white px-1 py-1 rounded text-xs"
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">
                            ₹{tableData.totalAmount.toLocaleString()}
                          </span>
                          {tableData.status === "Pending Approval" && (
                            <button
                              onClick={() => handleAmountEdit(batch.id, tableData.totalAmount)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-2 border">{tableData.currency}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleBatchClick(batch.id)}
                        className="text-blue-600 hover:text-blue-800 underline text-left"
                      >
                        {tableData.narration}
                        <span className="ml-2 text-xs text-gray-500">
                          ({tableData.employees.length} employees)
                          {expandedBatch === batch.id ? " ▼" : " ▶"}
                        </span>
                      </button>
                    </td>
                    <td className="p-2 border">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleDownloadExcel(batch)}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          📥 Download
                        </button>
                        {tableData.status === "Pending Approval" && (
                          <>
                            <button
                              onClick={() => handleReupload(batch.id)}
                              className="bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700"
                            >
                              🔄 Reupload
                            </button>
                            <button
                              onClick={() => handleDeleteBatch(batch.id)}
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tableData.status === "Pending Approval" ? "bg-yellow-100 text-yellow-800" :
                        tableData.status === "Approved" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {tableData.status}
                      </span>
                    </td>
                    <td className="p-2 border">
                      {tableData.status === "Pending Approval" ? (
                        <div className="flex gap-1 flex-wrap">
                          <button
                            onClick={() => handleApprove(batch.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(batch.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs italic text-gray-500">Action taken</span>
                      )}
                    </td>
                  </tr>

                  {expandedBatch === batch.id && (
                    <tr>
                      <td colSpan="9" className="p-0 border-0">
                        <div className="bg-gray-50 border-t border-b">
                          <div className="p-3">
                            <h4 className="font-semibold text-sm mb-2 text-gray-700">
                              Employee Details ({tableData.employees.length} employees)
                            </h4>
                            <div className="max-h-60 overflow-y-auto">
                              <table className="w-full text-xs border border-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="p-2 border">Code</th>
                                    <th className="p-2 border">Name</th>
                                    <th className="p-2 border">Account</th>
                                    <th className="p-2 border">IFSC</th>
                                    <th className="p-2 border">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {tableData.employees.map((employee, index) => (
                                    <tr key={index} className="border-t">
                                      <td className="p-2 border">{employee.code}</td>
                                      <td className="p-2 border">{employee.name}</td>
                                      <td className="p-2 border">{employee.account}</td>
                                      <td className="p-2 border">{employee.ifsc}</td>
                                      <td className="p-2 border">₹{employee.amount.toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {selectedIds.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleBulkApprove}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Approve Selected ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end items-center mt-4 gap-4 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <AERejectionModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={{
          reasonChange: setRejectionReason,
          confirm: confirmReject,
        }}
      />

      {/* NEW: Payment Entry Modal */}
      <SalaryPaymentEntryModal
        isOpen={showPaymentEntryModal}
        onClose={closePaymentEntryModal}
        batchData={approvedBatchData}
        approvedBatches={approvedBatches}
      />
    </div>
  );
}