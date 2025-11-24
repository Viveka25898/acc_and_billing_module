// components/AERelieverBankSelectionModal.jsx
import React, { useState, useEffect } from 'react'
import { FaTimes, FaCheckCircle } from 'react-icons/fa'

const AERelieverBankSelectionModal = ({ isOpen, onClose, onBankSelect, approvedRequests }) => {
  const [banks, setBanks] = useState([])
  const [selectedBankCode, setSelectedBankCode] = useState('')
  const [selectedBank, setSelectedBank] = useState(null)

  useEffect(() => {
    if (isOpen) {
      // Load banks from chartOfAccounts
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || []

      // Filter banks: parentCode = "A3004003" and type = "ACCOUNT"
      const bankAccounts = chartOfAccounts.filter(
        (acc) => acc.parentCode === 'A3004001' && acc.type === 'ACCOUNT'
      )

      setBanks(bankAccounts)

      // Reset selection when modal opens
      setSelectedBankCode('')
      setSelectedBank(null)
    }
  }, [isOpen])

  const handleBankSelect = (e) => {
    const bankCode = e.target.value
    setSelectedBankCode(bankCode)

    // Find selected bank details
    const bank = banks.find((b) => b.code === bankCode)
    setSelectedBank(bank)
  }

  const handleConfirm = () => {
    if (!selectedBank) {
      alert('Please select a bank')
      return
    }

    // Pass selected bank and approved requests to parent
    onBankSelect({
      bankCode: selectedBank.code,
      bankName: selectedBank.name,
      bankId: selectedBank.id,
      approvedRequests: approvedRequests,
    })
  }

  if (!isOpen) return null

  // Calculate totals
  const totalAmount = approvedRequests.reduce((sum, req) => sum + parseFloat(req.amount || 0), 0)
  const requestCount = approvedRequests.length
  const uniqueRelievers = [...new Set(approvedRequests.map((req) => req.name))]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">Select Bank for Reliever Payments</h2>
              <p className="text-pink-100 text-xs mt-1">
                {requestCount > 1
                  ? `${requestCount} reliever payments`
                  : 'Processing reliever payment'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-pink-800 p-1 rounded-lg transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Payment Summary */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
            <h3 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
              <FaCheckCircle className="text-pink-600 text-sm" />
              Payment Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-xs text-gray-600">Payments:</span>
                <p className="font-semibold">{requestCount}</p>
              </div>
              <div>
                <span className="text-xs text-gray-600">Total Amount:</span>
                <p className="font-semibold text-green-600">₹ {totalAmount.toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-gray-600">Relievers:</span>
                <p className="font-medium text-xs truncate">{uniqueRelievers.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Bank Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Bank Account <span className="text-red-500">*</span>
            </label>

            {banks.length === 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                <p className="font-medium">⚠️ No bank accounts found!</p>
                <p className="text-xs mt-1">Add bank accounts in Chart of Accounts first.</p>
              </div>
            ) : (
              <select
                value={selectedBankCode}
                onChange={handleBankSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              >
                <option value="">-- Select Bank --</option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name} ({bank.code})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Bank Details */}
          {selectedBank && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                <FaCheckCircle className="text-green-600 text-sm" />
                Selected Bank
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank:</span>
                  <span className="font-medium">{selectedBank.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GL Code:</span>
                  <span className="font-medium font-mono text-blue-600">{selectedBank.code}</span>
                </div>
              </div>
            </div>
          )}

          {/* Warning Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
            <p className="text-yellow-800">
              <strong>Note:</strong> Selected bank will be debited for reliever payments. Ensure
              sufficient balance.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 rounded-b-xl flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedBank || banks.length === 0}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
              selectedBank && banks.length > 0
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Proceed to Payment Entry
          </button>
        </div>
      </div>
    </div>
  )
}

export default AERelieverBankSelectionModal
