import React from "react";

const HKLedgerTable = ({ entries = [] }) => {

  const getEntryTypeClass = (type) => {
    const typeMap = {
      Opening: "bg-purple-100 text-purple-700",
      Invoice: "bg-red-100 text-red-700",
      Payment: "bg-green-100 text-green-700",
      "Credit Note": "bg-blue-100 text-blue-700",
    };
    return typeMap[type] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="overflow-x-auto p-4 bg-white rounded-lg shadow-sm">
      <table className="min-w-full w-full border-collapse border border-gray-300">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr className="border-b-2 border-gray-300">
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[100px]">
              Date
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
              Voucher No
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[110px]">
              Entry Type
            </th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
              Debit (₹)
            </th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
              Credit (₹)
            </th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
              Balance (₹)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px]">
              Narration
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
              Ref No / Invoice
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">
              Counterparty
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
              Type
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
              Approved By
            </th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[110px]">
              Attachments
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
              Cost Center
            </th>
            
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.length > 0 ? (
            entries.map((e, i) => (
              <tr 
                key={i} 
                className={`hover:bg-blue-50 transition-colors duration-150 border-b border-gray-200 ${
                  e.entryType === 'Invoice' ? 'bg-red-50/30' : 
                  e.entryType === 'Payment' ? 'bg-green-50/30' : ''
                }`}
              >
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {e.date}
                </td>
                <td className="px-3 py-3 text-sm whitespace-nowrap">
                  <span className="text-sky-600 font-medium hover:text-sky-800 cursor-pointer hover:underline">
                    {e.voucherNo}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getEntryTypeClass(e.entryType)}`}>
                    {e.entryType}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-right text-green-600 font-semibold whitespace-nowrap">
                  {e.debit !== '-' ? `₹${e.debit}` : '-'}
                </td>
                <td className="px-3 py-3 text-sm text-right text-red-600 font-semibold whitespace-nowrap">
                  {e.credit !== '-' ? `₹${e.credit}` : '-'}
                </td>
                <td className="px-3 py-3 text-sm text-right font-semibold whitespace-nowrap">
                  <span className={e.balance.includes('CR') ? 'text-red-600' : e.balance.includes('DR') ? 'text-green-600' : 'text-gray-900'}>
                    {e.balance}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-600 max-w-[280px]">
                  <div className="break-words" title={e.narration}>
                    {e.narration.split('|')[0].trim()}
                    {e.narration.includes('|') && (
                      <div className="text-xs text-gray-500 mt-1">
                        {e.narration.split('|').slice(1).join(' | ').trim()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">
                  <span className="text-indigo-600 font-medium">{e.refNo}</span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 max-w-[200px]">
                  <div className="break-words">
                    {e.counterparty.split('(')[0].trim()}
                    {e.counterparty.includes('(') && (
                      <div className="text-xs text-gray-500 font-mono">
                        ({e.counterparty.split('(')[1]}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {e.type}
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {e.approvedBy}
                </td>
                <td className="px-3 py-3 text-sm text-center whitespace-nowrap">
                  {e.attachments !== '-' ? (
                    <span className="text-blue-600 cursor-pointer hover:text-blue-800 font-medium">
                      📎 {e.attachments}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {e.costCenter}
                </td>
               
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14" className="px-3 py-8 text-center text-gray-500">
                No entries found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HKLedgerTable;