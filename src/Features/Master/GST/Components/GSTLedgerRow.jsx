import React from "react";

const GSTLedgerRow = ({ entry }) => {
  const badgeColors = {
    Posted: "bg-yellow-100 text-yellow-800",
    Pending: "bg-red-100 text-red-700",
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="border px-2 py-1">{entry.date}</td>
      <td className="border px-2 py-1 text-blue-600 font-medium">
        {entry.voucherNo}
      </td>
      <td className="border px-2 py-1 text-gray-700 text-sm">
        {entry.description}
      </td>
      <td className="border px-2 py-1 text-right text-red-600 font-medium">
        {entry.debit ? entry.debit.toLocaleString("en-IN") : "-"}
      </td>
      <td className="border px-2 py-1 text-right text-green-600 font-medium">
        {entry.credit ? entry.credit.toLocaleString("en-IN") : "-"}
      </td>
      <td className="border px-2 py-1 text-right font-semibold">
        {entry.balance}
      </td>
      <td className="border px-2 py-1">{entry.counterparty}</td>
      <td className="border px-2 py-1">{entry.refNo}</td>
      <td className="border px-2 py-1">{entry.costCenter}</td>
      <td className="border px-2 py-1">{entry.approvedBy}</td>
      <td className="border px-2 py-1 text-center">
        <a href="#" className="text-blue-600 underline text-xs">
          📎 {entry.attachments}
        </a>
      </td>
      <td className="border px-2 py-1 text-center">
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${badgeColors[entry.status]}`}
        >
          {entry.status}
        </span>
      </td>
    </tr>
  );
};

export default GSTLedgerRow;
