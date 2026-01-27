// src/components/ExpenseHeadComponents/LedgerTable.jsx
import React from 'react';

const LedgerTable = ({ transactions }) => {
  const getEntryTypeClass = (type) => {
    const classes = {
      settlement: 'bg-blue-50 text-blue-700',
      journal: 'bg-purple-50 text-purple-700',
      expense: 'bg-red-50 text-red-700',
      opening: 'bg-yellow-50 text-orange-600',
      closing: 'bg-green-50 text-green-700',
      purchase: 'bg-indigo-50 text-indigo-700'
    };
    return classes[type] || 'bg-gray-50 text-gray-700';
  };

  const getStatusClass = (status) => {
    return status === 'posted' 
      ? 'bg-green-50 text-green-700' 
      : 'bg-yellow-50 text-orange-600';
  };

  const getRowClass = (rowType) => {
    if (rowType === 'opening') return 'bg-yellow-50 font-semibold';
    if (rowType === 'closing') return 'bg-green-50 font-semibold';
    return 'hover:bg-gray-50';
  };

  return (
    <div className="p-6 overflow-x-auto">
      <table className="w-full min-w-[2000px]">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Voucher No</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entry Type</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Debit (₹)</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Credit (₹)</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance (₹)</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Narration</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Settlement Ref</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">GL Account</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cost Center</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Site</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">State</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Approved By</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Attachments</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className={getRowClass(transaction.rowType)}>
              <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{transaction.date}</td>
              <td className="px-3 py-3 text-sm whitespace-nowrap">
                <span className="text-green-500 font-medium cursor-pointer hover:underline">
                  {transaction.voucherNo}
                </span>
              </td>
              <td className="px-3 py-3 text-sm whitespace-nowrap">
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase ${getEntryTypeClass(transaction.entryType)}`}>
                  {transaction.entryType}
                </span>
              </td>
              <td className="px-3 py-3 text-sm text-right whitespace-nowrap">
                {transaction.debit !== '-' && transaction.debit !== '0.00' ? (
                  <span className="font-semibold font-mono text-red-600">{transaction.debit}</span>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-3 py-3 text-sm text-right whitespace-nowrap">
                {transaction.credit !== '-' && transaction.credit !== '0.00' ? (
                  <span className="font-semibold font-mono text-green-600">{transaction.credit}</span>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-3 py-3 text-sm text-right whitespace-nowrap">
                <span className="font-bold font-mono text-red-600">{transaction.balance}</span>
              </td>
              <td className="px-3 py-3 text-sm text-gray-900 max-w-[350px] leading-relaxed">
                {transaction.narration}
              </td>
              <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                {transaction.settlementRef}
              </td>
              <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap max-w-[180px]">
                <div className="font-medium">{transaction.employee.name}</div>
                {transaction.employee.id && (
                  <div>
                    <span className="inline-block px-1.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 mt-1">
                      {transaction.employee.id}
                    </span>
                  </div>
                )}
              </td>
              <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                {transaction.glAccount}
              </td>
              <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                {transaction.costCenter}
              </td>
              <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                {transaction.customer || '-'}
              </td>
              <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                {transaction.site || '-'}
              </td>
              <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                {transaction.state || '-'}
              </td>
              <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                {transaction.approvedBy}
              </td>
              <td className="px-3 py-3 text-sm text-center whitespace-nowrap">
                {transaction.attachments > 0 ? (
                  <a href="#" className="text-green-500 text-xs cursor-pointer hover:underline">
                    <span className="mr-1">📎</span>
                    {transaction.attachments}
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-3 py-3 text-sm text-center whitespace-nowrap">
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase ${getStatusClass(transaction.status)}`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LedgerTable;