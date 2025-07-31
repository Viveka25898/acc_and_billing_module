// src/features/processPayments/components/EditPaymentDetails.jsx
import React from "react";
import { toast } from "react-toastify";

export default function EditPaymentDetails({ data, setData, onCancel }) {
  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const handleSave = () => {
    localStorage.setItem("paymentEntries", JSON.stringify(data));
    toast.success("Changes saved successfully. Payment entries accepted and passed in the System.");
    onCancel(); // close editor
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6 overflow-auto">
      <h2 className="text-lg font-semibold mb-4 text-center">Edit Payment Details</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(data[0] || {}).map((key) => (
                <th key={key} className="px-3 py-2 border">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="bg-white even:bg-gray-50">
                {Object.entries(row).map(([key, value], i) => (
                  <td key={i} className="px-3 py-2 border">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={value}
                      onChange={(e) => handleChange(idx, key, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 gap-3">
        <button
          onClick={onCancel}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
