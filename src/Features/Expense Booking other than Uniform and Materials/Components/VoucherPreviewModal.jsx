/* eslint-disable no-unused-vars */
import React from "react";

const VoucherPreviewModal = ({ invoice = {}, onClose }) => {
  // Set default values if invoice data is not provided
  const header = {
    company: "iSmart",
    voucherNo: `JV-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    financialYear: "2025-26",
    date: new Date().toISOString().split('T')[0],
    reference: `${invoice.poNo || 'PO-2025-001'}/${invoice.invoiceNo || 'INV-001'}`,
    preparedBy: "Account Manager"
  };

  // TDS calculation
  const tdsRate = 10; // You can change this later or make dynamic
  const invoiceAmount = invoice.amount || 0;
  const tdsAmount = (invoiceAmount * tdsRate) / 100;
  const payableAmount = invoiceAmount - tdsAmount;

  // Create journal entries based on invoice data
  const lines = [
    {
      id: 1,
      particulars: "Expense Account",
      gl: "5000",
      costCenter: "GENERAL",
      debit: invoiceAmount,
      credit: 0,
      note: `Invoice: ${invoice.invoiceNo || 'N/A'}`,
    },
    {
      id: 2,
      particulars: "TDS Payable",
      gl: "2100",
      costCenter: "",
      debit: 0,
      credit: tdsAmount,
      note: `TDS @ ${tdsRate}%`,
    },
    {
      id: 3,
      particulars: `Vendor - ${invoice.vendorName || 'Unknown Vendor'}`,
      gl: "2000",
      costCenter: "",
      debit: 0,
      credit: payableAmount,
      note: `Vendor Payment`,
    },
  ];

  const narration = `Payment against Invoice No. ${invoice.invoiceNo || 'N/A'} for ${invoice.vendorName || 'vendor'} (₹${invoiceAmount.toLocaleString()}). TDS deducted @ ${tdsRate}% (₹${tdsAmount.toFixed(2)}). Net payable: ₹${payableAmount.toLocaleString()}.`;
  
  const approvals = {
    preparer: "Account Manager",
    reviewer: "Pending",
    approver: "Pending",
    date: new Date().toISOString().split('T')[0]
  };

  // Calculate totals
  const totals = {
    debit: lines.reduce((sum, line) => sum + (line.debit || 0), 0),
    credit: lines.reduce((sum, line) => sum + (line.credit || 0), 0)
  };

  const isBalanced = totals.debit === totals.credit;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const payload = {
      header,
      lines,
      totals,
      narration,
      approvals,
      invoiceDetails: invoice
    };
    
    const dataStr = JSON.stringify(payload, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `JV_${header.voucherNo}_${header.date}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-green-600 text-white p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">Voucher Preview - Journal Entry</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onClose}
              className="ml-2 text-white hover:text-blue-200 text-xl font-bold"
              aria-label="Close"
            >
              &times;
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
              <p className="text-xs sm:text-sm text-gray-500">Date</p>
              <p className="text-sm sm:text-base font-medium">{header.date}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Financial Year</p>
              <p className="text-sm sm:text-base font-medium">{header.financialYear}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs sm:text-sm text-gray-500">Reference</p>
              <p className="text-sm sm:text-base font-medium">{header.reference}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs sm:text-sm text-gray-500">Prepared By</p>
              <p className="text-sm sm:text-base font-medium">{header.preparedBy}</p>
            </div>
          </div>

          {/* Balance Status */}
          <div className={`mb-4 sm:mb-6 p-3 rounded-lg text-center ${
            isBalanced ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <p className="font-medium">
              {isBalanced ? '✓ Journal Entry is Balanced' : '⚠ Journal Entry is NOT Balanced'}
            </p>
            {!isBalanced && (
              <p className="text-sm mt-1">
                Difference: ₹{Math.abs(totals.debit - totals.credit).toLocaleString()}
              </p>
            )}
          </div>

          {/* Invoice Details Section */}
          <div className="mb-4 sm:mb-6 bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Invoice Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div>
                <span className="text-gray-600">Invoice No:</span>
                <span className="ml-2 font-medium">{invoice.invoiceNo || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Vendor Name:</span>
                <span className="ml-2 font-medium">{invoice.vendorName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">PO Number:</span>
                <span className="ml-2 font-medium">{invoice.poNo || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Invoice Amount:</span>
                <span className="ml-2 font-medium">₹{invoiceAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">TDS Rate:</span>
                <span className="ml-2 font-medium">{tdsRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">TDS Amount:</span>
                <span className="ml-2 font-medium text-red-600">₹{tdsAmount.toFixed(2)}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600">Net Payable:</span>
                <span className="ml-2 font-medium text-green-600">₹{payableAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto mb-4 sm:mb-6">
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
                      {line.debit ? `₹${line.debit.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 border text-right">
                      {line.credit ? `₹${line.credit.toLocaleString()}` : "-"}
                    </td>
                  </tr>
                ))}
                <tr className="bg-indigo-50 font-bold">
                  <td colSpan={3} className="px-2 sm:px-4 py-2 border text-right hidden sm:table-cell">Total</td>
                  <td className="px-2 sm:px-4 py-2 border text-right text-green-700">₹{totals.debit.toLocaleString()}</td>
                  <td className="px-2 sm:px-4 py-2 border text-right text-red-700">₹{totals.credit.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Supporting Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Narration */}
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Narration:</p>
              <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded border">
                {narration}
              </div>
            </div>

            {/* Summary & Calculations */}
            <div className="bg-slate-50 p-2 sm:p-3 rounded-lg border">
              <div className="text-xs sm:text-sm">
                <div className="font-semibold text-gray-700 mb-1 sm:mb-2">Transaction Summary</div>
                
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex justify-between">
                    <span>Total Debit:</span>
                    <span className="font-medium text-green-700">₹{totals.debit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Credit:</span>
                    <span className="font-medium text-red-700">₹{totals.credit.toLocaleString()}</span>
                  </div>
                </div>

                {/* TDS Calculation Details */}
                <div className="mt-2 sm:mt-3 pt-2 border-t">
                  <div className="font-semibold text-gray-700 mb-1 sm:mb-2">TDS Calculation</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Invoice Amount:</span>
                      <span className="font-medium">₹{invoiceAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TDS @ {tdsRate}%:</span>
                      <span className="font-medium text-red-600">₹{tdsAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Net Payable:</span>
                      <span className="text-green-600">₹{payableAmount.toLocaleString()}</span>
                    </div>
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
                <p className="text-xs sm:text-sm font-medium text-gray-700">Preparer</p>
                <p className="text-2xs sm:text-xs text-gray-500">{approvals.preparer}</p>
                <p className="text-2xs sm:text-xs text-gray-400">{approvals.date}</p>
              </div>
             
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-3 sm:mt-4 p-2 bg-blue-50 text-blue-700 text-2xs sm:text-xs text-center rounded">
            This is a system-generated Journal Voucher for Invoice Processing. All amounts are in Indian Rupees (₹).
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherPreviewModal;