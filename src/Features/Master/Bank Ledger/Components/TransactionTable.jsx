// src/components/BankLedger/TransactionTable.jsx - UPDATED
import React from 'react';
import Badge from './Badge';

const TransactionTable = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No bank transactions found.</p>
        <p className="text-sm mt-2">Transactions will appear here when payments are processed.</p>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-x-auto">
      <table className="w-full min-w-[2200px]">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-20">Date</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">Voucher No</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-24">Entry Type</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">Debit (₹)</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">Credit (₹)</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">Balance (₹)</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-80">Narration</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-36">Ref No</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-48">Counterparty</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-36">Type</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">Approved By</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-40">Instrument</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-24">Value Date</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">TDS Details</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-24">Status</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">Cost Center</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-36">Customer</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">Site</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">State</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className={`hover:bg-slate-50 ${transaction.rowClass}`}>
              <td className="px-2 py-3 text-sm">{transaction.date}</td>
              <td className="px-2 py-3 text-sm">
                <span className="text-orange-500 font-semibold cursor-pointer hover:underline">
                  {transaction.voucherNo}
                </span>
              </td>
              <td className="px-2 py-3 text-sm">
                <Badge type={transaction.entryType}>
                  {transaction.entryType === 'opening' ? 'Opening' : 
                   transaction.entryType === 'payment' ? 'Payment' : 'Receipt'}
                </Badge>
              </td>
              <td className={`px-2 py-3 text-sm font-semibold font-mono text-right ${
                transaction.debit !== '-' ? 'text-red-600' : ''
              }`}>
                {transaction.debit}
              </td>
              <td className={`px-2 py-3 text-sm font-semibold font-mono text-right ${
                transaction.credit !== '-' ? 'text-green-600' : ''
              }`}>
                {transaction.credit}
              </td>
              <td className="px-2 py-3 text-sm font-bold font-mono text-right text-blue-800">
                {transaction.balance}
              </td>
              <td className="px-2 py-3 text-sm">{transaction.narration}</td>
              <td className="px-2 py-3 text-sm">{transaction.refNo}</td>
              <td className="px-2 py-3 text-sm">
                <Badge type={transaction.type === 'vendor' ? 'vendor' : 'advance'}>
                  {transaction.counterparty}
                </Badge>
              </td>
              <td className="px-2 py-3 text-sm">
                <Badge type={transaction.type}>
                  {transaction.type === 'vendor' ? 'Vendor Payment' :
                   transaction.type === 'advance' ? 'Advance' : 
                   transaction.type === 'opening_type' ? 'Opening' : 'Other'}
                </Badge>
              </td>
              <td className="px-2 py-3 text-sm">{transaction.approvedBy}</td>
              <td className="px-2 py-3 text-sm">{transaction.instrument}</td>
              <td className="px-2 py-3 text-sm">{transaction.valueDate}</td>
              <td className="px-2 py-3 text-sm">{transaction.tdsDetails}</td>
              <td className="px-2 py-3 text-sm">
                <Badge type={transaction.status}>
                  {transaction.status === 'posted' ? 'Posted' : 'Pending'}
                </Badge>
              </td>
              <td className="px-2 py-3 text-sm">{transaction.costCenter}</td>
              <td className="px-2 py-3 text-sm">{transaction.customer || '-'}</td>
              <td className="px-2 py-3 text-sm">{transaction.site || '-'}</td>
              <td className="px-2 py-3 text-sm">{transaction.state || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;