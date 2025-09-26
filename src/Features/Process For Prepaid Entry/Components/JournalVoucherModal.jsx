import React from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function JournalVoucherModal({ onClose, invoice }) {
  if (!invoice) return null;

  // CORRECTED GST Calculation
  const gstPercentage = invoice.gstRate || 18;
  const baseAmount = Math.round(invoice.totalAmount / (1 + gstPercentage/100));
  
  // Use actual prepaid period from invoice
  const prepaidPeriod = invoice.prepaidPeriod || 12;
  const monthlyExpense = invoice.monthlyAmortization || Math.round(baseAmount / prepaidPeriod);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            Monthly Amortization Journal Voucher
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p><strong>Voucher No:</strong> JV-2025-{invoice.id.toString().padStart(3, '0')}</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
          <p><strong>Period:</strong> {prepaidPeriod} months starting {invoice.prepaidStartMonth}</p>
          <p><strong>Narration:</strong> Monthly amortization for Prepaid Expense Invoice {invoice.invoiceNumber}</p>
        </div>

        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border">Particulars</th>
                <th className="p-2 text-right border">Amount (₹)</th>
                <th className="p-2 text-left border">GL Code</th>
                <th className="p-2 text-left border">Cost Center</th>
                <th className="p-2 text-left border">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Monthly Expense - {invoice.vendorName} Services</td>
                <td className="p-2 text-right border">{monthlyExpense.toLocaleString()}</td>
                <td className="p-2 border">E-4050</td>
                <td className="p-2 border">CC-400</td>
                <td className="p-2 border">Debit</td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="p-2 border">By Prepaid Assets Amortization</td>
                <td className="p-2 text-right border">{monthlyExpense.toLocaleString()}</td>
                <td className="p-2 border">A-1205</td>
                <td className="p-2 border">CC-400</td>
                <td className="p-2 border">Credit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm">
            Monthly amortization of <strong>₹{monthlyExpense.toLocaleString()}</strong> has been posted. 
            This will continue for <strong>{prepaidPeriod} months</strong> until the prepaid asset is fully amortized.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Remaining periods: {prepaidPeriod - 1} months | 
            Total prepaid amount: ₹{baseAmount.toLocaleString()}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}