import React from "react";
import RentLedgerRow from "./RentLedgerRow";

const RentLedgerTable = ({ ledger, footerInfo }) => {
  const entries = ledger?.entries || [];

  const totalDebit = footerInfo?.totalDebit ?? ledger?.summary?.totalDebit ?? 0;
  const totalCredit = footerInfo?.totalCredit ?? ledger?.summary?.totalCredit ?? 0;
  const netExpense = footerInfo?.netExpenseAmount ?? (totalDebit - totalCredit);
  const closingBalance = footerInfo?.closingBalance || ledger?.summary?.closingBalance || '0.00 DR';
  const totalVouchers = footerInfo?.totalVouchersProcessed ?? entries.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1250px]">
        <thead>
          <tr className="bg-gray-100/90 text-gray-700 font-semibold border-b border-gray-300 text-xs md:text-sm">
            <th className="p-3 border-r border-gray-200">Date</th>
            <th className="p-3 border-r border-gray-200">Voucher No</th>
            <th className="p-3 border-r border-gray-200">Entry Type</th>
            <th className="p-3 border-r border-gray-200 text-right">Debit (₹)</th>
            <th className="p-3 border-r border-gray-200 text-right">Credit (₹)</th>
            <th className="p-3 border-r border-gray-200 text-right">Balance (₹)</th>
            <th className="p-3 border-r border-gray-200 max-w-xs">Narration</th>
            <th className="p-3 border-r border-gray-200">Ref / Claim No</th>
            <th className="p-3 border-r border-gray-200">Counterparty</th>
            <th className="p-3 border-r border-gray-200">Approved By</th>
            <th className="p-3 border-r border-gray-200 text-center">Attachment</th>
            <th className="p-3 border-r border-gray-200">Cost Center</th>
            <th className="p-3 border-r border-gray-200">Customer</th>
            <th className="p-3 border-r border-gray-200">Site</th>
            <th className="p-3 border-r border-gray-200">State</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.length > 0 ? (
            entries.map((entry, i) => (
              <RentLedgerRow key={entry.id || i} entry={entry} />
            ))
          ) : (
            <tr>
              <td colSpan="16" className="p-8 text-center text-gray-500 bg-gray-50/50">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-600">No ledger entries found</p>
                  <p className="text-xs text-gray-400">Try adjusting your date range or filter criteria.</p>
                </div>
              </td>
            </tr>
          )}

          {/* Period Total Row */}
          <tr className="bg-emerald-50/80 font-bold border-t-2 border-emerald-500 text-gray-900 text-xs md:text-sm">
            <td colSpan="3" className="p-3 text-right uppercase tracking-wider text-emerald-900">
              Period Total ({totalVouchers} Vouchers)
            </td>
            <td className="p-3 text-right text-rose-700 font-bold">
              ₹{totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td className="p-3 text-right text-emerald-700 font-bold">
              ₹{totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td className="p-3 text-right text-emerald-950 font-bold">
              ₹{netExpense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td colSpan="10" className="p-3 text-xs font-normal text-emerald-800">
              Net Expense Amount: ₹{netExpense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
          </tr>

          {/* Final Closing Balance Row */}
          <tr className="bg-emerald-800 text-white font-extrabold text-xs md:text-sm">
            <td colSpan="3" className="p-3 uppercase tracking-wider text-emerald-100">
              CLOSING BALANCE
            </td>
            <td colSpan="3" className="p-3 text-right text-yellow-300 text-sm md:text-base">
              {typeof closingBalance === 'number'
                ? `₹${closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} DR`
                : (closingBalance.startsWith('₹') ? closingBalance : `₹${closingBalance}`)}
            </td>
            <td colSpan="10" className="p-3 text-xs font-medium text-emerald-200">
              Account Ledger Status: Active & Reconciled
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RentLedgerTable;

