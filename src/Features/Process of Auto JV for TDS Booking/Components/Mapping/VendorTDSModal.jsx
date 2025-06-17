/* eslint-disable no-unused-vars */
import { useState } from "react";

export default function VendorTDSModal({ vendor, onClose, updateVendor }) {
  const [tdsRate, setTdsRate] = useState(vendor.tdsRate || "");
  const [error, setError] = useState("");

  const handleSave = () => {
    try {
      const rate = parseFloat(tdsRate);
      if (isNaN(rate) || rate < 1 || rate > 30) {
        setError("TDS Rate must be between 1% and 30%");
        return;
      }
      updateVendor({ ...vendor, tdsRate: rate }); // Parent will handle toast
    } catch (err) {
      setError("Something went wrong while updating TDS.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-2">{vendor.name} - TDS Mapping</h2>
        <input
          type="number"
          value={tdsRate}
          onChange={(e) => setTdsRate(e.target.value)}
          className="w-full border border-green-400 p-2 rounded mb-2"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
