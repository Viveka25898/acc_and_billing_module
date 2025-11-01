import React from 'react';

const ConveyanceExpenseVoucher = ({ data = {}, onClose }) => {
    console.log(data);
  // Extract data from the approved request
  const header = data.header || {
    company: data.company || "Company Name",
    voucherNo: data.voucherNo || `EXP-CONV-${new Date().getFullYear()}-001`,
    financialYear: data.financialYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    date: data.date || new Date().toISOString().split('T')[0],
    reference: data.reference || "Employee Conveyance Claims",
    preparedBy: data.preparedBy || "Billing Manager",
    expenseType: "Conveyance Expense",
    department: data.department || "Department",
    approvalChain: data.approvalChain || "Manager → VP → Account Executive"
  };

  // Employee details from the approved request
  const employeeDetails = data.employeeDetails || {
    employeeId: data.employeeId || "EMP001",
    employeeName: data.employeeName || "Employee Name",
    designation: data.designation || "Designation",
    department: data.department || "Department",
    manager: data.manager || "Manager Name",
    submissionDate: data.submissionDate || new Date().toISOString().split('T')[0],
    approvalDate: data.approvalDate || new Date().toISOString().split('T')[0]
  };

  // Conveyance details from the approved request
  const conveyanceDetails = data.conveyanceDetails || [{
    id: 1,
    date: data.date || new Date().toISOString().split('T')[0],
    clientName: data.client || "Client Name",
    fromLocation: data.fromLocation || "From Location",
    toLocation: data.toLocation || "To Location",
    purpose: data.purpose || "Purpose of visit",
    transport: data.transport || "Transport Mode",
    distance: data.distance || "0 km",
    amount: data.amount || 0,
    billAttached: data.receipts && data.receipts.length > 0 ? "Yes" : "No"
  }];

  const totalConveyanceAmount = conveyanceDetails.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // Get real GL entries from transaction or use provided glEntries
  const glEntriesFromTransaction = data.glEntries || data.entries || [];
  
  // Get chart of accounts for GL names
  const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
  const getGLName = (glCode) => {
    const account = chartOfAccounts.find(acc => acc.code === glCode);
    return account?.name || glCode || 'N/A';
  };

  // Convert transaction entries to voucher lines format
  const lines = glEntriesFromTransaction.length > 0 
    ? glEntriesFromTransaction.map((entry, index) => ({
        id: index + 1,
        particulars: entry.glName || getGLName(entry.glCode) || 'Account',
        gl: entry.glCode || 'N/A',
        costCenter: entry.costCenter || 'General',
        debit: parseFloat(entry.debit || 0),
        credit: parseFloat(entry.credit || 0),
        note: entry.narration || `Entry ${index + 1}`
      }))
    : [
        // Fallback if no GL entries available
        {
          id: 1,
          particulars: "Branch Conveyance Expense",
          gl: "X2001003",
          costCenter: employeeDetails.department || "General",
          debit: totalConveyanceAmount,
          credit: 0,
          note: `Employee: ${employeeDetails.employeeName} (${employeeDetails.employeeId})`,
        },
        {
          id: 2,
          particulars: "Conveyance Payable",
          gl: "L2001001",
          costCenter: "",
          debit: 0,
          credit: totalConveyanceAmount,
          note: "Reimbursement to employee for conveyance expenses",
        }
      ];

  const approvals = data.approvals || {
    preparer: data.preparedBy || "Billing Executive",
    reviewer: data.reviewer || "Finance Manager", 
    approver: data.approver || "VP Operations",
    date: new Date().toISOString().split('T')[0]
  };

  // Calculate totals correctly (using parseFloat for decimal support)
  const totals = {
    debit: lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0),
    credit: lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0)
  };

  

  // Format amount with proper decimals
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return "-";
    const numAmount = parseFloat(amount);
    return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-green-600 text-white p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">Expense Voucher - Conveyance Reimbursement</h2>
          <div className="flex items-center space-x-2">
            
            <button 
              onClick={onClose}
              className="ml-2 text-white hover:text-teal-200 text-xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Company</p>
              <p className="text-sm sm:text-base font-medium">{header.company}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Voucher No.</p>
              <p className="text-sm sm:text-base font-medium">{header.voucherNo}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Expense Date</p>
              <p className="text-sm sm:text-base font-medium">{header.date}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Financial Year</p>
              <p className="text-sm sm:text-base font-medium">{header.financialYear}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Expense Type</p>
              <p className="text-sm sm:text-base font-medium">{header.expenseType}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Department</p>
              <p className="text-sm sm:text-base font-medium">{header.department}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs sm:text-sm text-gray-500">Reference</p>
              <p className="text-sm sm:text-base font-medium">{header.reference}</p>
            </div>
          </div>

          {/* Employee Details */}
          <div className="mb-4 sm:mb-6 bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Employee Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-gray-600">Employee ID:</span>
                <div className="font-semibold">{employeeDetails.employeeId}</div>
              </div>
              <div>
                <span className="text-gray-600">Employee Name:</span>
                <div className="font-semibold">{employeeDetails.employeeName}</div>
              </div>
              <div>
                <span className="text-gray-600">Designation:</span>
                <div className="font-semibold">{employeeDetails.designation}</div>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <div className="font-semibold">{employeeDetails.department}</div>
              </div>
              <div>
                <span className="text-gray-600">Reporting Manager:</span>
                <div className="font-semibold">{employeeDetails.manager}</div>
              </div>
              <div>
                <span className="text-gray-600">Submission Date:</span>
                <div className="font-semibold">{employeeDetails.submissionDate}</div>
              </div>
            </div>
          </div>

          {/* Total Amount Display */}
          <div className="mb-4 sm:mb-6 p-3 rounded-lg text-center bg-teal-50 text-teal-700">
            <p className="text-sm">
              Total Conveyance Amount: {formatAmount(totalConveyanceAmount)}
            </p>
          </div>

          {/* Conveyance Details Table */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Conveyance Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-xs sm:text-sm">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">Date</th>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">Client Name</th>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">Route</th>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">Purpose</th>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">Transport</th>
                    <th className="px-2 sm:px-3 py-2 text-center font-medium text-gray-700 border">Bill</th>
                    <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-700 border">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {conveyanceDetails.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-3 py-2 border font-medium">{item.date}</td>
                      <td className="px-2 sm:px-3 py-2 border">{item.clientName}</td>
                      <td className="px-2 sm:px-3 py-2 border">
                        <div className="text-xs">
                          <div>From: {item.fromLocation}</div>
                          <div>To: {item.toLocation}</div>
                          <div className="text-gray-500">({item.distance})</div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2 border text-xs">{item.purpose}</td>
                      <td className="px-2 sm:px-3 py-2 border">{item.transport}</td>
                      <td className="px-2 sm:px-3 py-2 border text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.billAttached === 'Yes' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.billAttached}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 border text-right font-semibold">
                        {formatAmount(item.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-teal-50 font-bold">
                    <td colSpan={6} className="px-2 sm:px-3 py-2 border text-right">Total Conveyance Amount:</td>
                    <td className="px-2 sm:px-3 py-2 border text-right text-teal-700">
                      {formatAmount(totalConveyanceAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Accounting Entries Table */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Accounting Entries</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700 border">Particulars</th>
                    <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700 border hidden sm:table-cell">GL Code</th>
                    <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700 border hidden sm:table-cell">Cost Center</th>
                    <th className="px-2 sm:px-4 py-2 text-right font-medium text-gray-700 border">Debit (₹)</th>
                    <th className="px-2 sm:px-4 py-2 text-right font-medium text-gray-700 border">Credit (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, idx) => (
                    <tr key={line.id || idx} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-2 border">
                        <div className="font-medium">{line.particulars || "N/A"}</div>
                        {line.note && (
                          <div className="text-xs text-gray-500 mt-1">{line.note}</div>
                        )}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border hidden sm:table-cell">{line.gl || "N/A"}</td>
                      <td className="px-2 sm:px-4 py-2 border hidden sm:table-cell">{line.costCenter || "-"}</td>
                      <td className="px-2 sm:px-4 py-2 border text-right">
                        {line.debit ? formatAmount(line.debit) : "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border text-right">
                        {line.credit ? formatAmount(line.credit) : "-"}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-50 font-bold">
                    <td colSpan={2} className="px-2 sm:px-4 py-2 border text-right hidden sm:table-cell"></td>
                    <td className="px-2 sm:px-4 py-2 border text-right hidden sm:table-cell">Total</td>
                    <td className="px-2 sm:px-4 py-2 border text-right text-red-700 font-semibold">{formatAmount(totals.debit)}</td>
                    <td className="px-2 sm:px-4 py-2 border text-right text-green-700 font-semibold">{formatAmount(totals.credit)}</td>
                  </tr>
                  {lines.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-2 sm:px-4 py-2 border text-center text-gray-500 text-xs">
                        No GL entries found. Transaction may not be posted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* GL Transaction Details */}
          {glEntriesFromTransaction.length > 0 && (
            <div className="mb-4 sm:mb-6 bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <div className="text-xs sm:text-sm">
                <div className="font-semibold text-blue-800 mb-2 sm:mb-3">GL Transaction Details</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium font-mono text-blue-700">{data.header.transactionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voucher Number:</span>
                    <span className="font-medium font-mono text-blue-700">{header.voucherNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Debit:</span>
                    <span className="font-medium text-red-600">{formatAmount(totals.debit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Credit:</span>
                    <span className="font-medium text-green-600">{formatAmount(totals.credit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GL Entries:</span>
                    <span className="font-medium">{lines.length} entries</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expense Analysis */}
          <div className="mb-4 sm:mb-6 bg-slate-50 p-3 sm:p-4 rounded-lg border">
            <div className="text-xs sm:text-sm">
              <div className="font-semibold text-gray-700 mb-2 sm:mb-3">Conveyance Analysis</div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span>Total Entries:</span>
                  <span className="font-medium">{conveyanceDetails.length} trips</span>
                </div>
                <div className="flex justify-between">
                  <span>Bills Attached:</span>
                  <span className="font-medium text-green-600">
                    {conveyanceDetails.filter(item => item.billAttached === 'Yes').length} of {conveyanceDetails.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium text-teal-600">{formatAmount(totalConveyanceAmount)}</span>
                </div>
              </div>

              {/* Approval Status */}
              <div className="mt-3 sm:mt-4 pt-3 border-t">
                <div className="font-semibold text-gray-700 mb-2 sm:mb-3">Approval Status</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Employee Request:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Submitted</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Manager Approval:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Approved</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Billing Verification:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Approvals Section */}
          <div className="border-t pt-3 sm:pt-4">
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Approvals & Authorization</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="border-b border-gray-300 pb-1 sm:pb-2 mb-1 sm:mb-2 h-8 sm:h-10"></div>
                <p className="text-xs sm:text-sm font-medium text-gray-700">Account Executive</p>
                <p className="text-2xs sm:text-xs text-gray-500">{approvals.preparer}</p>
                <p className="text-2xs sm:text-xs text-gray-400">{approvals.date}</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-3 sm:mt-4 p-2 bg-teal-50 text-teal-700 text-2xs sm:text-xs text-center rounded">
            This conveyance expense voucher has been approved through the complete approval workflow. All client visit reports and supporting documents have been verified.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConveyanceExpenseVoucher;