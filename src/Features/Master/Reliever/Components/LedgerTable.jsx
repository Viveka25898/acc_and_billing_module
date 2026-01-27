import React from 'react';

const LedgerTable = ({ transactions }) => {
  const getBadgeClass = (type) => {
    switch (type) {
      case 'Payment':
        return 'bg-green-100 text-green-800';
      case 'Bulk Payment':
        return 'bg-blue-100 text-blue-800';
      case 'Opening':
      case 'Closing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRowClass = (rowType) => {
    switch (rowType) {
      case 'opening':
        return 'bg-yellow-50 font-semibold';
      case 'bulk':
        return 'bg-blue-50';
      default:
        return 'hover:bg-pink-50 transition-colors duration-150';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 pb-6 md:pb-8">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-3 py-3 md:px-4 md:py-4 text-left font-semibold uppercase tracking-wider text-xs">
                Date
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-left font-semibold uppercase tracking-wider text-xs">
                Voucher No
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-left font-semibold uppercase tracking-wider text-xs">
                Type
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-right font-semibold uppercase tracking-wider text-xs">
                Debit (₹)
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-right font-semibold uppercase tracking-wider text-xs">
                Credit (₹)
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-right font-semibold uppercase tracking-wider text-xs">
                Balance (₹)
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-left font-semibold uppercase tracking-wider text-xs">
                Narration
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-left font-semibold uppercase tracking-wider text-xs">
                Reliever Name
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-left font-semibold uppercase tracking-wider text-xs">
                Replaced Employee
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-left font-semibold uppercase tracking-wider text-xs">
                Site
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-left font-semibold uppercase tracking-wider text-xs">
                Customer
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-left font-semibold uppercase tracking-wider text-xs">
                State
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-center font-semibold uppercase tracking-wider text-xs">
                Days
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-right font-semibold uppercase tracking-wider text-xs">
                Rate/Day
              </th>
              <th className="px-3 py-3 md:px-4 md:py-4 text-left font-semibold uppercase tracking-wider text-xs">
                Approved By
              </th>
              
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={getRowClass(transaction.rowType)}
              >
                <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                  {transaction.date}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                  {transaction.voucherNo.startsWith('PAY-') ? (
                    <a
                      href="#"
                      className="text-green-500 hover:text-green-700 font-medium hover:underline"
                    >
                      {transaction.voucherNo}
                    </a>
                  ) : (
                    transaction.voucherNo
                  )}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getBadgeClass(
                      transaction.type
                    )}`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 text-right whitespace-nowrap">
                  {transaction.debit ? (
                    <span className="text-red-600 font-semibold">
                      {formatCurrency(transaction.debit)}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 text-right whitespace-nowrap">
                  {transaction.credit ? (
                    <span className="text-green-600 font-semibold">
                      {formatCurrency(transaction.credit)}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 text-right whitespace-nowrap font-bold text-pink-600">
                  {formatCurrency(transaction.balance)}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 max-w-xs">
                  {transaction.narration}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                  <span className="text-pink-600 font-semibold">
                    {transaction.relieverName}
                  </span>
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                  <span className="text-gray-600 text-xs">
                    {transaction.replacedEmployee}
                  </span>
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                  {transaction.site !== '-' ? (
                    <span className="inline-flex bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg text-xs font-semibold">
                      {transaction.site}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 text-sm text-gray-700">
                  {transaction.customer || '-'}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 text-sm text-gray-700">
                  {transaction.state || '-'}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 text-center whitespace-nowrap">
                  {transaction.days}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 text-right whitespace-nowrap">
                  {transaction.ratePerDay
                    ? `₹${transaction.ratePerDay.toLocaleString('en-IN')}`
                    : '-'}
                </td>
                <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                  {transaction.approvedBy}
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