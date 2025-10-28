// src/components/BankLedger/TransactionTable.jsx
import React from 'react';
import Badge from './Badge';


const TransactionTable = () => {
  const transactions = [
    {
      date: '01-Apr-24',
      voucherNo: 'OB-2024',
      entryType: 'opening',
      debit: '5,00,000.00',
      credit: '-',
      balance: '5,00,000.00 DR',
      narration: 'Opening Balance B/F FY 2024-25',
      refNo: '-',
      counterparty: '-',
      type: 'opening_type',
      approvedBy: '-',
      instrument: '-',
      valueDate: '01-Apr-24',
      tdsDetails: '-',
      status: 'posted',
      costCenter: 'Head Office',
      recon: 'reconciled',
      rowClass: 'bg-orange-50'
    },
    {
      date: '05-Apr-24',
      voucherNo: 'PAY-2024-0045',
      entryType: 'payment',
      debit: '-',
      credit: '1,16,000.00',
      balance: '3,84,000.00 DR',
      narration: 'Payment to ABC Suppliers - Invoice INV-ABC-2024-001',
      refNo: 'INV-ABC-2024-001',
      counterparty: 'L2005-VEN-ABC001',
      type: 'vendor',
      approvedBy: 'Account Manager',
      instrument: 'NEFT - HDFC24110123456',
      valueDate: '06-Apr-24',
      tdsDetails: '2,000 (TDS 194C)',
      status: 'posted',
      costCenter: 'Mumbai Branch',
      recon: 'reconciled',
      rowClass: 'bg-red-50'
    },
    {
      date: '10-Apr-24',
      voucherNo: 'PAY-2024-0056',
      entryType: 'payment',
      debit: '-',
      credit: '50,000.00',
      balance: '3,34,000.00 DR',
      narration: 'Advance to John Doe - Site Visit Mumbai',
      refNo: 'ADV-REQ-2024-001',
      counterparty: 'A3002-EMP-001',
      type: 'advance',
      approvedBy: 'VP Operations',
      instrument: 'NEFT - HDFC24110234567',
      valueDate: '11-Apr-24',
      tdsDetails: '-',
      status: 'posted',
      costCenter: 'Mumbai Branch',
      recon: 'reconciled',
      rowClass: 'bg-red-50'
    },
    // Add more transactions as needed...
  ];

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
                   transaction.type === 'advance' ? 'Advance' : 'Opening'}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;