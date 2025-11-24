import React from 'react'

export default function PurchaseVoucherModal({ onClose, invoice }) {
  if (!invoice) return null

  // Get transaction data from accounting result or calculate from invoice
  const accountingResult = invoice.accountingResult
  const breakdown = accountingResult?.breakdown
  const purchaseVoucherNo =
    invoice.purchaseVoucherNo ||
    accountingResult?.purchaseVoucherNo ||
    `PV-2025-${invoice.id?.toString().padStart(3, '0')}`

  // Use actual transaction data if available, otherwise calculate
  const taxableAmount =
    breakdown?.taxable || Math.round(invoice.totalAmount / (1 + (invoice.gstRate || 18) / 100))
  const cgstAmount = breakdown?.cgst || Math.round((invoice.totalAmount - taxableAmount) / 2)
  const sgstAmount = breakdown?.sgst || invoice.totalAmount - taxableAmount - cgstAmount
  const totalAmount = invoice.totalAmount

  // Get transaction entries if available
  const getTransactionEntries = () => {
    if (accountingResult && invoice.purchaseTransactionId) {
      try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
        const transaction = transactions.find((t) => t.id === invoice.purchaseTransactionId)
        if (transaction && transaction.entries) {
          return transaction.entries
        }
      } catch (error) {
        console.error('Error loading transaction entries:', error)
      }
    }

    // Return default entries based on GL codes
    return [
      {
        lineNo: 1,
        glCode: invoice.uniformPrepaidGLCode || 'A3005001',
        glName: invoice.accountingResult?.uniformPrepaidGLName || 'UNIFORM EXPENSE',
        debit: taxableAmount,
        credit: 0,
        narration: `Prepaid Uniform purchase - ${invoice.vendorName}`,
      },
      {
        lineNo: 2,
        glCode: 'A3007001001',
        glName: 'CGST Input',
        debit: cgstAmount,
        credit: 0,
        narration: `CGST on Prepaid Uniform`,
      },
      {
        lineNo: 3,
        glCode: 'A3007001002',
        glName: 'SGST Input',
        debit: sgstAmount,
        credit: 0,
        narration: `SGST on Prepaid Uniform`,
      },
      {
        lineNo: 4,
        glCode: invoice.vendorGLCode || 'L2005004',
        glName: `UNIFORM VENDOR - ${invoice.vendorName}`,
        debit: 0,
        credit: totalAmount,
        narration: `Invoice ${invoice.invoiceNumber} - Prepaid Uniform`,
      },
    ]
  }

  const entries = getTransactionEntries()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-xl relative">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Purchase Voucher Posted Successfully
        </h2>

        <div className="mb-4">
          <p>
            <strong>Voucher No:</strong> {purchaseVoucherNo}
          </p>
          <p>
            <strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}
          </p>
          <p>
            <strong>Vendor:</strong> {invoice.vendorName}
          </p>
          <p>
            <strong>Invoice Ref:</strong> {invoice.invoiceNumber}
          </p>
          {invoice.vendorGLCode && (
            <p>
              <strong>Vendor GL Code:</strong> {invoice.vendorGLCode}
            </p>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border">Particulars</th>
                <th className="p-2 text-right border">Debit (₹)</th>
                <th className="p-2 text-right border">Credit (₹)</th>
                <th className="p-2 text-left border">GL Code</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} className={entry.credit > 0 ? 'bg-gray-50 font-medium' : ''}>
                  <td className="p-2 border">{entry.glName}</td>
                  <td className="p-2 text-right border">
                    {entry.debit > 0
                      ? entry.debit.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '-'}
                  </td>
                  <td className="p-2 text-right border">
                    {entry.credit > 0
                      ? entry.credit.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '-'}
                  </td>
                  <td className="p-2 border">{entry.glCode}</td>
                </tr>
              ))}
              <tr className="bg-green-50 font-bold border-t-2">
                <td className="p-2 border">Total</td>
                <td className="p-2 text-right border">
                  {totalAmount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="p-2 text-right border">
                  {totalAmount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="p-2 border"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm">
            The invoice has been booked as a Prepaid Asset. Base amount of{' '}
            <strong>₹{taxableAmount.toLocaleString()}</strong> will be amortized over{' '}
            <strong>{invoice.prepaidPeriod || 12} months</strong> starting from{' '}
            <strong>{invoice.prepaidStartMonth || 'current month'}</strong>.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Monthly amortization: ₹
            {(
              invoice.monthlyAmortization || taxableAmount / (invoice.prepaidPeriod || 12)
            ).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
