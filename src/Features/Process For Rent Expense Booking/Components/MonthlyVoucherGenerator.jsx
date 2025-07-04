import React, { useState } from "react";

export default function MonthlyVoucherGenerator({onSuccess}) {
  const [voucherData, setVoucherData] = useState({
    month: "",
    amount: "",
    gstApplicable: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVoucherData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    console.log("Voucher to generate:", voucherData);
    if (onSuccess) onSuccess();
    // Here you'll send data to backend or update Redux store
  };

  return (
    <form onSubmit={handleGenerate} className=" p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Generate Monthly Voucher</h2>
      <div className="space-y-2">
        <input
          type="month"
          name="month"
          value={voucherData.month}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="amount"
          placeholder="Rent Amount"
          value={voucherData.amount}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="gstApplicable"
            checked={voucherData.gstApplicable}
            onChange={handleChange}
          />
          Apply GST
        </label>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Voucher
      </button>
    </form>
  );
}
