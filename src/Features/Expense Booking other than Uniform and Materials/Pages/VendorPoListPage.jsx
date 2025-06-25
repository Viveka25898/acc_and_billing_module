// File: src/features/vendor/pages/VendorPOListPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const mockVendorPOs = [
  { id: 1, poNumber: "PO-2025-001", amount: 25000, date: "2025-05-10" },
  { id: 2, poNumber: "PO-2025-002", amount: 18000, date: "2025-06-01" },
  { id: 3, poNumber: "PO-2025-007", amount: 56000, date: "2025-06-15" },
];

export default function VendorPOListPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
     <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4 text-green-600">My Purchase Orders</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          onClick={() => navigate("/dashboard/vendor/my-invoice-page")}
        >
          My Invoices
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">PO Number</th>
              <th className="p-2 border">PO Date</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockVendorPOs.map((po) => (
              <tr key={po.id} className="text-center">
                <td className="p-2 border">{po.poNumber}</td>
                <td className="p-2 border">{po.date}</td>
                <td className="p-2 border">₹{po.amount}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => navigate("/dashboard/vendor/onetime-expense-professional-fees-upload-invoice", { state: { poNumber: po.poNumber } })}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                  >
                    Upload Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
