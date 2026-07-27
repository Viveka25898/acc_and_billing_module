import React from 'react';

const ConveyanceExpenseVoucher = ({ data = {}, onClose }) => {
  // Extract backend API fields cleanly with fallbacks
  const rawVoucher = data.voucher || {};
  const rawHeader = data.header || {};
  const rawEmployee = data.employeeDetails || data.employee_details || {};
  const rawConveyance = data.conveyanceDetails || data.conveyance_details || {};

  const voucherNo =
    data.voucher_no ||
    data.voucherNumber ||
    rawVoucher.voucherNo ||
    rawVoucher.voucher_no ||
    rawHeader.voucherNo ||
    data.requestId ||
    "-";

  const transactionId =
    data.transaction_id ||
    data.transactionId ||
    rawVoucher.transaction_id ||
    rawHeader.transactionId ||
    "-";

  const date =
    rawVoucher.date ||
    rawHeader.date ||
    (data.aeApprovedAt ? data.aeApprovedAt.split("T")[0] : null) ||
    new Date().toISOString().split("T")[0];

  const financialYear =
    rawHeader.financialYear ||
    `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

  // Employee details mapping
  const employeeId = rawEmployee.employeeId || rawEmployee.employee_id || data.employeeId || "-";
  const employeeName = rawEmployee.employeeName || rawEmployee.employee_name || data.employeeName || "-";
  const designation = rawEmployee.designation || "-";
  const department = rawEmployee.department || "Operations";

  // Conveyance trip details
  const conveyanceList = Array.isArray(rawConveyance)
    ? rawConveyance
    : [
        {
          date: rawConveyance.date || data.visit_date || data.date || "-",
          clientName: rawConveyance.client || data.client_name || data.client || "-",
          purpose: rawConveyance.purpose || data.purpose || "-",
          transport: rawConveyance.transport || data.transport_mode || data.transport || "-",
          distance: rawConveyance.distance ? `${rawConveyance.distance} km` : "-",
          amount: rawConveyance.amount || data.amount || 0,
        },
      ];

  const totalConveyanceAmount = conveyanceList.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  // GL Entries mapping
  const glEntriesList = data.glEntries || data.gl_entries || data.entries || rawVoucher.glEntries || [];

  const lines = glEntriesList.map((entry, index) => ({
    id: entry.lineNo || index + 1,
    particulars: entry.glName || entry.gl_name || "GL Account",
    glCode: entry.glCode || entry.gl_code || "-",
    costCenter: entry.costCenter || entry.cost_center || "Operations",
    debit: parseFloat(entry.debit || 0),
    credit: parseFloat(entry.credit || 0),
    narration: entry.narration || `Conveyance claim - ${employeeName}`,
  }));

  const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return "-";
    const num = parseFloat(amount);
    return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-700 to-green-600 text-white p-4 flex justify-between items-center z-10 shadow-md">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-wide">Expense Voucher - Conveyance Reimbursement</h2>
            <p className="text-xs text-green-100 mt-0.5">Voucher #: {voucherNo}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-xl text-xl font-bold transition cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 text-gray-700 text-sm">
          {/* Header Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Voucher No.</p>
              <p className="font-semibold text-gray-900 font-mono text-xs sm:text-sm mt-0.5">{voucherNo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Transaction ID</p>
              <p className="font-semibold text-blue-700 font-mono text-xs sm:text-sm mt-0.5">{transactionId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Expense Date</p>
              <p className="font-medium text-gray-800 mt-0.5">{date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Financial Year</p>
              <p className="font-medium text-gray-800 mt-0.5">{financialYear}</p>
            </div>
          </div>

          {/* Employee Details */}
          <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">Employee Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-gray-500 text-xs block">Employee ID</span>
                <span className="font-semibold text-gray-900">{employeeId}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Employee Name</span>
                <span className="font-semibold text-gray-900">{employeeName}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Designation</span>
                <span className="font-semibold text-gray-900">{designation}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Department</span>
                <span className="font-semibold text-gray-900">{department}</span>
              </div>
            </div>
          </div>

          {/* Conveyance Details */}
          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Conveyance Trip Details</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-green-50 text-green-800 uppercase font-semibold">
                  <tr>
                    <th className="px-3 py-2.5 border-b">Visit Date</th>
                    <th className="px-3 py-2.5 border-b">Client Name</th>
                    <th className="px-3 py-2.5 border-b">Purpose</th>
                    <th className="px-3 py-2.5 border-b">Transport</th>
                    <th className="px-3 py-2.5 border-b">Distance</th>
                    <th className="px-3 py-2.5 border-b text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {conveyanceList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 font-medium whitespace-nowrap">{item.date || "-"}</td>
                      <td className="px-3 py-2.5 font-semibold text-gray-900">{item.clientName || "-"}</td>
                      <td className="px-3 py-2.5 max-w-[200px] truncate" title={item.purpose}>{item.purpose || "-"}</td>
                      <td className="px-3 py-2.5 font-semibold text-green-700 uppercase whitespace-nowrap">{item.transport || "-"}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">{item.distance || "-"}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-gray-900 whitespace-nowrap">
                        {formatAmount(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GL Accounting Entries Table */}
          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Posted General Ledger (GL) Entries</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                  <tr>
                    <th className="px-3 py-2.5 border-b w-12 text-center">Line</th>
                    <th className="px-3 py-2.5 border-b">GL Code</th>
                    <th className="px-3 py-2.5 border-b">GL Account Name</th>
                    <th className="px-3 py-2.5 border-b">Narration</th>
                    <th className="px-3 py-2.5 border-b text-right">Debit (₹)</th>
                    <th className="px-3 py-2.5 border-b text-right">Credit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lines.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-6 text-center text-gray-400 font-medium">
                        No GL entries available.
                      </td>
                    </tr>
                  ) : (
                    lines.map((line) => (
                      <tr key={line.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2.5 text-center text-gray-500 font-semibold">{line.id}</td>
                        <td className="px-3 py-2.5 font-mono font-semibold text-blue-700 whitespace-nowrap">{line.glCode}</td>
                        <td className="px-3 py-2.5 font-semibold text-gray-900">{line.particulars}</td>
                        <td className="px-3 py-2.5 text-gray-600 text-xs">{line.narration}</td>
                        <td className="px-3 py-2.5 text-right font-semibold text-red-600 whitespace-nowrap">
                          {line.debit > 0 ? formatAmount(line.debit) : "-"}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-green-700 whitespace-nowrap">
                          {line.credit > 0 ? formatAmount(line.credit) : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-gray-50 font-bold border-t border-gray-200">
                    <td colSpan="4" className="px-3 py-2.5 text-right uppercase text-xs">Total GL Balance:</td>
                    <td className="px-3 py-2.5 text-right text-red-700 font-bold whitespace-nowrap">{formatAmount(totalDebit)}</td>
                    <td className="px-3 py-2.5 text-right text-green-700 font-bold whitespace-nowrap">{formatAmount(totalCredit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-green-50 text-green-800 text-xs text-center rounded-xl font-medium border border-green-200">
            ✅ GL entries successfully posted. Reimbursement voucher generated for employee settlement.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConveyanceExpenseVoucher;