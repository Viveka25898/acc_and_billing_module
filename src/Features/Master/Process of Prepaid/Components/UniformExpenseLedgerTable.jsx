// src/components/UniformExpenseLedgerTable.jsx
import React from "react";
const UniformExpenseLedgerTable = ({ data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-b-lg border-t border-gray-200">
      <table className="min-w-[1100px] w-full text-sm text-gray-800 border-collapse">
        <thead className="bg-gray-100 text-xs uppercase text-gray-600 border-b-2 border-gray-300 sticky top-0 z-10">
          <tr>
            {[
              "#",
              "Date",
              "Voucher No",
              "Invoice #",
              "Asset Tag",
              "Description",
              "Entry Type",
              "Debit (₹)",
              "Credit (₹)",
              "Purchase (₹)",
              "Attachments",
            ].map((heading) => (
              <th
                key={heading}
                className="px-4 py-3 text-left font-semibold whitespace-nowrap"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data && data.length > 0 ? (
            data.map((entry, idx) => (
              <tr
                key={entry.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-center">{idx + 1}</td>
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2 font-mono text-indigo-700">
                  {entry.voucherNo}
                </td>
                <td className="px-4 py-2 font-mono text-blue-700">
                  {entry.invoiceNumber || entry.refNo || '-'}
                </td>
                <td className="px-4 py-2">{entry.assetTag}</td>
                <td className="px-4 py-2">{entry.description}</td>
                <td className="px-4 py-2">{entry.entryType}</td>
                <td className="px-4 py-2 text-right font-mono text-gray-900">
                  {entry.debit || '-'}
                </td>
                <td className="px-4 py-2 text-right font-mono text-gray-900">
                  {entry.credit || '-'}
                </td>
                <td className="px-4 py-2 text-right font-mono text-gray-900">
                  {entry.purchaseAmount}
                </td>
                

               

                <td className="px-4 py-2 flex items-center gap-2">
                  <a
                    href={`/${entry.attachments}`}
                    className="text-blue-600 text-xs hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {entry.attachments}
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="11"
                className="text-center text-gray-500 py-6 italic"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UniformExpenseLedgerTable;
