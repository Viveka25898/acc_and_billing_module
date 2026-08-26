import React from "react";
import { FiX, FiCheckCircle, FiFileText, FiUser, FiMapPin, FiCreditCard } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

export default function ConveyanceExpenseVoucher({ data = {}, onClose }) {
  // Extract API data payload cleanly
  const rootData = data?.data || data || {};

  const header = rootData.header || rootData.voucher || {};
  const employee = rootData.employeeDetails || rootData.employee_details || {};
  const conveyanceList = Array.isArray(rootData.conveyanceDetails)
    ? rootData.conveyanceDetails
    : Array.isArray(rootData.conveyance_details)
    ? rootData.conveyance_details
    : [];
  const approvals = rootData.approvals || {};
  const glEntries = Array.isArray(rootData.glEntries)
    ? rootData.glEntries
    : Array.isArray(rootData.gl_entries)
    ? rootData.gl_entries
    : [];
  const totals = rootData.totals || {};

  // Universal helper function to show '-' if data is missing or empty
  const val = (v) => {
    if (v === undefined || v === null || String(v).trim() === "") return "-";
    return String(v);
  };

  const formatCurrency = (amt) => {
    if (amt === undefined || amt === null || amt === "" || isNaN(amt)) return "-";
    const num = parseFloat(amt);
    return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Header Mappings
  const company = val(header.company);
  const voucherNo = val(header.voucherNo || header.voucher_no || rootData.voucher_no || rootData.voucherNo);
  const financialYear = val(header.financialYear || header.financial_year);
  const voucherDate = val(header.date);
  const reference = val(header.reference);
  const preparedBy = val(header.preparedBy || header.prepared_by);
  const expenseType = val(header.expenseType || header.expense_type);
  const department = val(header.department);
  const approvalChain = val(header.approvalChain || header.approval_chain);
  const voucherType = val(header.voucherType || header.voucher_type);
  const transactionId = val(header.transactionId || header.transaction_id);

  // Employee Details Mappings
  const employeeId = val(employee.employeeId || employee.employee_id);
  const employeeName = val(employee.employeeName || employee.employee_name);
  const designation = val(employee.designation);
  const empDepartment = val(employee.department);
  const manager = val(employee.manager);
  const submissionDate = val(employee.submissionDate || employee.submission_date);
  const approvalDate = val(employee.approvalDate || employee.approval_date);

  // Approvals Section Mappings
  const approverPreparer = val(approvals.preparer);
  const approverReviewer = val(approvals.reviewer);
  const approverApprover = val(approvals.approver);
  const approvalSectionDate = val(approvals.date);

  // Calculate totals fallback if totals object is empty
  const calculatedDebit = glEntries.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
  const calculatedCredit = glEntries.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0);

  const displayTotalDebit = totals.debit !== undefined ? formatCurrency(totals.debit) : formatCurrency(calculatedDebit);
  const displayTotalCredit = totals.credit !== undefined ? formatCurrency(totals.credit) : formatCurrency(calculatedCredit);
  const isBalanced = totals.balanced !== undefined ? totals.balanced : (calculatedDebit === calculatedCredit && calculatedDebit > 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-50 animate-fadeIn">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-gray-100">
        
        {/* Top Action Header */}
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-700 text-white px-6 py-4 flex justify-between items-center shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FiFileText size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-wide flex items-center gap-2">
                {voucherType !== "-" ? voucherType : "Expense Voucher"}
                <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full text-green-100">
                  {expenseType}
                </span>
              </h2>
              <p className="text-xs text-green-100 mt-0.5 font-mono">
                Voucher #: {voucherNo} | Txn ID: {transactionId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-xl transition cursor-pointer"
              aria-label="Close"
            >
              <FiX size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-gray-700 text-xs sm:text-sm bg-gray-50/30">
          
          {/* Header Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-700 flex items-center gap-1">
                  <FaBuilding className="text-green-600" /> {company}
                </span>
                <p className="text-base font-bold text-gray-900 mt-0.5">{reference}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-gray-400 block font-medium">Financial Year</span>
                <span className="font-bold text-gray-800 font-mono">{financialYear}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-gray-500 font-medium block">Voucher No.</span>
                <span className="font-bold text-gray-900 font-mono text-xs">{voucherNo}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Transaction ID</span>
                <span className="font-bold text-blue-700 font-mono text-xs">{transactionId}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Voucher Date</span>
                <span className="font-semibold text-gray-800">{voucherDate}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Department</span>
                <span className="font-semibold text-gray-800">{department}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Prepared By</span>
                <span className="font-medium text-gray-700 truncate block">{preparedBy}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Voucher Type</span>
                <span className="font-semibold text-gray-800">{voucherType}</span>
              </div>
            </div>
          </div>

          {/* Employee Details Card */}
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-100 p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FiUser className="text-blue-700" size={16} /> Employee Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-gray-500 block font-medium">Employee ID</span>
                <span className="font-bold text-gray-900 font-mono">{employeeId}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block font-medium">Employee Name</span>
                <span className="font-bold text-gray-900">{employeeName}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block font-medium">Designation</span>
                <span className="font-semibold text-gray-800">{designation}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block font-medium">Department</span>
                <span className="font-semibold text-gray-800">{empDepartment}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block font-medium">Submission Date</span>
                <span className="font-semibold text-gray-800">{submissionDate}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block font-medium">Approval Date</span>
                <span className="font-semibold text-gray-800">{approvalDate}</span>
              </div>
            </div>
          </div>

          {/* Conveyance Details Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <FiMapPin className="text-green-600" size={16} /> Conveyance Trip Details
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                Total Claims: {conveyanceList.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-green-50/70 text-green-900 uppercase font-semibold border-b border-green-100">
                  <tr>
                    <th className="px-4 py-3 text-center w-10">#</th>
                    <th className="px-4 py-3 whitespace-nowrap">Visit Date</th>
                    <th className="px-4 py-3 whitespace-nowrap">Client / Site</th>
                    <th className="px-4 py-3 whitespace-nowrap">From Location</th>
                    <th className="px-4 py-3 whitespace-nowrap">To Location</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3 whitespace-nowrap">Transport Mode</th>
                    <th className="px-4 py-3 whitespace-nowrap">Distance</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">Bill Attached</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {conveyanceList.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-4 py-6 text-center text-gray-400 font-medium">
                        No conveyance details available.
                      </td>
                    </tr>
                  ) : (
                    conveyanceList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3 text-center text-gray-400 font-semibold">{val(item.id || idx + 1)}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{val(item.date)}</td>
                        <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{val(item.clientName || item.client_name)}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{val(item.fromLocation || item.from_location)}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{val(item.toLocation || item.to_location)}</td>
                        <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate" title={item.purpose}>{val(item.purpose)}</td>
                        <td className="px-4 py-3 font-bold text-green-700 uppercase whitespace-nowrap">{val(item.modeOfTransport || item.transport_mode)}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{val(item.distance)}</td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            String(item.billAttached).toLowerCase() === 'yes'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {val(item.billAttached)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Posted GL Entries Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <FiCreditCard className="text-blue-600" size={16} /> Posted General Ledger (GL) Accounting Entries
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isBalanced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isBalanced ? "✅ Balanced" : "⚠️ Unbalanced"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-center w-12">Line</th>
                    <th className="px-4 py-3 whitespace-nowrap">GL Code</th>
                    <th className="px-4 py-3 whitespace-nowrap">GL Account Name</th>
                    <th className="px-4 py-3 whitespace-nowrap">Cost Center</th>
                    <th className="px-4 py-3">Narration</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Debit (₹)</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Credit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {glEntries.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center text-gray-400 font-medium">
                        No GL entries posted.
                      </td>
                    </tr>
                  ) : (
                    glEntries.map((line, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3 text-center text-gray-400 font-bold">{val(line.lineNo || line.line_no || idx + 1)}</td>
                        <td className="px-4 py-3 font-mono font-bold text-blue-700 whitespace-nowrap">{val(line.glCode || line.gl_code)}</td>
                        <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{val(line.glName || line.gl_name)}</td>
                        <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">{val(line.costCenter || line.cost_center)}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{val(line.narration)}</td>
                        <td className="px-4 py-3 text-right font-bold text-red-600 whitespace-nowrap">
                          {line.debit !== undefined && line.debit !== null && line.debit !== "0" && Number(line.debit) > 0 ? formatCurrency(line.debit) : "₹0.00"}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-green-700 whitespace-nowrap">
                          {line.credit !== undefined && line.credit !== null && line.credit !== "0" && Number(line.credit) > 0 ? formatCurrency(line.credit) : "₹0.00"}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
                    <td colSpan="5" className="px-4 py-3 text-right uppercase text-xs tracking-wider text-gray-700">
                      Total Ledger Balance:
                    </td>
                    <td className="px-4 py-3 text-right text-red-700 font-bold text-sm whitespace-nowrap">
                      {displayTotalDebit}
                    </td>
                    <td className="px-4 py-3 text-right text-green-700 font-bold text-sm whitespace-nowrap">
                      {displayTotalCredit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Voucher Seal */}
          <div className="p-3 bg-green-50 text-green-800 text-xs text-center rounded-xl font-medium border border-green-200 flex items-center justify-center gap-2">
            <FiCheckCircle size={16} className="text-green-600 shrink-0" />
            <span>This is an official system-generated expense voucher. All GL transactions have been verified and posted into the ERP accounts system.</span>
          </div>

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center shrink-0">
          <span className="text-xs text-gray-400 font-semibold font-mono">
            {company}
          </span>
          <button
            onClick={onClose}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
          >
            Close Voucher
          </button>
        </div>

      </div>
    </div>
  );
}