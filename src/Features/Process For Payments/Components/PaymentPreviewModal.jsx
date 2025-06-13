// src/features/processPayments/components/PaymentPreviewModal.jsx
import React from "react";
import PaymentActions from "./PaymentActions";

export default function PaymentPreviewModal({ data, onClose, onRequestChanges }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Preview Payment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-lg font-bold"
          >
            ×
          </button>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {Object.keys(data[0] || {}).map((key) => (
                  <th key={key} className="px-4 py-2 border-b">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="px-4 py-2 border-b">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <PaymentActions data={data} onClose={onClose} onRequestChanges={onRequestChanges} />
        </div>
      </div>
    </div>
  );
}
