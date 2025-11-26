/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

const ConveyancePaymentTable = ({ conveyanceData, onConveyanceApprove }) => {
  const [selectedConveyances, setSelectedConveyances] = useState({})
  const [paymentAmounts, setPaymentAmounts] = useState({})

  const handleConveyanceCheckbox = (conveyanceId) => {
    setSelectedConveyances((prev) => ({
      ...prev,
      [conveyanceId]: !prev[conveyanceId],
    }))
  }

  const handleAmountChange = (conveyanceId, amount) => {
    setPaymentAmounts((prev) => ({
      ...prev,
      [conveyanceId]: {
        amount: Number(amount),
        paymentType: 'full',
      },
    }))
  }

  const handleApproveSelected = () => {
    onConveyanceApprove(selectedConveyances, paymentAmounts)

    // Reset selections
    setSelectedConveyances({})
    setPaymentAmounts({})
  }

  const selectAllConveyances = (e) => {
    if (e.target.checked) {
      const allSelected = {}
      conveyanceData.forEach((conveyance) => {
        allSelected[conveyance.id] = true
      })
      setSelectedConveyances(allSelected)
    } else {
      setSelectedConveyances({})
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto min-w-[1000px] text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border w-10">
              <input
                type="checkbox"
                className="w-4 h-4 cursor-pointer"
                onChange={selectAllConveyances}
                checked={
                  Object.keys(selectedConveyances).length === conveyanceData.length &&
                  conveyanceData.length > 0
                }
              />
            </th>
            <th className="p-2 border">Employee Name</th>
            <th className="p-2 border">Employee ID</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Purpose</th>
            <th className="p-2 border">Distance</th>
            <th className="p-2 border">Amount (₹)</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Voucher No</th>
            <th className="p-2 border">Approved Date</th>
          </tr>
        </thead>
        <tbody>
          {conveyanceData.map((conveyance, index) => (
            <tr key={conveyance.id} className="hover:bg-gray-50 border">
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={selectedConveyances[conveyance.id] || false}
                  onChange={() => handleConveyanceCheckbox(conveyance.id)}
                />
              </td>
              <td className="p-2 border font-medium">{conveyance.employeeName}</td>
              <td className="p-2 border">{conveyance.employeeId}</td>
              <td className="p-2 border">
                {conveyance.date ? new Date(conveyance.date).toLocaleDateString() : 'N/A'}
              </td>
              <td className="p-2 border">{conveyance.client}</td>
              <td className="p-2 border">{conveyance.purpose}</td>
              <td className="p-2 border text-center">{conveyance.distance || 'N/A'}</td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={paymentAmounts[conveyance.id]?.amount || conveyance.amount}
                  onChange={(e) => handleAmountChange(conveyance.id, e.target.value)}
                  className="w-24 px-2 py-1 border rounded focus:outline-none focus:border-purple-300"
                  min="0"
                  max={conveyance.amount}
                  step="0.01"
                />
              </td>
              <td className="p-2 border">{conveyance.department || 'N/A'}</td>
              <td className="p-2 border font-mono text-sm">{conveyance.voucherNo || 'N/A'}</td>
              <td className="p-2 border text-sm">
                {conveyance.approvedDate
                  ? new Date(conveyance.approvedDate).toLocaleDateString()
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {conveyanceData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No conveyance requests pending payment. Approve conveyance requests in AE approval page
          first.
        </div>
      )}

      {Object.keys(selectedConveyances).length > 0 && (
        <div className="mt-4 text-right">
          <button
            onClick={handleApproveSelected}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
          >
            <FaCheck />
            Approve Selected for Payment ({Object.keys(selectedConveyances).length})
          </button>
        </div>
      )}
    </div>
  )
}

export default ConveyancePaymentTable
