import React from "react";

const badgeStyles = {
  Approved: "bg-emerald-100 text-emerald-700",
  Paid: "bg-blue-100 text-blue-700",
  Posted: "bg-yellow-100 text-amber-800",
  Pending: "bg-red-100 text-red-700",
};

const RentLedgerRow = ({ entry }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="border p-2">{entry.date}</td>
      <td className="border p-2 text-blue-600 font-medium">{entry.voucherNo}</td>
      <td className="border p-2">{entry.entryType}</td>
      <td className="border p-2 text-right text-red-600 font-medium">
        {entry.debit ? entry.debit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
      </td>
      <td className="border p-2 text-right text-green-600 font-medium">
        {entry.credit ? entry.credit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
      </td>
      <td className="border p-2 text-right font-semibold">{entry.balance}</td>
      <td className="border p-2 text-gray-600 text-[11px]">{entry.narration}</td>
      <td className="border p-2">{entry.refNo}</td>
      <td className="border p-2">{entry.counterparty}</td>
      <td className="border p-2">{entry.ledgerType}</td>
      <td className="border p-2">{entry.approvedBy}</td>
      <td className="border p-2 text-center">
        <a href="#" className="text-blue-600 underline text-xs">
          📎 View ({entry.attachments})
        </a>
      </td>
      <td className="border p-2">{entry.costCenter}</td>
      <td className="border p-2">{entry.customer || '-'}</td>
      <td className="border p-2">{entry.site || entry.siteName || '-'}</td>
      <td className="border p-2">{entry.state || '-'}</td>
      <td className="border p-2 text-center">
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${badgeStyles[entry.status]}`}
        >
          {entry.status}
        </span>
      </td>
    </tr>
  );
};

export default RentLedgerRow;
