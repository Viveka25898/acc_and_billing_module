// File: src/features/billing/components/POListTable.jsx

import React, { useState } from "react";
import { FaEye } from "react-icons/fa";

export default function POListTable({ pos }) {
  const [selectedReason, setSelectedReason] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">PO Number</th>
            <th className="p-2 border">Vendor</th>
            <th className="p-2 border">Expense Type</th>
            <th className="p-2 border">PO Type</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Finance Head Approval</th>
          </tr>
        </thead>
        <tbody>
          {pos.map((po, i) => (
            <tr key={i} className="text-center">
              <td className="p-2 border">{po.poNumber}</td>
              <td className="p-2 border">{po.vendorName}</td>
              <td className="p-2 border capitalize">{po.expenseType}</td>
              <td className="p-2 border capitalize">{po.poType}</td>
              <td className="p-2 border">₹{po.amount}</td>
              <td className="p-2 border capitalize">
                {po.financeApproval === "rejected" ? (
                  <span className="text-red-600 flex items-center gap-1 justify-center">
                    Rejected
                    <button onClick={() => setSelectedReason(po.rejectionReason)}>
                      <FaEye />
                    </button>
                  </span>
                ) : (
                  po.financeApproval || "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Rejection Reason */}
      {selectedReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-red-600">Rejection Reason</h3>
            <p className="text-sm text-gray-700">{selectedReason}</p>
            <div className="text-right mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setSelectedReason(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}