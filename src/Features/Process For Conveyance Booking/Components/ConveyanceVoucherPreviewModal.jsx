import React from "react";

export default function ConveyanceVoucherPreviewModal({ voucher, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-center">Conveyance Voucher</h2>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Voucher No:</p>
              <p>{voucher.voucherNo}</p>
            </div>
            <div>
              <p className="font-semibold">Date:</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold">Employee:</p>
              <p>{voucher.employee}</p>
            </div>
            <div>
              <p className="font-semibold">Amount:</p>
              <p>₹{voucher.amount}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold">Purpose:</p>
            <p>{voucher.purpose}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Journal Entry</h3>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Account</th>
                  <th className="p-2 border">Debit (₹)</th>
                  <th className="p-2 border">Credit (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">Travel Expenses</td>
                  <td className="p-2 border">{voucher.amount}</td>
                  <td className="p-2 border">-</td>
                </tr>
                <tr>
                  <td className="p-2 border">Employee Payable</td>
                  <td className="p-2 border">-</td>
                  <td className="p-2 border">{voucher.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <p className="font-semibold">Approved By:</p>
            <p>{voucher.approvedBy}</p>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
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