import React from "react";

const badgeStyles = {
  Approved: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Paid: "bg-blue-100 text-blue-800 border border-blue-200",
  Posted: "bg-amber-100 text-amber-900 border border-amber-200",
  Pending: "bg-rose-100 text-rose-800 border border-rose-200",
  Reversed: "bg-gray-100 text-gray-700 border border-gray-300",
};

const RentLedgerRow = ({ entry }) => {
  if (!entry) return null;

  const statusClass = badgeStyles[entry.status] || "bg-gray-100 text-gray-700 border border-gray-200";

  const attachmentUrl = entry.attachmentBundleUrl || entry.voucherLink;

  return (
    <tr className="hover:bg-emerald-50/50 transition-colors border-b border-gray-200 text-xs md:text-sm">
      <td className="p-2.5 font-medium text-gray-800 whitespace-nowrap">{entry.date || '-'}</td>
      <td className="p-2.5 font-semibold text-emerald-700 whitespace-nowrap">
        {entry.voucherLink ? (
          <a href={entry.voucherLink} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
            {entry.voucherNo}
          </a>
        ) : (
          entry.voucherNo || '-'
        )}
      </td>
      <td className="p-2.5 text-gray-700 whitespace-nowrap">
        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-medium">
          {entry.entryType || '-'}
        </span>
      </td>
      <td className="p-2.5 text-right font-medium text-rose-600 whitespace-nowrap">
        {entry.debitStr && entry.debitStr !== '-' ? `₹${entry.debitStr}` : entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
      </td>
      <td className="p-2.5 text-right font-medium text-emerald-600 whitespace-nowrap">
        {entry.creditStr && entry.creditStr !== '-' ? `₹${entry.creditStr}` : entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
      </td>
      <td className="p-2.5 text-right font-semibold text-gray-900 whitespace-nowrap">
        {entry.balance ? (entry.balance.startsWith('₹') ? entry.balance : `₹${entry.balance}`) : '-'}
      </td>
      <td className="p-2.5 text-gray-600 text-xs max-w-xs truncate" title={entry.narration || '-'}>
        {entry.narration || '-'}
      </td>
      <td className="p-2.5 text-gray-700 whitespace-nowrap">{entry.refNo || '-'}</td>
      <td className="p-2.5 text-gray-800 font-medium whitespace-nowrap">{entry.counterparty || entry.vendorName || '-'}</td>
      <td className="p-2.5 text-gray-600 whitespace-nowrap">{entry.approvedBy || '-'}</td>
      <td className="p-2.5 text-center whitespace-nowrap">
        {attachmentUrl ? (
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-800 font-medium underline text-xs inline-flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            View Doc
          </a>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )}
      </td>
      <td className="p-2.5 text-gray-700 whitespace-nowrap">{entry.costCenter || '-'}</td>
      <td className="p-2.5 text-gray-700 whitespace-nowrap">{entry.customer || '-'}</td>
      <td className="p-2.5 text-gray-700 whitespace-nowrap">{entry.site || '-'}</td>
      <td className="p-2.5 text-gray-700 whitespace-nowrap">{entry.state || '-'}</td>
      <td className="p-2.5 text-center whitespace-nowrap">
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusClass}`}>
          {entry.status || '-'}
        </span>
      </td>
    </tr>
  );
};

export default RentLedgerRow;

