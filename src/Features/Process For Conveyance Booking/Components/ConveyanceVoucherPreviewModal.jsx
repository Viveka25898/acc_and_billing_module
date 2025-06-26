import React from "react";

export default function ConveyanceVoucherPreviewModal({ voucher, onClose }) {
  const voucherNo = voucher.voucherNo || "EV-2025-0001"; // fallback
  const { employee, purpose, amount, approvedBy } = voucher;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg space-y-4">
        <h2 className="text-lg font-bold text-center">Conveyance Voucher Preview</h2>

        <div className="text-sm space-y-1">
          <p><strong>Voucher No:</strong> {voucherNo}</p>
          <p><strong>Employee:</strong> {employee}</p>
          <p><strong>Purpose:</strong> {purpose}</p>
          <p><strong>Approved By:</strong> {approvedBy || "Billing Team"}</p>
          <p><strong>Total Amount:</strong> ₹{amount}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Auto JV Entry</h3>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Account</th>
                <th className="border px-2 py-1">Debit (₹)</th>
                <th className="border px-2 py-1">Credit (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">Travel Expense</td>
                <td className="border px-2 py-1">{amount}</td>
                <td className="border px-2 py-1">-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Employee - {employee}</td>
                <td className="border px-2 py-1">-</td>
                <td className="border px-2 py-1">{amount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
