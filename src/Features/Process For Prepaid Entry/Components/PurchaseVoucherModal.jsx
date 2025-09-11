// File: src/features/billingManager/components/PurchaseVoucherModal.jsx
import React from "react";

export default function PurchaseVoucherModal({ onClose, invoice }) {
  if (!invoice) return null;

  // Calculate GST and base amount (assuming 18% GST for this example)
  const gstPercentage = invoice.gstRate || 18;
  const gstAmount = Math.round(invoice.totalAmount * gstPercentage / (100 + gstPercentage));
  const baseAmount = invoice.totalAmount - (gstAmount * 2); // Assuming CGST+SGST

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-xl relative">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Purchase Voucher Posted Successfully</h2>
        
        <div className="mb-4">
          <p><strong>Voucher No:</strong> PV-2025-{invoice.id.toString().padStart(3, '0')}</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
          <p><strong>Vendor:</strong> {invoice.vendorName}</p>
          <p><strong>Invoice Ref:</strong> {invoice.invoiceNumber}</p>
        </div>

     <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border">Particulars</th>
                <th className="p-2 text-right border">Amount (₹)</th>
                <th className="p-2 text-left border">GL Code</th>
                <th className="p-2 text-left border">Cost Center</th> {/* New Column */}
                <th className="p-2 text-left border">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Uniforms Received from {invoice.vendorName}</td> {/* Particulars */}
                <td className="p-2 text-right border">{baseAmount.toLocaleString()}</td>
                <td className="p-2 border">A-1200</td> {/* GL Code */}
                <td className="p-2 border">CC-400</td> {/* Cost Center, e.g., HR Dept */}
                <td className="p-2 border">Debit</td>
              </tr>
              <tr>
                <td className="p-2 border">Input Tax Credit (CGST)</td> {/* Particulars */}
                <td className="p-2 text-right border">{gstAmount.toLocaleString()}</td>
                <td className="p-2 border">A-1305</td> {/* GL Code */}
                <td className="p-2 border">CC-400</td> {/* Cost Center */}
                <td className="p-2 border">Debit</td>
              </tr>
              <tr>
                <td className="p-2 border">Input Tax Credit (SGST)</td> {/* Particulars */}
                <td className="p-2 text-right border">{gstAmount.toLocaleString()}</td>
                <td className="p-2 border">A-1310</td> {/* GL Code */}
                <td className="p-2 border">CC-400</td> {/* Cost Center */}
                <td className="p-2 border">Debit</td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="p-2 border">To Accounts Payable for {invoice.invoiceNumber}</td> {/* Particulars */}
                <td className="p-2 text-right border">{invoice.totalAmount.toLocaleString()}</td>
                <td className="p-2 border">L-2000</td> {/* GL Code */}
                <td className="p-2 border">CC-400</td> {/* Cost Center */}
                <td className="p-2 border">Credit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm">
            The invoice has been booked. A prepaid expense for the base cost of <strong>₹{baseAmount.toLocaleString()}</strong> has been identified.
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
  );
}