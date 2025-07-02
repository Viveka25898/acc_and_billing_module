// File: src/features/billingManager/components/PurchaseVoucherModal.jsx
import React from "react";

export default function PurchaseVoucherModal({ onClose, invoice }) {
  if ( !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">
        <h2 className="text-lg font-semibold text-green-700 mb-4">Purchase Voucher Passed</h2>

        <div className="space-y-2 text-sm">
          <p><strong>Voucher No:</strong> PV-2025-{invoice.id.toString().padStart(3, '0')}</p>
          <p><strong>Date:</strong> 30 June 2025</p>
          <p><strong>Ledger:</strong> Uniform Expense</p>
          <p><strong>Amount:</strong> ₹{invoice.totalAmount.toLocaleString()}</p>
          <p><strong>Narration:</strong> Booking of Uniform Expense</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
} 
