import React from 'react';

const RentExpenseVoucher = ({ data = {}, onClose }) => {
  console.log(data);
  
  // Extract data from the voucher and agreement
  const header = data.header || {
    company: data.company || "Company Name",
    voucherNo: data.voucherNo || `EXP-RENT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    financialYear: data.financialYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    date: data.date || new Date().toISOString().split('T')[0],
    reference: data.reference || "Monthly Rent Payment",
    preparedBy: data.preparedBy || "Billing Executive",
    expenseType: "Rent Expense",
    department: data.department || "Operations",
    approvalChain: data.approvalChain || "Billing Executive → Finance Manager → VP Operations"
  };

  // Site and owner details
  const siteDetails = data.siteDetails || {
    siteName: data.siteName || "Site Name",
    location: data.location || "Location",
    city: data.city || "City",
    state: data.state || "State",
    owner: data.owner || "Property Owner",
    agreementPeriod: data.agreementPeriod || "Agreement Period"
  };

  // Rent details from voucher
  const rentDetails = data.rentDetails || {
    month: data.month || new Date().toISOString().slice(0, 7),
    baseRent: data.baseRent || data.amount || 0,
    gstAmount: data.gstAmount || 0,
    totalAmount: data.totalAmount || data.amount || 0,
    gstType: data.gstType || "Without GST",
    withGST: data.withGST || false
  };

  // Calculate amounts
  const baseRent = rentDetails.baseRent;
  const gstAmount = rentDetails.gstAmount;
  const totalRentAmount = rentDetails.totalAmount;

  // Create accounting entries
  const lines = data.entries || [
    {
      id: 1,
      particulars: "Rent Expense",
      gl: "5002",
      costCenter: "OPS-001",
      debit: baseRent,
      credit: 0,
      note: `Monthly rent for ${siteDetails.siteName} - ${rentDetails.month}`,
    },
    ...(rentDetails.withGST ? [{
      id: 2,
      particulars: "Input GST @ 18%",
      gl: "1801",
      costCenter: "OPS-001",
      debit: gstAmount,
      credit: 0,
      note: `GST on rent payment - ${rentDetails.month}`,
    }] : []),
    {
      id: rentDetails.withGST ? 3 : 2,
      particulars: `Rent Payable - ${siteDetails.owner}`,
      gl: "2001",
      costCenter: "",
      debit: 0,
      credit: totalRentAmount,
      note: `Payment due to ${siteDetails.owner} for ${rentDetails.month}`,
    }
  ];

  const approvals = data.approvals || {
    preparer: data.preparedBy || "Billing Executive",
    reviewer: data.reviewer || "Finance Manager", 
    approver: data.approver || "VP Operations",
    date: new Date().toISOString().split('T')[0]
  };

  // Calculate totals
  const totals = {
    debit: lines.reduce((sum, line) => sum + (parseInt(line.debit) || 0), 0),
    credit: lines.reduce((sum, line) => sum + (parseInt(line.credit) || 0), 0)
  };

  // Format amount
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return "-";
    const numAmount = parseInt(amount);
    return `₹${numAmount.toLocaleString()}`;
  };

  const formatMonth = (monthStr) => {
    if (!monthStr) return "N/A";
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-green-600 text-white p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">Expense Voucher - Monthly Rent Payment</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onClose}
              className="ml-2 text-white hover:text-green-200 text-xl font-bold"
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
            <div className="md:col-span-2">
              <p className="text-xs sm:text-sm text-gray-500">Approval Chain</p>
              <p className="text-sm sm:text-base font-medium">{header.approvalChain}</p>
            </div>
          </div>

          {/* Site Details */}
          <div className="mb-4 sm:mb-6 bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-gray-600">Site Name:</span>
                <div className="font-semibold">{siteDetails.siteName}</div>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <div className="font-semibold">{siteDetails.location}</div>
              </div>
              <div>
                <span className="text-gray-600">City:</span>
                <div className="font-semibold">{siteDetails.city}</div>
              </div>
              <div>
                <span className="text-gray-600">State:</span>
                <div className="font-semibold">{siteDetails.state}</div>
              </div>
              <div>
                <span className="text-gray-600">Property Owner:</span>
                <div className="font-semibold">{siteDetails.owner}</div>
              </div>
              <div>
                <span className="text-gray-600">Agreement Period:</span>
                <div className="font-semibold">{siteDetails.agreementPeriod}</div>
              </div>
            </div>
          </div>

          {/* Rent Month and Amount Display */}
          <div className="mb-4 sm:mb-6 p-3 rounded-lg text-center bg-green-50 text-green-700">
            <p className="text-lg font-semibold">
              Rent for {formatMonth(rentDetails.month)}
            </p>
            <p className="text-sm mt-1">
              Total Amount: {formatAmount(totalRentAmount)}
            </p>
          </div>

          {/* Rent Breakdown Table */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Rent Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-xs sm:text-sm">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border">Description</th>
                    <th className="px-2 sm:px-3 py-2 text-center font-medium text-gray-700 border">Period</th>
                    <th className="px-2 sm:px-3 py-2 text-center font-medium text-gray-700 border">GST Type</th>
                    <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-700 border">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-2 sm:px-3 py-2 border font-medium">Base Rent</td>
                    <td className="px-2 sm:px-3 py-2 border text-center">{formatMonth(rentDetails.month)}</td>
                    <td className="px-2 sm:px-3 py-2 border text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rentDetails.withGST 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rentDetails.gstType}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2 border text-right font-semibold">
                      {formatAmount(baseRent)}
                    </td>
                  </tr>
                  {rentDetails.withGST && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-2 sm:px-3 py-2 border font-medium">GST @ 18%</td>
                      <td className="px-2 sm:px-3 py-2 border text-center">{formatMonth(rentDetails.month)}</td>
                      <td className="px-2 sm:px-3 py-2 border text-center">
                        <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                          Input GST
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 border text-right font-semibold">
                        {formatAmount(gstAmount)}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-green-50 font-bold">
                    <td colSpan={3} className="px-2 sm:px-3 py-2 border text-right">Total Rent Amount:</td>
                    <td className="px-2 sm:px-3 py-2 border text-right text-green-700">
                      {formatAmount(totalRentAmount)}
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

          {/* Rent Analysis */}
          <div className="mb-4 sm:mb-6 bg-slate-50 p-3 sm:p-4 rounded-lg border">
            <div className="text-xs sm:text-sm">
              <div className="font-semibold text-gray-700 mb-2 sm:mb-3">Rent Analysis</div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span>Rent Period:</span>
                  <span className="font-medium">{formatMonth(rentDetails.month)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Property:</span>
                  <span className="font-medium">{siteDetails.siteName}, {siteDetails.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Rent:</span>
                  <span className="font-medium text-blue-600">{formatAmount(baseRent)}</span>
                </div>
                {rentDetails.withGST && (
                  <div className="flex justify-between">
                    <span>GST Amount:</span>
                    <span className="font-medium text-orange-600">{formatAmount(gstAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium text-green-600">{formatAmount(totalRentAmount)}</span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mt-3 sm:mt-4 pt-3 border-t">
                <div className="font-semibold text-gray-700 mb-2 sm:mb-3">Payment Status</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Voucher Generated:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Generated</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Billing Verification:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Verified</span>
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
                <p className="text-2xs sm:text-xs text-gray-500">{approvals.preparer}</p>
                <p className="text-2xs sm:text-xs text-gray-400">{approvals.date}</p>
              </div>
              
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-3 sm:mt-4 p-2 bg-green-50 text-green-700 text-2xs sm:text-xs text-center rounded">
            This rent expense voucher has been generated based on the approved rent agreement. 
            {rentDetails.withGST && " Input GST has been calculated as per applicable rates."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentExpenseVoucher;