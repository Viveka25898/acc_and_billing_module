import React, { useState, useEffect } from 'react'
import { FaTimes, FaCheckCircle, FaInfoCircle } from 'react-icons/fa'

const PaymentBankSelectionModal = ({
  isOpen,
  onClose,
  onBankSelect,
  paymentData,
  requestData,
  paymentType = 'vendor', // 'vendor', 'reliever', 'conveyance'
  apiBankAccounts = [],
}) => {
  // Support both prop names for compatibility
  const data = paymentData || requestData
  const [banks, setBanks] = useState([])
  const [selectedBankCode, setSelectedBankCode] = useState('')
  const [selectedBank, setSelectedBank] = useState(null)

  // Configuration based on payment type
  const config = {
    vendor: {
      color: 'green',
      title: 'Select Payment Bank Account',
      fields: {
        name: 'Vendor Name',
        invoices: 'Invoice Numbers',
        amount: 'Payment Done',
        fallbackAmount: 'Total Amount',
      },
      infoText: {
        credit: 'Selected bank will be credited (money out)',
        debit: 'Vendor accounts will be debited (liability reduction)',
      },
    },
    reliever: {
      color: 'blue',
      title: 'Select Payment Bank Account',
      fields: {
        name: 'Employee Name',
        invoices: 'Request Numbers',
        amount: 'Payment Amount',
        fallbackAmount: 'Total Amount',
      },
      infoText: {
        credit: 'Selected bank will be credited (money out)',
        debit: 'Reliever expense accounts will be debited',
      },
    },
    conveyance: {
      color: 'purple',
      title: 'Select Payment Bank Account',
      fields: {
        name: 'Employee Name',
        invoices: 'Claim Numbers',
        amount: 'Approved Amount',
        fallbackAmount: 'Total Amount',
      },
      infoText: {
        credit: 'Selected bank will be credited (money out)',
        debit: 'Conveyance expense accounts will be debited',
      },
    },
  }

  const currentConfig = config[paymentType] || config.vendor

  useEffect(() => {
    if (isOpen) {
      // 1. If API returned bank accounts dynamically, use them
      if (Array.isArray(apiBankAccounts) && apiBankAccounts.length > 0) {
        const standardized = apiBankAccounts.map((b) => ({
          id: b.bankId || b.id || b.bankCode || b.code,
          code: b.bankCode || b.code,
          name: b.bankName || b.name,
        }))
        setBanks(standardized)
      } else {
        // 2. Fallback: Load banks from chartOfAccounts in localStorage
        try {
          const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || []
          const bankAccounts = chartOfAccounts.filter(
            (acc) => acc.parentCode === 'A3004001' && acc.type === 'ACCOUNT'
          )
          setBanks(bankAccounts)
        } catch {
          setBanks([])
        }
      }

      // Reset selection when modal opens
      setSelectedBankCode('')
      setSelectedBank(null)
    }
  }, [isOpen, apiBankAccounts])

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

    // Pass selected bank to parent
    onBankSelect({
      bankCode: selectedBank.code,
      bankName: selectedBank.name,
      bankId: selectedBank.id,
    })
  }

  if (!isOpen) return null

  // Extract amount supporting both camelCase and Title Case key formats
  const getRowAmount = (row) => {
    if (!row) return 0
    const val =
      row.paymentDone ??
      row['Payment Done'] ??
      row.totalAmount ??
      row['Total Amount'] ??
      row.amount ??
      row.Amount ??
      row.paidAmount ??
      row['Paid Amount'] ??
      row.approvedAmount ??
      row['Approved Amount'] ??
      row.paymentAmount ??
      row['Payment Amount'] ??
      0
    const num = parseFloat(val)
    return isNaN(num) ? 0 : num
  }

  const calculateTotalAmount = () => {
    if (!data) return 0
    const rows = Array.isArray(data) ? data : [data]
    return rows.reduce((sum, row) => sum + getRowAmount(row), 0)
  }

  const totalAmount = calculateTotalAmount()

  // Count total items (invoices/requests/claims) supporting camelCase and Title Case key formats
  const calculateTotalItems = () => {
    if (!data) return 0
    const rows = Array.isArray(data) ? data : [data]
    return rows.reduce((sum, row) => {
      const itemField =
        row.invoiceNumbers ||
        row['Invoice Numbers'] ||
        row.invoices ||
        row['Invoices'] ||
        row.requestNumbers ||
        row['Request Numbers'] ||
        row.claimNumbers ||
        row['Claim Numbers'] ||
        ''
      if (Array.isArray(itemField)) return sum + itemField.length
      const items = String(itemField).split(',').filter(Boolean)
      return sum + (items.length || 1)
    }, 0)
  }

  const totalItems = calculateTotalItems()

  // Dynamic color classes
  const colorClasses = {
    green: {
      gradient: 'from-green-600 to-green-700',
      text: 'text-green-600',
      subtitleText: 'text-green-100',
      bg: 'bg-green-50',
      border: 'border-green-200',
      hover: 'hover:bg-green-800',
      button: 'bg-green-600 hover:bg-green-700',
      ring: 'focus:ring-green-500',
    },
    blue: {
      gradient: 'from-blue-600 to-blue-700',
      text: 'text-blue-600',
      subtitleText: 'text-blue-100',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700',
      ring: 'focus:ring-blue-500',
    },
    purple: {
      gradient: 'from-purple-600 to-purple-700',
      text: 'text-purple-600',
      subtitleText: 'text-purple-100',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-800',
      button: 'bg-purple-600 hover:bg-purple-700',
      ring: 'focus:ring-purple-500',
    },
  }

  const colors = colorClasses[currentConfig.color]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${colors.gradient} text-white p-4 rounded-t-xl`}>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">{currentConfig.title}</h2>
            <button
              onClick={onClose}
              className={`text-white ${colors.hover} p-1 rounded-lg transition-colors`}
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Payment Summary */}
          <div className={`${colors.bg} ${colors.border} border rounded-lg p-3`}>
            <h3 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
              <FaCheckCircle className={`${colors.text} text-sm`} />
              Payment Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm items-center">
              <div>
                <span className="text-xs text-gray-600">
                  {paymentType === 'vendor'
                    ? 'Invoices'
                    : paymentType === 'reliever'
                      ? 'Requests'
                      : 'Claims'}
                  :
                </span>
                <p className="font-semibold text-base">{totalItems}</p>
              </div>
              <div>
                <span className="text-xs text-gray-600 block">Total Payment Amount:</span>
                <p className={`font-semibold ${colors.text} text-lg`}>
                  ₹{' '}
                  {totalAmount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
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
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent text-sm`}
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
            <div className={`${colors.bg} ${colors.border} border rounded-lg p-3`}>
              <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                <FaCheckCircle className={`${colors.text} text-sm`} />
                Selected Bank Account
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Name:</span>
                  <span className="font-medium">{selectedBank.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GL Code:</span>
                  <span className={`font-medium font-mono ${colors.text}`}>
                    {selectedBank.code}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
            <div className="flex gap-2">
              <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-blue-800">
                <p className="font-medium mb-1">Payment Processing:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>{currentConfig.infoText.credit}</li>
                  <li>{currentConfig.infoText.debit}</li>
                  <li>Ensure sufficient balance in selected bank</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 rounded-b-xl flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedBank || banks.length === 0}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedBank && banks.length > 0
                ? `${colors.button} text-white`
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentBankSelectionModal
