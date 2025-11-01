// src/components/TransactionTable.jsx
import React from 'react';
import Badge from './Badge';

const TransactionTable = ({ transactions }) => {
  const getRowClass = (rowClass) => {
    const baseClasses = "hover:bg-gray-50 transition-colors";
    const specificClasses = {
      'opening-row': 'bg-orange-50',
      'expense-row': 'bg-red-50',
      'payment-row': 'bg-green-50'
    };
    
    return `${baseClasses} ${specificClasses[rowClass] || ''}`;
  };

  const formatAmount = (amount, type = null) => {
    if (amount === null || amount === undefined) return '-';
    
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    
    if (type === 'debit') {
      return <span className="text-red-600 font-semibold font-mono">{formatted}</span>;
    } else if (type === 'credit') {
      return <span className="text-green-600 font-semibold font-mono">{formatted}</span>;
    }
    
    return <span className="font-semibold font-mono">{formatted}</span>;
  };

  const formatBalance = (balance, type) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(balance);
    
    if (type === 'zero') {
      return <span className="text-gray-600 font-bold font-mono">{formatted}</span>;
    }
    
    return (
      <span className="text-emerald-600 font-bold font-mono">
        {formatted} {type === 'credit' ? 'CR' : 'DR'}
      </span>
    );
  };

  return (
    <div className="p-6 overflow-x-auto">
      <div className="min-w-[1400px]">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-24">Date</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-32">Voucher No</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-28">Entry Type</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-28">Debit (₹)</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-28">Credit (₹)</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-32">Balance (₹)</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-80">Narration</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-36">Claim ID</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-20">Visits</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-24">Period</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-40">Counterparty</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-36">Approved By</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-20">Attach</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 w-28">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className={getRowClass(transaction.rowClass)}>
                <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{transaction.date}</td>
                <td className="px-3 py-3 text-sm whitespace-nowrap">
                  <button className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline focus:outline-none">
                    {transaction.voucherNo}
                  </button>
                </td>
                <td className="px-3 py-3 text-sm whitespace-nowrap">
                  <Badge type={transaction.entryType} />
                </td>
                <td className="px-3 py-3 text-sm text-right whitespace-nowrap">
                  {formatAmount(transaction.debit, 'debit')}
                </td>
                <td className="px-3 py-3 text-sm text-right whitespace-nowrap">
                  {formatAmount(transaction.credit, 'credit')}
                </td>
                <td className="px-3 py-3 text-sm text-right whitespace-nowrap">
                  {formatBalance(transaction.balance, transaction.balanceType)}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">{transaction.narration}</td>
                <td className="px-3 py-3 text-sm whitespace-nowrap">
                  {transaction.claimId !== '-' ? (
                    <button className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline focus:outline-none">
                      {transaction.claimId}
                    </button>
                  ) : (
                    transaction.claimId
                  )}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900 text-center whitespace-nowrap">{transaction.visits}</td>
                <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{transaction.period}</td>
                <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{transaction.counterparty}</td>
                <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{transaction.approvedBy}</td>
                <td className="px-3 py-3 text-sm text-center whitespace-nowrap">
                  {transaction.hasAttachment && (
                    <button className="text-emerald-600 hover:text-emerald-700 focus:outline-none">
                      📎
                    </button>
                  )}
                </td>
                <td className="px-3 py-3 text-sm whitespace-nowrap">
                  <Badge type={transaction.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;