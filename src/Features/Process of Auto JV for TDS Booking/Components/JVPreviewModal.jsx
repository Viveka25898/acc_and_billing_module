import React from "react";

export default function InvoiceJVDisplay({ data = {}, onClose }) {
  // Set default values if data is not provided
  const header = data.header || {
    company: "ABC Enterprises",
    voucherNo: "JV-2025-001",
    financialYear: "2025-26",
    date: "2025-08-15",
    reference: "PO-2025-001/INV-789",
    preparedBy: "John Doe"
  };

  const lines = data.entries || [
    {
      id: 1,
      particulars: "Office Equipment Expense",
      gl: "5010",
      costCenter: "IT",
      debit: 8500,
      credit: 0,
      note: "",
    },
    {
      id: 2,
      particulars: "CGST Input (9%)",
      gl: "1801",
      costCenter: "",
      debit: 765,
      credit: 0,
      note: "",
    },
    {
      id: 3,
      particulars: "SGST Input (9%)",
      gl: "1802",
      costCenter: "",
      debit: 765,
      credit: 0,
      note: "",
    },
    {
      id: 4,
      particulars: "TDS 194C (10%)",
      gl: "3001",
      costCenter: "",
      debit: 1000,
      credit: 0,
      note: "",
    },
    {
      id: 5,
      particulars: "Accounts Payable - Tech Solutions",
      gl: "2000",
      costCenter: "",
      debit: 0,
      credit: 10030,
      note: "Vendor: V001",
    },
  ];

  const narration = data.narration || "Payment against Invoice No. INV-789 for IT equipment (₹10,030), including GST (CGST+SGST 9% each). TDS @10% deducted u/s 194C.";
  
  const approvals = data.approvals || {
    preparer: "John Doe",
    reviewer: "Pending",
    approver: "Pending",
    date: new Date().toISOString().split('T')[0]
  };

  // Calculate totals if not provided
  const totals = data.totals || {
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
      approvals
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header with Close Button */}
        <div className="sticky top-0 bg-indigo-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Journal Voucher - Invoice Entry</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 text-white rounded text-sm"
            >
              Print
            </button>
            <button 
              onClick={handleExport}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 text-white rounded text-sm"
            >
              Export
            </button>
            <button 
              onClick={onClose}
              className="text-white hover:text-indigo-200 text-2xl ml-2"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{header.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Voucher No.</p>
              <p className="font-medium">{header.voucherNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{header.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Financial Year</p>
              <p className="font-medium">{header.financialYear}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Reference</p>
              <p className="font-medium">{header.reference}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Prepared By</p>
              <p className="font-medium">{header.preparedBy}</p>
            </div>
          </div>

          {/* Balance Status */}
          <div className="mb-4 p-3 rounded-lg text-center">
            {isBalanced ? (
              <div className="bg-green-100 text-green-800 font-medium">
                ✓ Journal Voucher is Balanced
              </div>
            ) : (
              <div className="bg-amber-100 text-amber-800 font-medium">
                ⚠ Not Balanced - Difference: ₹{Math.abs(totals.debit - totals.credit).toLocaleString()}
              </div>
            )}
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Particulars</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">GL Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Cost Center</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border">Debit (₹)</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border">Credit (₹)</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={line.id || idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border text-sm">
                      <div>{line.particulars || "N/A"}</div>
                      {line.note && (
                        <div className="text-xs text-gray-500 mt-1">{line.note}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 border text-sm">{line.gl || "N/A"}</td>
                    <td className="px-4 py-3 border text-sm">{line.costCenter || "-"}</td>
                    <td className="px-4 py-3 border text-right text-sm">
                      {line.debit ? `₹${line.debit.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-4 py-3 border text-right text-sm">
                      {line.credit ? `₹${line.credit.toLocaleString()}` : "-"}
                    </td>
                  </tr>
                ))}
                <tr className="bg-indigo-50 font-bold">
                  <td colSpan={3} className="px-4 py-3 border text-right text-sm">Total</td>
                  <td className="px-4 py-3 border text-right text-sm text-green-700">₹{totals.debit.toLocaleString()}</td>
                  <td className="px-4 py-3 border text-right text-sm text-red-700">₹{totals.credit.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Supporting Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Narration */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Narration:</p>
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border">
                {narration}
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Supporting Documents:</p>
                <div className="text-sm text-gray-600">
                  PO, Invoice, TDS Challan
                </div>
              </div>
            </div>

            {/* Summary & Calculations */}
            <div className="bg-slate-50 p-4 rounded-lg border">
              <div className="text-sm">
                <div className="font-semibold text-gray-700 mb-3">Transaction Summary</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Debit:</span>
                    <span className="font-medium text-green-700">₹{totals.debit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Credit:</span>
                    <span className="font-medium text-red-700">₹{totals.credit.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Difference:</span>
                    <span className={totals.debit === totals.credit ? "text-green-700" : "text-amber-700"}>
                      ₹{Math.abs(totals.debit - totals.credit).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Net Payment Calculation */}
                <div className="mt-4 pt-3 border-t">
                  <div className="font-semibold text-gray-700 mb-2">Payment Details</div>
                  <div className="flex justify-between">
                    <span>Net Payment:</span>
                    <span className="font-medium">
                      ₹{(totals.credit - (lines.find(l => l.particulars?.toLowerCase().includes('tds'))?.debit || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Approvals Section */}
          <div className="border-t pt-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Approvals & Authorization</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="border-b border-gray-300 pb-2 mb-2 h-12"></div>
                <p className="text-sm font-medium text-gray-700">Preparer</p>
                <p className="text-xs text-gray-500">{approvals.preparer}</p>
                <p className="text-xs text-gray-400">{approvals.date}</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-300 pb-2 mb-2 h-12"></div>
                <p className="text-sm font-medium text-gray-700">Reviewer</p>
                <p className="text-xs text-gray-500">{approvals.reviewer}</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-300 pb-2 mb-2 h-12"></div>
                <p className="text-sm font-medium text-gray-700">Approver</p>
                <p className="text-xs text-gray-500">{approvals.approver}</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 p-3 bg-blue-50 text-blue-700 text-xs text-center rounded">
            This is a system-generated Journal Voucher. All amounts are in Indian Rupees (₹).
          </div>
        </div>
      </div>
    </div>
  );
}