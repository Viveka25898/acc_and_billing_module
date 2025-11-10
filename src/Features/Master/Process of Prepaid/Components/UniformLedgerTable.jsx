import React from "react";

const UniformLedgerTable = ({ data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-b-lg border-t border-gray-200">
      <table className="min-w-full text-sm text-gray-800 border-collapse">
        <thead className="bg-gray-100 text-xs uppercase text-gray-600 border-b-2 border-gray-300 sticky top-0 z-10">
          <tr>
            {[
              "S.No",
              "Date",
              "Voucher Type",
              "Description",
              "Vendor",
              "Prepaid Amount (₹)",
              "Period Covered",
              "Months",
              "Monthly Amort. (₹)",
              "Counterparty",
              "Approved By",
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
                key={entry.id || idx}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-center font-medium">{idx + 1}</td>
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2 font-medium text-indigo-700">
                  {entry.voucherType}
                </td>
                <td className="px-4 py-2">{entry.description}</td>
                <td className="px-4 py-2">{entry.vendor}</td>
                <td className="px-4 py-2 text-right font-mono">
                  {entry.prepaidAmount}
                </td>
                <td className="px-4 py-2">{entry.period}</td>
                <td className="px-4 py-2 text-center">{entry.totalMonths}</td>
                <td className="px-4 py-2 text-right font-mono">
                  {entry.monthlyAmort}
                </td>
                <td className="px-4 py-2">{entry.counterparty || "—"}</td>
                <td className="px-4 py-2">{entry.approvedBy}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="12"
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

export default UniformLedgerTable;
