/* eslint-disable no-unused-vars */ 
import { useState, useEffect } from "react";

export default function VendorTDSModal({ vendor, onClose, updateVendor }) {
  const [tdsRate, setTdsRate] = useState(vendor.tdsRate || "");
  const [error, setError] = useState("");
  const [statutoryOptions, setStatutoryOptions] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("statutoryData");
      const parsed = stored ? JSON.parse(stored) : [];
      setStatutoryOptions(parsed);
    } catch {
      setStatutoryOptions([]);
    }
  }, []);
  console.log(statutoryOptions);

  const handleSave = () => {
    try {
      const rate = parseFloat(tdsRate);
      if (isNaN(rate) || rate < 1 || rate > 30) {
        setError("TDS Rate must be between 1% and 30%");
        return;
      }
      updateVendor({ ...vendor, tdsRate: rate }); // Parent handles toast
    } catch (err) {
      setError("Something went wrong while updating TDS.");
    }
  };

  const handleSelectionChange = (e) => {
    const rate = e.target.value;
    setTdsRate(rate); 
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10"
      style={{ overflow: "visible" }}
    >
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
        <h2 className="text-lg font-bold mb-2">{vendor.name} - TDS Mapping</h2>

        <select
          value={tdsRate}
          onChange={handleSelectionChange}
          className="w-full border border-green-400 p-2 rounded mb-2 bg-white"
        >
          <option value="" disabled hidden>
            -- Select from Ledger --
          </option>
          {statutoryOptions.map((item) => (
            <option key={item.id} value={parseFloat(item.rate)}>
              {item.section} - {item.description} ({item.rate})
            </option>
          ))}
        </select>

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
