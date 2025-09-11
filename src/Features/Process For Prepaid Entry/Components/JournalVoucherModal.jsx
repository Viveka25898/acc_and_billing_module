// File: src/features/billingManager/components/JournalVoucherModal.jsx
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function JournalVoucherModal({ onClose, invoice }) {
  if (!invoice) return null;

  // Calculate base amount (assuming 18% GST for this example)
  const gstPercentage = invoice.gstRate || 18;
  const gstAmount = Math.round(invoice.totalAmount * gstPercentage / (100 + gstPercentage));
  const baseAmount = invoice.totalAmount - (gstAmount * 2);
  
  // Calculate monthly expense (assuming 12-month period)
  const monthlyExpense = Math.round(baseAmount / 12);
  const prepaidAmount = baseAmount - monthlyExpense;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            Journal Voucher Posted Successfully
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p><strong>Voucher No:</strong> JV-2025-{invoice.id.toString().padStart(3, '0')}</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
          <p><strong>Narration:</strong> Monthly amortization for Uniform Invoice {invoice.invoiceNumber}</p>
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
                <td className="p-2 border">Prepaid Expense for Uniforms ({invoice.billingPeriod})</td> {/* Particulars */}
                <td className="p-2 text-right border">{prepaidAmount.toLocaleString()}</td>
                <td className="p-2 border">A-1205</td> {/* GL Code */}
                <td className="p-2 border">CC-400</td> {/* Cost Center */}
                <td className="p-2 border">Debit</td>
              </tr>
              <tr>
                <td className="p-2 border">Monthly Amortization - Uniform Expense</td> {/* Particulars */}
                <td className="p-2 text-right border">{monthlyExpense.toLocaleString()}</td>
                <td className="p-2 border">E-4050</td> {/* GL Code */}
                <td className="p-2 border">CC-400</td> {/* Cost Center */}
                <td className="p-2 border">Debit</td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="p-2 border">By Uniforms (Asset Account) Clearance</td> {/* Particulars */}
                <td className="p-2 text-right border">{baseAmount.toLocaleString()}</td>
                <td className="p-2 border">A-1200</td> {/* GL Code */}
                <td className="p-2 border">CC-400</td> {/* Cost Center */}
                <td className="p-2 border">Credit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm">
            The prepaid expense has been set up. <strong>₹{monthlyExpense.toLocaleString()}</strong> has been expensed for this month. 
            The remaining <strong>₹{prepaidAmount.toLocaleString()}</strong> will be amortized over the next 11 months.
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