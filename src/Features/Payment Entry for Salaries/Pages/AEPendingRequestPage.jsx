import React, { useRef, useState } from 'react';
import PaymentEntriesFilter from "../Components/PaymentEntriesFilter";
import AERejectionModal from "../Components/AERejectionModal";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export default function AEPendingRequestsPage() {
  // 🔥 NEW: Sample payroll batch data instead of individual employees
  const [payrollBatches, setPayrollBatches] = useState([
    {
      id: 1,
      batchName: "Aug 2025 Salary - Batch 1",
      type: "NEFT",
      debitAccount: "1234567890123",
      totalAmount: 223000,
      currency: "INR",
      narration: "Aug 2025 Salary",
      status: "Pending",
      reason: "",
      uploadedAt: "2025-08-02T10:30:00Z",
      excelFileName: "Aug_2025_Salary_Batch1.xlsx",
      employees: [
        { id: 101, code: "EMP001", name: "Raj Kumar", amount: 45000, account: "9876543210001", ifsc: "HDFC0001234" },
        { id: 102, code: "EMP002", name: "Anjali Singh", amount: 52000, account: "9876543210002", ifsc: "ICIC0005678" },
        { id: 103, code: "EMP003", name: "Mike Johnson", amount: 38000, account: "9876543210003", ifsc: "SBIN0007890" },
        { id: 104, code: "EMP004", name: "Sarah Wilson", amount: 41000, account: "9876543210004", ifsc: "YESB0004567" },
        { id: 105, code: "EMP005", name: "David Brown", amount: 47000, account: "9876543210005", ifsc: "AXIS0009876" }
      ]
    },
    {
      id: 2,
      batchName: "Aug 2025 Salary - Batch 2", 
      type: "NEFT",
      debitAccount: "1234567890123",
      totalAmount: 189000,
      currency: "INR",
      narration: "Aug 2025 Salary",
      status: "Pending",
      reason: "",
      uploadedAt: "2025-08-02T11:15:00Z",
      excelFileName: "Aug_2025_Salary_Batch2.xlsx",
      employees: [
        { id: 201, code: "EMP006", name: "Lisa Chen", amount: 43000, account: "9876543210006", ifsc: "HDFC0001234" },
        { id: 202, code: "EMP007", name: "Robert Taylor", amount: 49000, account: "9876543210007", ifsc: "ICIC0005678" },
        { id: 203, code: "EMP008", name: "Maria Garcia", amount: 39000, account: "9876543210008", ifsc: "SBIN0007890" },
        { id: 204, code: "EMP009", name: "James Wilson", amount: 58000, account: "9876543210009", ifsc: "YESB0004567" }
      ]
    },
    {
      id: 3,
      batchName: "July 2025 Salary - Batch 1",
      type: "NEFT", 
      debitAccount: "1234567890123",
      totalAmount: 156000,
      currency: "INR",
      narration: "July 2025 Salary",
      status: "Approved",
      reason: "",
      uploadedAt: "2025-07-31T14:20:00Z",
      excelFileName: "July_2025_Salary_Batch1.xlsx",
      employees: [
        { id: 301, code: "EMP010", name: "Alex Kumar", amount: 52000, account: "9876543210010", ifsc: "HDFC0001234" },
        { id: 302, code: "EMP011", name: "Nina Patel", amount: 48000, account: "9876543210011", ifsc: "ICIC0005678" },
        { id: 303, code: "EMP012", name: "Tom Anderson", amount: 56000, account: "9876543210012", ifsc: "SBIN0007890" }
      ]
    }
  ]);

  const [filters, setFilters] = useState({ name: "", code: "", status: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  // 🔥 NEW: States for expanded rows and editing
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [editingAmount, setEditingAmount] = useState({});
  const fileInputRef = useRef(null);

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentRejectId, setCurrentRejectId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // For Sorting
  const getStatusOrder = (status) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Approved":
        return 2;
      case "Rejected":
        return 3;
      default:
        return 4;
    }
  };

  // 🔥 UPDATED: Filter by batch name instead of individual employee
  const filteredBatches = payrollBatches.filter((batch) => {
    const matchStatus = filters.status === "All" || batch.status === filters.status;
    const matchName = batch.batchName.toLowerCase().includes(filters.name.toLowerCase());
    const matchCode = batch.narration.toLowerCase().includes(filters.code.toLowerCase());
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

  // 🔥 NEW: Handle batch expansion
  const handleBatchClick = (batchId) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId);
  };

  // 🔥 NEW: Handle amount editing
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

    setPayrollBatches(prev => prev.map(batch => 
      batch.id === batchId ? { ...batch, totalAmount: newAmount } : batch
    ));

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

  // 🔥 NEW: Download Excel file for editing
  const handleDownloadExcel = (batch) => {
    const employeeData = batch.employees.map(emp => ({
      "TYPE": batch.type,
      "DEBIT BANK A/C NO": batch.debitAccount,
      "DEBIT AMT": emp.amount,
      "CUR": batch.currency,
      "BENEFICIARY A/C NO": emp.account,
      "IFSC CODE": emp.ifsc,
      "NARRATION/NAME (NOT MORE THAN 20)": emp.name
    }));

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
    link.download = batch.excelFileName;
    link.click();

    toast.success("Excel file downloaded for editing!");
  };

  // 🔥 NEW: Delete and reupload functionality
  const handleDeleteBatch = (batchId) => {
    if (window.confirm("Are you sure you want to delete this batch? This action cannot be undone.")) {
      setPayrollBatches(prev => prev.filter(batch => batch.id !== batchId));
      toast.success("Batch deleted successfully!");
    }
  };

  const handleReupload = (batchId) => {
    fileInputRef.current.dataset.batchId = batchId;
    fileInputRef.current.click();
  };

  const handleFileReupload = (e) => {
    const file = e.target.files[0];
    const batchId = parseInt(e.target.dataset.batchId);
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const parsedData = XLSX.utils.sheet_to_json(ws, { defval: "" });

      // Process the uploaded data
      const updatedEmployees = parsedData.map((row, index) => ({
        id: Date.now() + index,
        code: `EMP${(Date.now() + index).toString().slice(-3)}`,
        name: row["NARRATION/NAME (NOT MORE THAN 20)"] || `Employee ${index + 1}`,
        amount: parseFloat(row["DEBIT AMT"] || 0),
        account: row["BENEFICIARY A/C NO"] || "",
        ifsc: row["IFSC CODE"] || ""
      }));

      const newTotalAmount = updatedEmployees.reduce((sum, emp) => sum + emp.amount, 0);

      setPayrollBatches(prev => prev.map(batch => 
        batch.id === batchId ? {
          ...batch,
          employees: updatedEmployees,
          totalAmount: newTotalAmount,
          excelFileName: file.name
        } : batch
      ));

      toast.success("Excel file reuploaded successfully!");
    };
    reader.readAsBinaryString(file);

    // Clear the input
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

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) {
      toast.warn("Please select at least one batch to approve.");
      return;
    }
    setPayrollBatches((prev) =>
      prev.map((batch) =>
        selectedIds.includes(batch.id) ? { ...batch, status: "Approved" } : batch
      )
    );
    setSelectedIds([]);
    toast.success(`${selectedIds.length} batches Accepted and Payment Entry Passed in the System!!`);
  };

  const handleApprove = (id) => {
    setPayrollBatches((prev) =>
      prev.map((batch) =>
        batch.id === id ? { ...batch, status: "Approved" } : batch
      )
    );
    toast.success("Batch Accepted and Payment Entry Passed in the System!");
  };

  const openRejectModal = (id) => {
    setCurrentRejectId(id);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    setPayrollBatches((prev) =>
      prev.map((batch) =>
        batch.id === currentRejectId
          ? { ...batch, status: "Rejected", reason: rejectionReason }
          : batch
      )
    );
    setShowRejectModal(false);
    setRejectionReason("");
    setCurrentRejectId(null);
    toast.error("Payment Batch Rejected!");
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-green-600 mb-6">
        Pending Salary Payment Approvals
      </h1>

      <PaymentEntriesFilter filters={filters} onChange={setFilters} />

      {/* Hidden file input for reuploading */}
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
                    paginatedBatches.every((batch) => selectedIds.includes(batch.id))
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-2 border">TYPE</th>
              <th className="p-2 border">DEBIT BANK A/C NO</th>
              <th className="p-2 border">DEBIT AMT</th>
              <th className="p-2 border">CUR</th>
              <th className="p-2 border">NARRATION/NAME</th>
              <th className="p-2 border">Excel File</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBatches.map((batch) => (
              <React.Fragment key={batch.id}>
                {/* Main batch row */}
                <tr className="border-t hover:bg-gray-50">
                  <td className="p-2 border">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(batch.id)}
                      onChange={() => handleSelect(batch.id)}
                      disabled={batch.status !== "Pending"}
                    />
                  </td>
                  <td className="p-2 border font-medium">{batch.type}</td>
                  <td className="p-2 border">{batch.debitAccount}</td>
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
                          ₹{batch.totalAmount.toLocaleString()}
                        </span>
                        {batch.status === "Pending" && (
                          <button
                            onClick={() => handleAmountEdit(batch.id, batch.totalAmount)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            ✏️
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-2 border">{batch.currency}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleBatchClick(batch.id)}
                      className="text-blue-600 hover:text-blue-800 underline text-left"
                    >
                      {batch.narration}
                      <span className="ml-2 text-xs text-gray-500">
                        ({batch.employees.length} employees)
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
                      {batch.status === "Pending" && (
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
                      batch.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      batch.status === "Approved" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    {batch.status === "Pending" ? (
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

                {/* Expanded employee details */}
                {expandedBatch === batch.id && (
                  <tr>
                    <td colSpan="9" className="p-0 border-0">
                      <div className="bg-gray-50 border-t border-b">
                        <div className="p-3">
                          <h4 className="font-semibold text-sm mb-2 text-gray-700">
                            Employee Details ({batch.employees.length} employees)
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
                                {batch.employees.map((employee) => (
                                  <tr key={employee.id} className="border-t">
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
            ))}
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

      {/* Pagination */}
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

      {/* Rejection Modal */}
      <AERejectionModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={{
          reasonChange: setRejectionReason,
          confirm: confirmReject,
        }}
      />
    </div>
  );
}