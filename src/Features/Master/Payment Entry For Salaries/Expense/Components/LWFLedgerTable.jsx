import React from 'react'

const LWFLedgerTable = ({ transactions }) => {
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Accrued':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Late Paid':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getContributionTypeColor = (type) => {
    switch (type) {
      case 'Half-Yearly':
        return 'bg-purple-100 text-purple-800'
      case 'Monthly':
        return 'bg-pink-100 text-pink-800'
      case 'Annual':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Group transactions by month
  const groupedByMonth = transactions.reduce((groups, transaction) => {
    const month = transaction.date.split('-')[1] // Extract month from date
    if (!groups[month]) {
      groups[month] = []
    }
    groups[month].push(transaction)
    return groups
  }, {})

  const monthNames = {
    '04': 'APRIL 2024',
    '05': 'MAY 2024',
    '06': 'JUNE 2024',
    '07': 'JULY 2024',
    '08': 'AUGUST 2024',
    '09': 'SEPTEMBER 2024',
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-700 to-pink-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Voucher Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                State / Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Particulars / Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Employee Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Debit (₹)
                <br />
                <span className="text-xs font-normal">Expense</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Credit (₹)
                <br />
                <span className="text-xs font-normal">Reversal</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Running Total (₹)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedByMonth).map(([month, monthTransactions]) => (
              <React.Fragment key={month}>
                {/* Month Separator Row */}
                <tr className="bg-gradient-to-r from-yellow-50 to-orange-50">
                  <td
                    colSpan="8"
                    className="px-4 py-3 font-bold text-gray-900 border-t-2 border-b-2 border-orange-300"
                  >
                    📅 {monthNames[month] || `MONTH ${month}`}
                  </td>
                </tr>

                {/* Month Transactions */}
                {monthTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-purple-50 transition-colors">
                    {/* Column 1: Date */}
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">{transaction.date}</div>
                      {transaction.lwfPeriod !== '-' && (
                        <div className="text-xs text-gray-500">{transaction.lwfPeriod}</div>
                      )}
                    </td>

                    {/* Column 2: Voucher Details */}
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-purple-600">{transaction.voucherNo}</div>
                      <div className="text-xs text-gray-600">{transaction.voucherType}</div>
                    </td>

                    {/* Column 3: State / Location */}
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-gray-900">{transaction.state}</div>
                      <div className="text-xs text-gray-600">{transaction.location}</div>
                      <div
                        className={`inline-flex px-2 py-1 mt-1 text-xs font-medium rounded-full ${getContributionTypeColor(transaction.contributionType)}`}
                      >
                        {transaction.contributionType}
                      </div>
                    </td>

                    {/* Column 4: Particulars / Description */}
                    <td className="px-4 py-3 text-sm">
                      <div className="text-gray-900 font-medium">{transaction.particulars}</div>
                      {transaction.ratePerEmployee !== '-' && (
                        <div className="text-xs text-gray-600 mt-1">
                          Rate: {transaction.ratePerEmployee}
                        </div>
                      )}
                      <div
                        className="text-xs text-gray-500 mt-1 truncate max-w-xs"
                        title={transaction.narration}
                      >
                        {transaction.narration}
                      </div>
                      {transaction.lwfChallanNo !== '-' && (
                        <div className="text-xs font-mono mt-1">
                          Challan: {transaction.lwfChallanNo}
                        </div>
                      )}
                      {transaction.paymentStatus !== '-' && (
                        <div
                          className={`inline-flex px-2 py-1 mt-1 text-xs font-medium rounded-full ${getPaymentStatusColor(transaction.paymentStatus)}`}
                        >
                          {transaction.paymentStatus}
                        </div>
                      )}
                    </td>

                    {/* Column 5: Employee Details */}
                    <td className="px-4 py-3 text-sm">
                      {transaction.employeeCount !== '-' ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {transaction.employeeCount} employees
                          </div>
                          {transaction.dueDate !== '-' && (
                            <div className="text-xs text-gray-600 mt-1">
                              Due: {transaction.dueDate}
                            </div>
                          )}
                          {transaction.paymentDate !== '-' && (
                            <div className="text-xs text-gray-600">
                              Paid: {transaction.paymentDate}
                            </div>
                          )}
                          {transaction.paymentDelay && (
                            <div className="text-xs text-red-600 font-medium">
                              Delay: {transaction.paymentDelay} days
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>

                    {/* Column 6: Debit (₹) */}
                    <td className="px-4 py-3 text-sm">
                      {transaction.debit !== '-' ? (
                        <div className="font-bold text-red-600 text-right">{transaction.debit}</div>
                      ) : (
                        <div className="text-gray-400 text-center">-</div>
                      )}
                    </td>

                    {/* Column 7: Credit (₹) */}
                    <td className="px-4 py-3 text-sm">
                      {transaction.credit !== '-' ? (
                        <div className="font-bold text-green-600 text-right">
                          {transaction.credit}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center">-</div>
                      )}
                    </td>

                    {/* Column 8: Running Total (₹) */}
                    <td className="px-4 py-3 text-sm">
                      <div className="font-bold text-purple-600 text-right">
                        {transaction.balance}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>

          {/* Total Row */}
          <tfoot className="bg-gradient-to-r from-teal-50 to-blue-50">
            <tr>
              <td colSpan="5" className="px-4 py-4 text-right text-sm font-bold text-gray-900">
                HALF-YEAR TOTAL (H1 FY 2024-25)
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-red-600">
                ₹{' '}
                {transactions
                  .reduce((sum, t) => sum + parseInt(t.debit.replace(/[^0-9]/g, '') || 0), 0)
                  .toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-green-600">
                ₹{' '}
                {transactions
                  .reduce((sum, t) => sum + parseInt(t.credit.replace(/[^0-9]/g, '') || 0), 0)
                  .toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-purple-900">
                ₹ {transactions.length > 0 ? transactions[transactions.length - 1].balance : '0.00'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default LWFLedgerTable
