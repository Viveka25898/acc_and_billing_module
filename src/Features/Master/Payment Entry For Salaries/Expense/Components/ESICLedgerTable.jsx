import React from 'react'

const ESICLedgerTable = ({ transactions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Late Paid':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDelayDaysColor = (days) => {
    if (days === 0 || days === '-' || days < 0) return 'text-green-600'
    if (days > 0 && days <= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDelayText = (days) => {
    if (days === '-') return ''
    if (days < 0) return `${Math.abs(days)} days early`
    if (days === 0) return 'On time'
    return `${days} days late`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Sr
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                ESIC Month & Branch
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Voucher Details
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Wage Details
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                ESIC Calculation
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                ESIC Compliance
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Amounts
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-blue-50">
                {/* Column 1: Sr No */}
                <td className="px-3 py-3 text-sm text-center text-gray-900">{transaction.id}</td>

                {/* Column 2: ESIC Month & Branch */}
                <td className="px-3 py-3 text-sm">
                  <div className="font-medium text-gray-900">{transaction.esicMonth}</div>
                  <div className="text-xs text-gray-600">{transaction.branchCostCenter}</div>
                  <div className="text-xs text-gray-500">
                    {transaction.esiEligibleEmployees}/{transaction.employeeCount} employees
                  </div>
                  <div className="text-xs text-gray-500">{transaction.esiLocation}</div>
                </td>

                {/* Column 3: Voucher Details */}
                <td className="px-3 py-3 text-sm">
                  <div className="font-medium text-blue-600">{transaction.voucherNo}</div>
                  <div className="text-xs text-gray-600">{transaction.voucherType}</div>
                  <div className="text-xs text-gray-500">{transaction.postingDate}</div>
                  <div className="text-xs text-gray-400">Posted by: {transaction.postedBy}</div>
                </td>

                {/* Column 4: Wage Details */}
                <td className="px-3 py-3 text-sm">
                  <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-xs text-gray-600">Total Wages:</span>
                      <span className="text-xs font-medium">{transaction.totalWages}</span>
                      <span className="text-xs text-gray-600">ESI Wages:</span>
                      <span className="text-xs font-medium text-blue-600">
                        {transaction.esiWages}
                      </span>
                      <span className="text-xs text-gray-600">Non-ESI:</span>
                      <span className="text-xs text-gray-500">{transaction.nonEsiWages}</span>
                    </div>
                    <div className="text-xs text-gray-500">Ceiling: {transaction.wageCeiling}</div>
                  </div>
                </td>

                {/* Column 5: ESIC Calculation */}
                <td className="px-3 py-3 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Emp @ {transaction.employeeRate}:</span>
                      <span className="font-medium">{transaction.employeeContribution}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Empr @ {transaction.employerRate}:</span>
                      <span className="font-medium text-green-600">
                        {transaction.employerContribution}
                      </span>
                    </div>
                    <div className="pt-1 border-t border-gray-200">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Total:</span>
                        <span>{transaction.totalContribution}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Column 6: ESIC Compliance */}
                <td className="px-3 py-3 text-sm">
                  <div className="space-y-1">
                    <div>
                      <div className="text-xs text-gray-600">TRRN:</div>
                      <div className="text-xs font-mono">{transaction.trrnNo}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Challan:</div>
                      <div
                        className={`text-xs font-mono ${transaction.esiChallanNo === 'Pending' ? 'text-amber-600' : 'font-medium'}`}
                      >
                        {transaction.esiChallanNo}
                      </div>
                    </div>
                    {transaction.penaltyAmount !== '-' && transaction.penaltyAmount !== '₹ 0' && (
                      <div className="pt-1 border-t border-gray-200">
                        <div className="flex justify-between text-xs">
                          <span className="text-red-600">Penalty:</span>
                          <span className="font-bold text-red-600">
                            {transaction.penaltyAmount}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                {/* Column 7: Payment Status */}
                <td className="px-3 py-3 text-sm">
                  <div className="space-y-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.paymentStatus)}`}
                    >
                      {transaction.paymentStatus}
                    </span>
                    <div className="text-xs">
                      <div className="text-gray-600">Due: {transaction.dueDate}</div>
                      <div className="text-gray-600">Paid: {transaction.paymentDate}</div>
                      {transaction.returnFilingDate !== '-' && (
                        <div className="text-gray-500">Filed: {transaction.returnFilingDate}</div>
                      )}
                      <div
                        className={`text-xs font-medium ${getDelayDaysColor(transaction.delayDays)}`}
                      >
                        {getDelayText(transaction.delayDays)}
                      </div>
                    </div>
                    {transaction.paymentMode !== '-' && (
                      <div className="text-xs text-gray-500">Mode: {transaction.paymentMode}</div>
                    )}
                  </div>
                </td>

                {/* Column 8: Amounts */}
                <td className="px-3 py-3 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Employer:</span>
                      <span className="text-sm font-bold text-red-600">{transaction.debit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Credit:</span>
                      <span className="text-xs text-gray-500">{transaction.credit}</span>
                    </div>
                    {transaction.penaltyAmount !== '-' && transaction.penaltyAmount !== '₹ 0' && (
                      <div className="pt-1 border-t border-gray-200">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Total Debit:</span>
                          <span className="font-bold text-red-600">
                            ₹{' '}
                            {parseInt(transaction.debit.replace(/[^0-9]/g, '') || '0') +
                              parseInt(transaction.penaltyAmount.replace(/[^0-9]/g, '') || '0') +
                              parseInt(
                                transaction.interestAmount?.replace(/[^0-9]/g, '') || '0'
                              ).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="pt-1 border-t border-gray-200">
                      <div className="text-xs text-gray-500 truncate" title={transaction.narration}>
                        {transaction.narration}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Column 9: Balance */}
                <td className="px-3 py-3 text-sm">
                  <div className="text-center">
                    <div
                      className={`text-sm font-bold ${
                        transaction.balance.includes('Dr')
                          ? 'text-red-600'
                          : transaction.balance.includes('Cr')
                            ? 'text-green-600'
                            : 'text-gray-600'
                      }`}
                    >
                      {transaction.balance}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {transaction.medicalDispensary && (
                        <div
                          className="truncate max-w-[120px]"
                          title={transaction.medicalDispensary}
                        >
                          {transaction.medicalDispensary.split(',')[0]}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ESICLedgerTable
