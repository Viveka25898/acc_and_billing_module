// src/features/Process of Auto JV for TDS Booking/Components/TDSLedgerTable.jsx
import React from 'react';

const TDSLedgerTable = ({ entries }) => {
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getEntryTypeClass = (type) => {
    const classes = {
      opening: 'bg-gray-100 text-gray-800',
      deduction: 'bg-purple-100 text-purple-800',
      payment: 'bg-green-100 text-green-800',
      reversal: 'bg-red-100 text-red-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  };

  const getRowClass = (entryType) => {
    if (entryType === 'deduction') return 'bg-purple-50 hover:bg-purple-100';
    if (entryType === 'payment') return 'bg-green-50 hover:bg-green-100';
    return 'hover:bg-gray-50';
  };

  const getDueDateClass = (status) => {
    return status === 'overdue' ? 'text-red-600' : 'text-green-600';
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Type</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit (₹)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit (₹)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Narration</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Voucher</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor / Party</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAN</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Amount</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">TDS Rate</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">TDS Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quarter</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attachments</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id} className={getRowClass(entry.entryType)}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className="text-purple-600 font-medium cursor-pointer hover:underline">
                    {entry.voucherNo}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntryTypeClass(entry.entryType)}`}>
                    {entry.entryType}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  {entry.debit ? (
                    <span className="amount-debit">{formatCurrency(entry.debit)}</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  {entry.credit ? (
                    <span className="amount-credit">{formatCurrency(entry.credit)}</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  <span className={entry.balanceType === 'dr' ? 'balance-dr' : 'balance-cr'}>
                    {formatCurrency(entry.balance)} {entry.balanceType?.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                  <div>{entry.narration}</div>
                  {entry.vendorDetails && (
                    <div className="text-xs text-gray-500 mt-1">{entry.vendorDetails}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {entry.paymentVoucher}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                  {entry.vendor}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {entry.pan}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  {entry.paymentAmount ? formatCurrency(entry.paymentAmount) : '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  {entry.tdsRate ? (
                    <span className="text-gray-600 font-semibold">{entry.tdsRate}</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  {entry.tdsAmount ? formatCurrency(entry.tdsAmount) : '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {entry.quarter}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className={`text-xs font-semibold ${getDueDateClass(entry.dueStatus)}`}>
                    {entry.dueDate} {entry.dueStatus === 'overdue' && '(Overdue)'}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                  {entry.attachments > 0 ? (
                    <button className="text-purple-600 hover:text-purple-800 text-sm">
                      📎 {entry.attachments}
                    </button>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TDSLedgerTable;