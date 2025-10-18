import React from 'react';

const LedgerTable = ({ entries }) => {
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
      invoice: 'bg-yellow-100 text-yellow-800',
      payment: 'bg-blue-100 text-blue-800',
      'debit-note': 'bg-red-100 text-red-800',
      'credit-note': 'bg-green-100 text-green-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  };

  const getCounterpartyTypeClass = (type) => {
    const classes = {
      bank: 'bg-blue-100 text-blue-800',
      expense: 'bg-pink-100 text-pink-800',
      tds: 'bg-purple-100 text-purple-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  };

  const getRowClass = (entryType) => {
    if (entryType === 'invoice') return 'bg-yellow-50 hover:bg-yellow-100';
    if (entryType === 'payment') return 'bg-blue-50 hover:bg-blue-100';
    return 'hover:bg-gray-50';
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Voucher No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entry Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit (₹)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit (₹)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance (₹)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Narration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ref No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Counterparty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approved By
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attachments
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost Center
              </th>
              
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id} className={getRowClass(entry.entryType)}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {entry.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">
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
                  {entry.invoiceDetails && (
                    <div className="text-xs text-gray-500 mt-1">{entry.invoiceDetails}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {entry.refNo}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div>{entry.counterparty}</div>
                  {entry.counterpartyType && entry.counterpartyType !== '-' && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getCounterpartyTypeClass(entry.counterpartyType)}`}>
                      {entry.counterpartyType}
                    </span>
                  )}
                  {entry.tdsDetails && (
                    <div className="text-xs text-gray-500 mt-1">{entry.tdsDetails}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {entry.approvedBy}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                  {entry.attachments > 0 ? (
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      📎 {entry.attachments}
                    </button>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {entry.costCenter}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerTable;