import React from "react";

export default function UnifiedGSTR2BRecoTable({ data }) {
  return (
    <div className="overflow-auto border rounded-md shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Invoice No</th>
            <th className="px-4 py-2 text-left">GSTIN</th>
            <th className="px-4 py-2 text-left">Vendor</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-center">In GSTR-2B</th>
            <th className="px-4 py-2 text-center">In Books</th>
            <th className="px-4 py-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => {
            const isMatched = entry.inGSTR2B && entry.inBooks;
            const status = isMatched
              ? "Matched"
              : entry.inGSTR2B
              ? "Only in GSTR-2B"
              : "Only in Books";
            const statusColor = isMatched
              ? "text-green-600"
              : entry.inGSTR2B
              ? "text-red-600"
              : "text-yellow-600";
            return (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{entry.invoiceNo}</td>
                <td className="px-4 py-2">{entry.gstin}</td>
                <td className="px-4 py-2">{entry.vendor}</td>
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2">₹{entry.amount}</td>
                <td className="px-4 py-2 text-center">{entry.inGSTR2B ? "✅" : "❌"}</td>
                <td className="px-4 py-2 text-center">{entry.inBooks ? "✅" : "❌"}</td>
                <td className={`px-4 py-2 text-center font-semibold ${statusColor}`}>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
