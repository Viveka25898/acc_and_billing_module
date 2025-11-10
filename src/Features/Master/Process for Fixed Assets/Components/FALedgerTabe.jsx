import React from "react";

export const FALedgerTable = ({ entries = [] }) => {
  const [expandedRows, setExpandedRows] = React .useState(new Set());

  const toggleRow = (index) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const getEntryTypeClass = (type) => {
    const typeMap = {
      Opening: "bg-purple-100 text-purple-700",
      Purchase: "bg-blue-100 text-blue-700",
      Depreciation: "bg-orange-100 text-orange-700",
      Disposal: "bg-red-100 text-red-700",
      Transfer: "bg-yellow-100 text-yellow-700",
    };
    return typeMap[type] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Active: "bg-green-100 text-green-800 border-green-300",
      Disposed: "bg-red-100 text-red-800 border-red-300",
      "Under Maintenance": "bg-yellow-100 text-yellow-800 border-yellow-300",
      Posted: "bg-blue-100 text-blue-800 border-blue-300",
    };
    return statusMap[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div className="overflow-x-auto p-4 bg-white">
      <table className="min-w-full w-full border-collapse border border-gray-300">
        <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
          <tr className="border-b-2 border-gray-300">
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[50px]">#</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[100px]">Date</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[130px]">Voucher No</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Asset Tag</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">Description</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Entry Type</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[130px]">Purchase (₹)</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[130px]">Depreciation (₹)</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[140px]">NBV (₹)</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Status</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[100px]">Attachments</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.length > 0 ? (
            entries.map((e, i) => (
              <React.Fragment key={i}>
                <tr className={`hover:bg-indigo-50 transition-colors duration-150 border-b border-gray-200 ${
                  e.entryType === 'Purchase' ? 'bg-blue-50/30' : 
                  e.entryType === 'Depreciation' ? 'bg-orange-50/30' : ''
                }`}>
                  <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">
                    <button onClick={() => toggleRow(i)} className="text-blue-600 hover:text-blue-800 font-medium">
                      {expandedRows.has(i) ? '▼' : '▶'}
                    </button>
                    <span className="ml-2">{i + 1}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{e.date}</td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap">
                    <span className="text-sky-600 font-medium hover:text-sky-800 cursor-pointer hover:underline">{e.voucherNo}</span>
                  </td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap">
                    <span className="text-indigo-700 font-bold bg-indigo-100 px-2 py-1 rounded">{e.assetTag}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700 max-w-[220px]">
                    <div className="break-words font-medium">{e.assetDescription}</div>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getEntryTypeClass(e.entryType)}`}>{e.entryType}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-right text-blue-600 font-semibold whitespace-nowrap">
                    {e.purchaseValue !== '-' ? `₹${e.purchaseValue}` : '-'}
                  </td>
                  <td className="px-3 py-3 text-sm text-right text-orange-600 font-semibold whitespace-nowrap">
                    {e.depreciation !== '-' ? `₹${e.depreciation}` : '-'}
                  </td>
                  <td className="px-3 py-3 text-sm text-right text-green-700 font-bold whitespace-nowrap">
                    {e.netBookValue !== '-' ? `₹${e.netBookValue}` : '-'}
                  </td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(e.status)}`}>{e.status}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-center whitespace-nowrap">
                    {e.attachments !== '-' ? (
                      <span className="text-blue-600 cursor-pointer hover:text-blue-800 font-medium">📎 {e.attachments}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
                
                {expandedRows.has(i) && (
                  <tr className="bg-gray-50">
                    <td colSpan="11" className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700 border-b pb-1">Asset Details</h4>
                          <div className="space-y-1">
                            <p><span className="font-medium">GL Code:</span> <span className="text-blue-600 font-mono">{e.glCode}</span></p>
                            <p><span className="font-medium">Purchase Date:</span> {e.purchaseDate}</p>
                            <p><span className="font-medium">Serial Number:</span> <span className="font-mono text-xs">{e.serialNumber}</span></p>
                            <p><span className="font-medium">Location:</span> {e.location}</p>
                            <p><span className="font-medium">Warranty:</span> {e.warranty}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700 border-b pb-1">Financial Summary</h4>
                          <div className="space-y-1">
                            <p><span className="font-medium">Original Cost:</span> ₹{e.originalCost}</p>
                            <p><span className="font-medium">Accumulated Dep:</span> ₹{e.accumulatedDepreciation}</p>
                            <p><span className="font-medium">Salvage Value:</span> ₹{e.salvageValue}</p>
                            <p><span className="font-medium">Dep. Method:</span> {e.depreciationMethod}</p>
                            <p><span className="font-medium">Dep. Rate:</span> {e.depreciationRate}%</p>
                            <p><span className="font-medium">Useful Life:</span> {e.usefulLife}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700 border-b pb-1">Additional Info</h4>
                          <div className="space-y-1">
                            <p><span className="font-medium">Vendor:</span> {e.vendor}</p>
                            <p><span className="font-medium">Invoice No:</span> {e.invoiceNo}</p>
                            <p><span className="font-medium">Department:</span> {e.department}</p>
                            <p><span className="font-medium">Cost Center:</span> {e.costCenter}</p>
                            <p><span className="font-medium">Custodian:</span> {e.custodian}</p>
                            <p><span className="font-medium">Insurance:</span> {e.insurance}</p>
                            <p><span className="font-medium">AMC Status:</span> {e.amcStatus}</p>
                            <p><span className="font-medium">Approved By:</span> {e.approvedBy}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <p className="font-medium text-gray-700">Narration:</p>
                        <p className="text-gray-600 mt-1">{e.narration}</p>
                      </div>
                      
                      {e.remarks && e.remarks !== '-' && (
                        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                          <p className="font-medium text-gray-700">Remarks:</p>
                          <p className="text-gray-600 mt-1">{e.remarks}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="px-3 py-8 text-center text-gray-500">No fixed asset entries found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};