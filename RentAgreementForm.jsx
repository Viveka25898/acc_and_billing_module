import React, { useState } from "react";

export default function RentAgreementForm({ site, onSuccess }) {
  const [form, setForm] = useState({
    owner: "",
    file: null,
    startDate: "",
    endDate: "",
    withGST: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data ready to be sent to API/store:", form);
    
    // Create agreement data with file URL simulation
    const agreementData = {
      owner: form.owner,
      startDate: form.startDate,
      endDate: form.endDate,
      withGST: form.withGST,
      fileUrl: form.file ? URL.createObjectURL(form.file) : null, // Simulate file URL
      createdAt: new Date().toISOString()
    };
    
    if (onSuccess) onSuccess(agreementData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6 ">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Upload Rent Agreement</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Owner Name / Ledger</label>
          <input
            type="text"
            name="owner"
            placeholder="Enter owner name or ledger"
            value={form.owner}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Upload Agreement (PDF)</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            accept="application/pdf"
            required
            className="w-full p-2 border rounded-lg bg-white"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="withGST"
            checked={form.withGST}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Include GST</label>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Save Agreement
        </button>
      </div>
    </form>
  );
}