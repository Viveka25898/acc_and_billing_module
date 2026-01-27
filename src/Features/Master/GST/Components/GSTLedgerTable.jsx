import React from "react";

const GSTLedgerTable = ({ ledger }) => {
  if (!ledger || !ledger.entries) return null;

  // Calculate totals dynamically
  const totalDebit = ledger.entries.reduce((sum, e) => sum + (e.debit || 0), 0);
  const totalCredit = ledger.entries.reduce((sum, e) => sum + (e.credit || 0), 0);
  const closingBalance = totalDebit - totalCredit;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-3 py-2 text-left">Date</th>
            <th className="border px-3 py-2 text-left">Voucher No</th>
            <th className="border px-3 py-2 text-left">Description</th>
            <th className="border px-3 py-2 text-right">Debit (₹)</th>
            <th className="border px-3 py-2 text-right">Credit (₹)</th>
            <th className="border px-3 py-2 text-right">Balance (₹)</th>
            <th className="border px-3 py-2 text-center">Counterparty</th>
            <th className="border px-3 py-2 text-center">Ref No</th>
            <th className="border px-3 py-2 text-center">Cost Center</th>
            <th className="border px-3 py-2 text-center">Customer</th>
            <th className="border px-3 py-2 text-center">Site</th>
            <th className="border px-3 py-2 text-center">State</th>
            <th className="border px-3 py-2 text-center">Approved By</th>
            <th className="border px-3 py-2 text-center">Attachments</th>
            <th className="border px-3 py-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {/* 🔹 Opening Balance Row */}
          <tr className="bg-blue-50 font-medium">
            <td colSpan="3" className="border px-3 py-2 text-left text-gray-800">
              Opening Balance
            </td>
            <td className="border px-3 py-2 text-right text-gray-800">
              {ledger.openingBalance?.includes("Dr") ? ledger.openingBalance.replace("₹", "") : "—"}
            </td>
            <td className="border px-3 py-2 text-right text-gray-800">
              {ledger.openingBalance?.includes("Cr") ? ledger.openingBalance.replace("₹", "") : "—"}
            </td>
            <td className="border px-3 py-2 text-right text-gray-800">
              {ledger.openingBalance || "₹0.00"}
            </td>
            <td colSpan="9" className="border px-3 py-2 text-center text-gray-500 italic">
              Balance carried forward
            </td>
          </tr>

          {/* 🔹 Ledger Entries */}
          {ledger.entries.map((entry, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="border px-3 py-2">{entry.date}</td>
              <td className="border px-3 py-2 font-medium text-blue-600">{entry.voucherNo}</td>
              <td className="border px-3 py-2">{entry.description}</td>
              <td className="border px-3 py-2 text-right text-red-600 font-medium">
                {entry.debit ? entry.debit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
              </td>
              <td className="border px-3 py-2 text-right text-green-700 font-medium">
                {entry.credit ? entry.credit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
              </td>
              <td className="border px-3 py-2 text-right text-gray-800 font-semibold">
                {entry.balance}
              </td>
              <td className="border px-3 py-2 text-center text-gray-600">{entry.counterparty}</td>
              <td className="border px-3 py-2 text-center text-gray-600">{entry.refNo}</td>
              <td className="border px-3 py-2 text-center text-gray-600">{entry.costCenter}</td>
              <td className="border px-3 py-2 text-center text-gray-600">{entry.customer || '-'}</td>
              <td className="border px-3 py-2 text-center text-gray-600">{entry.site || '-'}</td>
              <td className="border px-3 py-2 text-center text-gray-600">{entry.state || '-'}</td>
              <td className="border px-3 py-2 text-center text-gray-600">{entry.approvedBy}</td>
              <td className="border px-3 py-2 text-center text-blue-500 cursor-pointer hover:underline">
                📎 ({entry.attachments})
              </td>
              <td className="border px-3 py-2 text-center">
                <span
                  className={`px-2 py-1 text-xs rounded-md font-semibold ${
                    entry.status === "Posted"
                      ? "bg-yellow-100 text-yellow-800"
                      : entry.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {entry.status}
                </span>
              </td>
            </tr>
          ))}

          {/* 🔹 Total Row */}
          <tr className="bg-yellow-50 font-semibold">
            <td colSpan="3" className="border px-3 py-2 text-left">Total</td>
            <td className="border px-3 py-2 text-right">
              ₹{totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>
            <td className="border px-3 py-2 text-right">
              ₹{totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>
            <td colSpan="7" className="border px-3 py-2 text-center"></td>
          </tr>

          {/* 🔹 Closing Balance Row */}
          <tr className="bg-blue-100 font-bold">
            <td colSpan="5" className="border px-3 py-2 text-left">
              Closing Balance (as on {ledger.period})
            </td>
            <td className="border px-3 py-2 text-right text-gray-900">
              ₹{Math.abs(closingBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}{" "}
              {closingBalance >= 0 ? "Dr" : "Cr"}
            </td>
            <td colSpan="6" className="border px-3 py-2 text-center text-gray-600 italic">
              Balance carried forward
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GSTLedgerTable;
