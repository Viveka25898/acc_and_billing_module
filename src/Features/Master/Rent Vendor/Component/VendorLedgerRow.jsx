import React from "react";

const statusClasses = {
  Posted: "bg-yellow-100 text-yellow-800",
  Paid: "bg-blue-100 text-blue-800",
  Pending: "bg-red-100 text-red-700",
};

const VendorLedgerRow = ({ entry }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="border px-3 py-2 text-sm">{entry.displayDate || entry.date}</td>
      <td className="border px-3 py-2 text-sm font-medium text-blue-600">{entry.voucherNo}</td>
      <td className="border px-3 py-2 text-sm">{entry.entryType}</td>
      <td className="border px-3 py-2 text-right text-red-600 font-medium">
        {entry.debit ? entry.debit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
      </td>
      <td className="border px-3 py-2 text-right text-green-700 font-medium">
        {entry.credit ? entry.credit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
      </td>
      <td className="border px-3 py-2 text-right font-semibold">{entry.balance}</td>
      <td className="border px-3 py-2 text-sm text-gray-600 max-w-xs whitespace-pre-line">{entry.narration}</td>
      <td className="border px-3 py-2 text-sm">{entry.refNo}</td>
      <td className="border px-3 py-2 text-sm whitespace-pre">{entry.counterparty}</td>
      <td className="border px-3 py-2 text-sm">{entry.type}</td>
      <td className="border px-3 py-2 text-sm">{entry.approvedBy}</td>
      <td className="border px-3 py-2 text-center">
        <a href="#" className="text-blue-600 underline text-sm">📎 View ({entry.attachments})</a>
      </td>
      <td className="border px-3 py-2 text-sm">{entry.costCenter}</td>
      <td className="border px-3 py-2 text-center">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClasses[entry.status] || "bg-gray-100 text-gray-800"}`}>
          {entry.status}
        </span>
      </td>
    </tr>
  );
};

export default VendorLedgerRow;
