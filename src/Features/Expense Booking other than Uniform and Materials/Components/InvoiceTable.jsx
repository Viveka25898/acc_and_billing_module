// File: src/features/billing/components/InvoiceTable.jsx
import React from 'react'

export default function InvoiceTable({ invoices, onView, onReject, onApprove }) {
  // Helper function to format TDS display
  const formatTdsDisplay = (invoice) => {
    if (!invoice.tdsSection) {
      return <span className="text-gray-400">No TDS</span>
    }

    const rate = invoice.tdsRate || 'N/A'
    const amount = invoice.tdsAmount ? `₹${invoice.tdsAmount.toFixed(2)}` : ''

    return (
      <div className="text-xs">
        <div className="font-medium">{invoice.tdsSection}</div>
        <div className="text-gray-600">{rate}</div>
        {amount && <div className="text-green-600">{amount}</div>}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Invoice No</th>
            <th className="border p-2">Vendor Name</th>
            <th className="border p-2">PO No</th>
            <th className="border p-2">GSTIN</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">TDS</th> {/* NEW COLUMN */}
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
            <th className="border p-2">Financial Head Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="text-center hover:bg-gray-50">
              <td className="border p-2">{inv.invoiceNo}</td>
              <td className="border p-2">{inv.vendorName}</td>
              <td className="border p-2">{inv.poNo}</td>
              <td className="border p-2 font-mono text-xs">{inv.gstin}</td>
              <td className="border p-2 font-medium">₹{inv.amount?.toFixed(2) || '0.00'}</td>

              {/* TDS Column */}
              <td className="border p-2">{formatTdsDisplay(inv)}</td>

              <td
                className={`border p-2 capitalize ${
                  inv.status === 'accepted'
                    ? 'text-green-600 font-medium'
                    : inv.status === 'rejected'
                      ? 'text-red-600 font-medium'
                      : 'text-yellow-600 font-medium'
                }`}
              >
                {inv.status}
              </td>

              <td className="border p-2 space-x-1">
                <button
                  onClick={() => onView(inv)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                >
                  View
                </button>

                {inv.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onApprove(inv.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onReject(inv)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
              <td
                className={`border p-2 capitalize ${
                  inv.financialHeadStatus === 'approved'
                    ? 'text-green-600'
                    : inv.financialHeadStatus === 'rejected'
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
              >
                {inv.financialHeadStatus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
