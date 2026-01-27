import React from "react";
import RentLedgerRow from "./RentLedgerRow";

const RentLedgerTable = ({ ledger }) => {
  const entries = ledger?.entries || [];
  const totalDebit = ledger?.summary?.totalDebit || 0;
  const totalCredit = ledger?.summary?.totalCredit || 0;
  const closingBalance = ledger?.summary?.closingBalance || 0;
  return (
    <div className="overflow-x-auto p-3 md:p-4">
      <table className="min-w-[1200px] w-full border border-gray-300 text-xs md:text-sm">
        <thead className="bg-gray-100">
          <tr className="text-gray-700 text-left">
            <th className="border p-2">Date</th>
            <th className="border p-2">Voucher No</th>
            <th className="border p-2">Entry Type</th>
            <th className="border p-2 text-right">Debit (₹)</th>
            <th className="border p-2 text-right">Credit (₹)</th>
            <th className="border p-2 text-right">Balance (₹)</th>
            <th className="border p-2">Narration</th>
            <th className="border p-2">Ref No</th>
            <th className="border p-2">Counterparty</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Approved By</th>
            <th className="border p-2 text-center">Attachments</th>
            <th className="border p-2">Cost Center</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Site</th>
            <th className="border p-2">State</th>
            <th className="border p-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <RentLedgerRow key={i} entry={entry} />
          ))}

          {/* Total Row */}
          <tr className="bg-yellow-100 font-semibold">
            <td colSpan="3" className="border p-2">
              TOTAL
            </td>
            <td className="border p-2 text-right">
              {totalDebit.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </td>
            <td className="border p-2 text-right">
              {totalCredit.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </td>
            <td colSpan="12" className="border p-2"></td>
          </tr>

          {/* Closing Row */}
          <tr className="bg-blue-100 font-bold">
            <td colSpan="5" className="border p-2">
              CLOSING BALANCE (As on 31-Oct-2024)
            </td>
            <td className="border p-2 text-right">{closingBalance}</td>
            <td colSpan="11" className="border p-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RentLedgerTable;
