/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { ledgerData } from '../data/bonusData'

const BonusTable = () => {
  const [showAddModal, setShowAddModal] = useState(false)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddPayment = () => {
    const currentDate = new Date()
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const currentMonth = monthNames[currentDate.getMonth()]
    const currentYear = currentDate.getFullYear()

    alert(
      `Add Monthly Bonus Payment for ${currentMonth} ${currentYear}\n\nThis would open a form to record payment details.`
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const totalBonus = ledgerData.reduce((sum, item) => sum + item.bonusAmount, 0)
  const totalEmployees = ledgerData.reduce((sum, item) => sum + item.employeeCount, 0)

  // Calculate total debit and credit for the footer
  const totalDebit = ledgerData.reduce((sum, item) => sum + item.bonusAmount, 0)
  const totalCredit = ledgerData.reduce((sum, item) => {
    // If status is 'Paid', count as credit (payment made)
    return item.status === 'Paid' ? sum + item.bonusAmount : sum
  }, 0)

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-teal-800 flex items-center gap-3">
          <i className="fas fa-book"></i>
          Monthly Bonus Payment Ledger
        </h2>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
          >
            <i className="fas fa-print"></i>
            Print
          </button>

          <button
            onClick={handleAddPayment}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 font-medium"
          >
            <i className="fas fa-plus"></i>
            Add Monthly Payment
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Payment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Month
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Transaction Ref
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Bonus Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                No. of Employees
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Debit (Bonus Expense)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Credit (Bank/Payable)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledgerData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.paymentDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-teal-700">{item.month}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                    {item.transactionRef}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.bonusType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.paymentMethod === 'Bank Transfer'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}
                  >
                    {item.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                  {item.employeeCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-700">
                  {formatCurrency(item.bonusAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                  {/* Show credit only if payment is made */}
                  {item.status === 'Paid' ? formatCurrency(item.bonusAmount) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-teal-50">
            <tr className="font-bold">
              <td colSpan="5" className="px-6 py-4 text-right text-sm text-gray-700">
                Total ({ledgerData.length} Months):
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                {totalEmployees}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700">
                {formatCurrency(totalDebit)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                {formatCurrency(totalCredit)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default BonusTable
