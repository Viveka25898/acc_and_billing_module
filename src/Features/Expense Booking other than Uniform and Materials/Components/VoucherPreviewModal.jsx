
import React from "react";

export default function VoucherPreviewModal({ invoice, onClose }) {
  const tdsRate = 10; // You can change this later or make dynamic
  const tdsAmount = (invoice.amount * tdsRate) / 100;
  const payableAmount = invoice.amount - tdsAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg space-y-4">
        <h2 className="text-lg font-bold text-center">Voucher Preview</h2>

        <div className="text-sm space-y-1">
          <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
          <p><strong>Vendor Name:</strong> {invoice.vendorName}</p>
          <p><strong>PO Number:</strong> {invoice.poNo}</p>
          <p><strong>Total Invoice Amount:</strong> ₹{invoice.amount}</p>
          <p><strong>TDS Rate:</strong> {tdsRate}%</p>
          <p><strong>TDS Amount:</strong> ₹{tdsAmount}</p>
          <p><strong>Payable Amount:</strong> ₹{payableAmount}</p>
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
                <td className="border px-2 py-1">Expense Account</td>
                <td className="border px-2 py-1">{invoice.amount}</td>
                <td className="border px-2 py-1">-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">TDS Payable</td>
                <td className="border px-2 py-1">-</td>
                <td className="border px-2 py-1">{tdsAmount}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Vendor - {invoice.vendorName}</td>
                <td className="border px-2 py-1">-</td>
                <td className="border px-2 py-1">{payableAmount}</td>
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
