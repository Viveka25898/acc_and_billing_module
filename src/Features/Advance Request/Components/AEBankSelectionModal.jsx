/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { FaTimes, FaCheckCircle } from 'react-icons/fa'
import { fetchBanks } from '../services/advanceRequestService'
import { toast } from 'react-toastify'

const AEBankSelectionModal = ({ isOpen, onClose, onBankSelect, requestData }) => {
  const [banks, setBanks] = useState([])
  const [selectedBankCode, setSelectedBankCode] = useState('')
  const [selectedBank, setSelectedBank] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const loadBanks = async () => {
        setLoading(true)
        try {
          const res = await fetchBanks()
          if (res && res.success && Array.isArray(res.data)) {
            setBanks(res.data)
            console.log("Banks fetched from backend:", res.data)
          } else {
            setBanks([])
            toast.error(res?.message || 'Failed to fetch banks.')
          }
        } catch (error) {
          setBanks([])
          toast.error(error.message || 'Failed to load bank accounts.')
        } finally {
          setLoading(false)
        }
      }

      loadBanks()

      // Reset selection when modal opens
      setSelectedBankCode('')
      setSelectedBank(null)
    }
  }, [isOpen])

  const handleBankSelect = (e) => {
    const bankCode = e.target.value
    setSelectedBankCode(bankCode)

    // Find selected bank details
    const bank = banks.find((b) => b.bank_code === bankCode)
    setSelectedBank(bank)
  }

  const handleConfirm = () => {
    if (!selectedBank) {
      alert('Please select a bank')
      return
    }

    const BANK_CODE_MAP = {
      'HDFC': 'BNK0001',
      'ICICI': 'BNK0002',
      'SBI': 'BNK0003'
    }

    const bankCodeVal = BANK_CODE_MAP[selectedBank.bank_code] || selectedBank.bank_code

    // Pass selected bank to parent
    onBankSelect({
      bankCode: bankCodeVal,
      bankName: selectedBank.bank_name,
      bankId: selectedBank.bank_id,
    })
  }

  if (!isOpen) return null


  // Determine if single or multiple requests
  const isMultiple = Array.isArray(requestData)
  const totalAmount = isMultiple
    ? requestData.reduce((sum, req) => sum + parseFloat(req.amount), 0)
    : parseFloat(requestData?.amount || 0)
  const requestCount = isMultiple ? requestData.length : 1

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {' '}
        {/* Changed max-w-1xl to max-w-md */}
        {/* Header - Made smaller */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
          {' '}
          {/* Reduced padding */}
          <div className="flex justify-between items-center">
            {' '}
            {/* Changed to items-center */}
            <div>
              <h2 className="text-lg font-bold">
                {' '}
                {/* Reduced text size */}
                Select Bank Account
              </h2>
              <p className="text-blue-100 text-xs mt-1">
                {' '}
                {/* Reduced text size */}
                {isMultiple ? `${requestCount} advance requests` : 'Processing advance request'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-800 p-1 rounded-lg transition-colors" // Reduced padding
            >
              <FaTimes size={16} /> {/* Reduced icon size */}
            </button>
          </div>
        </div>
        {/* Body - Made more compact */}
        <div className="p-4 space-y-4">
          {' '}
          {/* Reduced padding and spacing */}
          {/* Payment Summary - Made more compact */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            {' '}
            {/* Reduced padding */}
            <h3 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
              {' '}
              {/* Reduced text size */}
              <FaCheckCircle className="text-blue-600 text-sm" /> {/* Reduced icon size */}
              Payment Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {' '}
              {/* Reduced gap and text size */}
              <div>
                <span className="text-xs text-gray-600">Requests:</span>
                <p className="font-semibold">{requestCount}</p> {/* Reduced font weight */}
              </div>
              <div>
                <span className="text-xs text-gray-600">Total Amount:</span>
                <p className="font-semibold text-green-600">₹ {totalAmount.toLocaleString()}</p>
              </div>
              {isMultiple && (
                <>
                  <div className="col-span-2">
                    <span className="text-xs text-gray-600">Employees:</span>
                    <p className="font-medium text-xs truncate">
                      {' '}
                      {/* Added truncate */}
                      {requestData.map((r) => r.employeeName).join(', ')}
                    </p>
                  </div>
                </>
              )}
              {!isMultiple && requestData && (
                <>
                  <div className="col-span-2">
                    <span className="text-xs text-gray-600">Employee:</span>
                    <p className="font-medium text-sm">{requestData.employeeName}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Bank Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Bank Account <span className="text-red-500">*</span>
            </label>

            {banks.length === 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {' '}
                {/* Reduced padding and text */}
                <p className="font-medium">⚠️ No bank accounts found!</p>
                <p className="text-xs mt-1">Add bank accounts in Chart of Accounts first.</p>
              </div>
            ) : (
              <select
                value={selectedBankCode}
                onChange={handleBankSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm" // Reduced padding and text
              >
                <option value="">-- Select Bank --</option>
                {banks.map((bank) => (
                  <option key={bank.bank_code} value={bank.bank_code}>
                    {bank.bank_name} ({bank.bank_code})
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* Selected Bank Details - Made more compact */}
          {selectedBank && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              {' '}
              {/* Reduced padding */}
              <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                <FaCheckCircle className="text-green-600 text-sm" /> {/* Reduced icon size */}
                Selected Bank
              </h4>
              <div className="space-y-1 text-xs">
                {' '}
                {/* Reduced spacing and text */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank:</span>
                  <span className="font-medium">{selectedBank.bank_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GL Code:</span>
                  <span className="font-medium font-mono text-blue-600">{selectedBank.gl_code || selectedBank.bank_code}</span>
                </div>
              </div>
            </div>
          )}
          {/* Warning Note - Made more compact */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
            {' '}
            {/* Reduced padding and text */}
            <p className="text-yellow-800">
              <strong>Note:</strong> Selected bank will be credited. Ensure sufficient balance.
            </p>
          </div>
        </div>
        {/* Footer - Made more compact */}
        <div className="bg-gray-50 px-4 py-3 rounded-b-xl flex justify-end gap-2">
          {' '}
          {/* Reduced padding and gap */}
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm" // Reduced padding and text
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedBank || banks.length === 0}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
              selectedBank && banks.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default AEBankSelectionModal
