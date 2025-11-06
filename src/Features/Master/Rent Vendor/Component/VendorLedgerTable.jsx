import React, { useMemo } from "react";
import VendorLedgerRow from "./VendorLedgerRow";

const VendorLedgerTable = ({ ledgerInfo, entries }) => {
  // totals calculation
  const { totalDebit, totalCredit, closingBalance } = useMemo(() => {
    const td = entries.reduce((s, e) => s + (e.debit || 0), 0);
    const tc = entries.reduce((s, e) => s + (e.credit || 0), 0);
    const cb = tc - td; // for liability ledger: credit - debit = liability closing
    return { totalDebit: td, totalCredit: tc, closingBalance: cb };
  }, [entries]);

  return (
    <div className="bg-white rounded-md shadow overflow-x-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Ledger: {ledgerInfo.ledgerCode}</div>
          <div className="text-xs text-gray-500">Period: {ledgerInfo.period}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Opening Balance</div>
          <div className="text-lg font-bold">{ledgerInfo.openingBalanceLabel}</div>
        </div>
      </div>

      <table className="min-w-[1400px] w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Date</th>
            <th className="border px-3 py-2 text-left">Voucher No</th>
            <th className="border px-3 py-2 text-left">Entry Type</th>
            <th className="border px-3 py-2 text-right">Debit (₹)</th>
            <th className="border px-3 py-2 text-right">Credit (₹)</th>
            <th className="border px-3 py-2 text-right">Balance (₹)</th>
            <th className="border px-3 py-2 text-left">Narration</th>
            <th className="border px-3 py-2 text-left">Ref No</th>
            <th className="border px-3 py-2 text-left">Counterparty</th>
            <th className="border px-3 py-2 text-left">Type</th>
            <th className="border px-3 py-2 text-left">Approved By</th>
            <th className="border px-3 py-2 text-center">Attachments</th>
            <th className="border px-3 py-2 text-left">Cost Center</th>
            <th className="border px-3 py-2 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {/* Transactions */}
          {entries.length === 0 ? (
            <tr>
              <td colSpan="14" className="p-8 text-center text-gray-500">No entries for selected period</td>
            </tr>
          ) : (
            entries.map((entry, i) => <VendorLedgerRow key={i} entry={entry} />)
          )}

          {/* Totals row */}
          <tr className="bg-yellow-50 font-semibold">
            <td colSpan={3} className="border px-3 py-2">TOTAL</td>
            <td className="border px-3 py-2 text-right">₹{totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            <td className="border px-3 py-2 text-right">₹{totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            <td colSpan={9} className="border px-3 py-2"></td>
          </tr>

          {/* Closing */}
          <tr className="bg-blue-50 font-bold">
            <td colSpan={5} className="border px-3 py-2">CLOSING BALANCE (As on {ledgerInfo.period})</td>
            <td className="border px-3 py-2 text-right">
              {/* For liability ledgers, positive closingBalance means Net Credit */}
              {closingBalance >= 0
                ? `₹${Math.abs(closingBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })} Cr`
                : `₹${Math.abs(closingBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })} Dr`}
            </td>
            <td colSpan={8} className="border px-3 py-2 text-gray-500 italic">Balance carried forward</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VendorLedgerTable;
