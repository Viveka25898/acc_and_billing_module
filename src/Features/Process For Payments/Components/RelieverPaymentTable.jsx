/* eslint-disable no-unused-vars */
// Components/RelieverPaymentTable.jsx
import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

const RelieverPaymentTable = ({ relieverData, onRelieverApprove }) => {
  const [selectedRelievers, setSelectedRelievers] = useState({})
  const [paymentAmounts, setPaymentAmounts] = useState({})

  const handleRelieverCheckbox = (relieverId) => {
    setSelectedRelievers((prev) => ({
      ...prev,
      [relieverId]: !prev[relieverId],
    }))
  }

  const handleAmountChange = (relieverId, amount) => {
    setPaymentAmounts((prev) => ({
      ...prev,
      [relieverId]: {
        amount: Number(amount),
        paymentType: 'full',
      },
    }))
  }

  const handleApproveSelected = () => {
    onRelieverApprove(selectedRelievers, paymentAmounts)

    // Reset selections
    setSelectedRelievers({})
    setPaymentAmounts({})
  }

  const selectAllRelievers = (e) => {
    if (e.target.checked) {
      const allSelected = {}
      relieverData.forEach((reliever) => {
        allSelected[reliever.id] = true
      })
      setSelectedRelievers(allSelected)
    } else {
      setSelectedRelievers({})
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto min-w-[800px] text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border w-10">
              <input
                type="checkbox"
                className="w-4 h-4 cursor-pointer"
                onChange={selectAllRelievers}
                checked={
                  Object.keys(selectedRelievers).length === relieverData.length &&
                  relieverData.length > 0
                }
              />
            </th>
            <th className="p-2 border">Reliever Name</th>
            <th className="p-2 border">Employee ID</th>
            <th className="p-2 border">Site</th>
            <th className="p-2 border">Days</th>
            <th className="p-2 border">Amount (₹)</th>
            <th className="p-2 border">Account No</th>
            <th className="p-2 border">IFSC Code</th>
            <th className="p-2 border">Approved Date</th>
          </tr>
        </thead>
        <tbody>
          {relieverData.map((reliever, index) => (
            <tr key={reliever.id} className="hover:bg-gray-50 border">
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={selectedRelievers[reliever.id] || false}
                  onChange={() => handleRelieverCheckbox(reliever.id)}
                />
              </td>
              <td className="p-2 border font-medium">{reliever.relieverName}</td>
              <td className="p-2 border">{reliever.employeeId}</td>
              <td className="p-2 border">{reliever.site}</td>
              <td className="p-2 border text-center">{reliever.days}</td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={paymentAmounts[reliever.id]?.amount || reliever.amount}
                  onChange={(e) => handleAmountChange(reliever.id, e.target.value)}
                  className="w-24 px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                  min="0"
                  max={reliever.amount}
                  step="0.01"
                />
              </td>
              <td className="p-2 border font-mono text-sm">{reliever.accountNo}</td>
              <td className="p-2 border font-mono text-sm">{reliever.ifscCode}</td>
              <td className="p-2 border text-sm">
                {reliever.approvedDate
                  ? new Date(reliever.approvedDate).toLocaleDateString()
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {relieverData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No approved reliever requests found. Approve reliever requests first.
        </div>
      )}

      {Object.keys(selectedRelievers).length > 0 && (
        <div className="mt-4 text-right">
          <button
            onClick={handleApproveSelected}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
          >
            <FaCheck />
            Approve Selected for Payment ({Object.keys(selectedRelievers).length})
          </button>
        </div>
      )}
    </div>
  )
}

export default RelieverPaymentTable
