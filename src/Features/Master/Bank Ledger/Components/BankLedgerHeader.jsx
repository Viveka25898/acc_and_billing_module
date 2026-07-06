import React from 'react'

const BankLedgerHeader = ({ bankDetails }) => {
  if (!bankDetails) {
    return <div>Loading bank details...</div>
  }

  const formatAmount = (amount) => {
    if (!amount || amount === 'N/A' || amount === '-') return '0.00'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return '0.00'
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 sm:p-8">
      <div className="text-2xl sm:text-3xl font-semibold mb-6">
        BANK LEDGER - {bankDetails.bankName ? bankDetails.bankName.toUpperCase() : '-'}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">GL Account Code</div>
          <div className="text-base font-semibold">{bankDetails.glAccountCode || '-'}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Account Name</div>
          <div className="text-base font-semibold">{bankDetails.accountName || '-'}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Bank Name</div>
          <div className="text-base font-semibold">{bankDetails.bankName || '-'}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Account Number</div>
          <div className="text-base font-semibold">{bankDetails.accountNumber || '-'}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">IFSC Code</div>
          <div className="text-base font-semibold">{bankDetails.ifscCode || '-'}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Branch</div>
          <div className="text-base font-semibold">{bankDetails.branch || '-'}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Account Type</div>
          <div className="text-base font-semibold">{bankDetails.accountType || '-'}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Financial Year</div>
          <div className="text-base font-semibold">{bankDetails.financialYear || '-'}</div>
        </div>
      </div>

      <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg mt-4">
        <div className="text-xs opacity-90 mb-1">Opening Balance</div>
        <div className="text-2xl font-bold">₹{formatAmount(bankDetails.openingBalance)} DR</div>
      </div>
    </div>
  )
}

export default BankLedgerHeader
