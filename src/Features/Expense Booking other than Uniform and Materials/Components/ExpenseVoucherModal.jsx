import React from 'react';

const ExpenseVoucherModal = ({ data = {}, onClose }) => {
  console.log(data);
  
  // Extract data from the approved vendor invoice
  const header = data.header || {
    company: "ABC Enterprises",
    voucherNo: `EXP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    date: new Date().toISOString().split('T')[0],
    reference: data.reference || "Vendor Invoice Processing",
    preparedBy: "Finance Head",
    expenseType: "Vendor Expense",
    department: data.department || "Operations"
  };

  // Vendor details from the approved invoice
  const vendorDetails = data.vendorDetails  || {
    vendorId: `VND-${Math.floor(Math.random() * 1000)}`,
    vendorName: data.employeeDetails?.employeeName || "Vendor Name",
    vendorType: "External Service Provider",
    department: "External Services",
    poNumber: data.header?.reference?.split('/')[0] || "PO-2025-001",
    invoiceNumber: data.header?.reference?.split('/')[1] || "INV-001",
    submissionDate: data.employeeDetails?.submissionDate || new Date().toISOString().split('T')[0],
    approvalDate: data.employeeDetails?.approvalDate || new Date().toISOString().split('T')[0]
  };

  // Invoice/Expense details
  const expenseDetails = data.conveyanceDetails || [{
    id: 1,
    date: new Date().toISOString().split('T')[0],
    serviceProvider: vendorDetails.vendorName,
    expenseCategory: data.header?.expenseType || "Professional Fees",
    description: `${data.header?.expenseType || "Professional Services"} as per PO`,
    poReference: vendorDetails.poNumber,
    invoiceReference: vendorDetails.invoiceNumber,
    gstApplicable: "Yes",
    amount: data.conveyanceDetails?.[0]?.amount || 0,
    documentAttached: "Yes"
  }];

  const totalExpenseAmount = expenseDetails.reduce((sum, item) => sum + item.amount, 0);

  // Corrected accounting entries (3 entries only for balanced voucher)
  const lines = data.entries || [
    {
      id: 1,
      particulars: `${data.header?.expenseType || "Professional Fees"} Expense`,
      gl: "5000",
      costCenter: data.header?.department || "GENERAL",
      debit: totalExpenseAmount,
      credit: 0,
      note: `Vendor: ${vendorDetails.vendorName}, PO: ${vendorDetails.poNumber}`,
    },
    {
      id: 2,
      particulars: `Vendor Payable - ${vendorDetails.vendorName}`,
      gl: "2000",
      costCenter: "",
      debit: 0,
      credit: totalExpenseAmount - Math.round((totalExpenseAmount * 10) / 100),
      note: "Net amount payable after TDS deduction",
    },
    {
      id: 3,
      particulars: "TDS Payable",
      gl: "2100",
      costCenter: "",
      debit: 0,
      credit: Math.round((totalExpenseAmount * 10) / 100),
      note: "TDS liability to government @ 10%",
    }
  ];

  const approvals = data.approvals || {
    billingExecutive: "Billing Manager",
    financeHead: "Finance Head", 
    approver: "Completed",
    date: new Date().toISOString().split('T')[0]
  };

  // Calculate totals correctly
  const totals = {
    debit: lines.reduce((sum, line) => sum + (parseInt(line.debit) || 0), 0),
    credit: lines.reduce((sum, line) => sum + (parseInt(line.credit) || 0), 0)
  };

  const isBalanced = totals.debit === totals.credit;
  const tdsAmount = Math.round((totalExpenseAmount * 10) / 100);
  const netPayable = totalExpenseAmount - tdsAmount;

  // Format amount without leading zeros
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return "-";
    const numAmount = parseInt(amount);
    return `₹${numAmount.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-green-600 text-white p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">Expense Voucher - Vendor Service Payment</h2>
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
              <p className="text-xs sm:text-sm text-gray-500">Voucher Date</p>
              <p className="text-sm sm:text-base font-medium">{header.date}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Financial Year</p>
              <p className="text-sm sm:text-base font-medium">{header.financialYear}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Expense Category</p>
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

          {/* Balance Status */}
          <div className={`mb-4 sm:mb-6 p-3 rounded-lg text-center ${
            isBalanced ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <p className="font-medium">
              {isBalanced ? '✓ Expense Voucher is Balanced' : '⚠ Expense Voucher is NOT Balanced'}
            </p>
          </div>

          {/* Vendor Details */}
          <div className="mb-4 sm:mb-6 bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Vendor Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-gray-600">Vendor ID:</span>
                <div className="font-semibold">{vendorDetails.vendorId}</div>
              </div>
              <div>
                <span className="text-gray-600">Vendor Name:</span>
                <div className="font-semibold">{vendorDetails.vendorName}</div>
              </div>
              <div>
                <span className="text-gray-600">Vendor Type:</span>
                <div className="font-semibold">{vendorDetails.vendorType}</div>
              </div>
              <div>
                <span className="text-gray-600">PO Number:</span>
                <div className="font-semibold">{vendorDetails.poNumber}</div>
              </div>
              <div>
                <span className="text-gray-600">Invoice Number:</span>
                <div className="font-semibold">{vendorDetails.invoiceNumber}</div>
              </div>
              <div>
                <span className="text-gray-600">Processing Date:</span>
                <div className="font-semibold">{vendorDetails.approvalDate}</div>
              </div>
            </div>
          </div>

          {/* Total Amount Display */}
          <div className="mb-4 sm:mb-6 p-3 rounded-lg text-center bg-teal-50 text-teal-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Invoice Amount</p>
                <p className="text-lg font-bold">{formatAmount(totalExpenseAmount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">TDS Deducted (10%)</p>
                <p className="text-lg font-bold text-red-600">{formatAmount(tdsAmount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Net Payable</p>
                <p className="text-lg font-bold text-green-600">{formatAmount(netPayable)}</p>
              </div>
            </div>
          </div>

          {/* Expense Details Table */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Expense Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-xs sm:text-sm">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">Date</th>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">Service Provider</th>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">Category</th>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">Description</th>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">PO Reference</th>
                    <th className="px-2 sm:px-3 py-2 text-center font-medium text-gray-700 border">GST</th>
                    <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-700 border">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseDetails.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-3 py-2 border font-medium">{item.date}</td>
                      <td className="px-2 sm:px-3 py-2 border">{item.serviceProvider}</td>
                      <td className="px-2 sm:px-3 py-2 border">{item.expenseCategory}</td>
                      <td className="px-2 sm:px-3 py-2 border text-xs">{item.description}</td>
                      <td className="px-2 sm:px-3 py-2 border">
                        <div className="text-xs">
                          <div>PO: {item.poReference}</div>
                          <div>Inv: {item.invoiceReference}</div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2 border text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.gstApplicable === 'Yes' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.gstApplicable}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 border text-right font-semibold">
                        {formatAmount(item.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-teal-50 font-bold">
                    <td colSpan={6} className="px-2 sm:px-3 py-2 border text-right">Total Invoice Amount:</td>
                    <td className="px-2 sm:px-3 py-2 border text-right text-teal-700">
                      {formatAmount(totalExpenseAmount)}
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
                    <td colSpan={3} className="px-2 sm:px-4 py-2 border text-right hidden sm:table-cell">Total</td>
                    <td className="px-2 sm:px-4 py-2 border text-right text-green-700">{formatAmount(totals.debit)}</td>
                    <td className="px-2 sm:px-4 py-2 border text-right text-red-700">{formatAmount(totals.credit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Expense Analysis */}
          <div className="mb-4 sm:mb-6 bg-slate-50 p-3 sm:p-4 rounded-lg border">
            <div className="text-xs sm:text-sm">
              <div className="font-semibold text-gray-700 mb-2 sm:mb-3">Expense Processing Summary</div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span>Expense Type:</span>
                  <span className="font-medium">{header.expenseType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vendor:</span>
                  <span className="font-medium">{vendorDetails.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invoice Amount:</span>
                  <span className="font-medium">{formatAmount(totalExpenseAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TDS Rate:</span>
                  <span className="font-medium text-red-600">10%</span>
                </div>
                <div className="flex justify-between">
                  <span>TDS Amount:</span>
                  <span className="font-medium text-red-600">{formatAmount(tdsAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Payable:</span>
                  <span className="font-medium text-green-600">{formatAmount(netPayable)}</span>
                </div>
              </div>

              {/* Approval Workflow Status */}
              <div className="mt-3 sm:mt-4 pt-3 border-t">
                <div className="font-semibold text-gray-700 mb-2 sm:mb-3">Approval Workflow</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>1. Vendor Invoice Upload:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Completed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. Billing Executive Verification:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Approved</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. Finance Head Approval:</span>
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
                <p className="text-xs sm:text-sm font-medium text-gray-700">Billing Executive</p>
                <p className="text-2xs sm:text-xs text-gray-500">{approvals.billingExecutive}</p>
                <p className="text-2xs sm:text-xs text-gray-400">{approvals.date}</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-300 pb-1 sm:pb-2 mb-1 sm:mb-2 h-8 sm:h-10"></div>
                <p className="text-xs sm:text-sm font-medium text-gray-700">Finance Head</p>
                <p className="text-2xs sm:text-xs text-gray-500">{approvals.financeHead}</p>
                <p className="text-2xs sm:text-xs text-gray-400">{approvals.date}</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-300 pb-1 sm:pb-2 mb-1 sm:mb-2 h-8 sm:h-10"></div>
                <p className="text-xs sm:text-sm font-medium text-gray-700">System Generated</p>
                <p className="text-2xs sm:text-xs text-gray-500">Auto Voucher</p>
                <p className="text-2xs sm:text-xs text-gray-400">{approvals.date}</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-3 sm:mt-4 p-2 bg-teal-50 text-teal-700 text-2xs sm:text-xs text-center rounded">
            This expense voucher has been auto-generated upon Finance Head approval. Vendor payment processing will include TDS deduction as per applicable rates. Next step: TDS Journal Voucher will be created automatically.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseVoucherModal;