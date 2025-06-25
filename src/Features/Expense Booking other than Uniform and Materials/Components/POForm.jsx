// File: src/features/billing/components/POForm.jsx

import React, { useState } from "react";
import { toast } from "react-toastify";

export default function POForm({ onSubmit }) {
  const initialFormState = {
    vendorName: "",
    poType: "",
    expenseType: "",
    description: "",
    amount: "",
    attachment: null,
    startDate: "",
    endDate: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    const newValue = files ? files[0] : value;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.vendorName ||
      !formData.poType ||
      !formData.expenseType ||
      !formData.description ||
      !formData.amount ||
      !formData.attachment ||
      (formData.poType === "yearly" && !formData.startDate)
    ) {
      toast.warning("Please fill all required fields.");
      return;
    }
    onSubmit(formData);
    setFormData(initialFormState);
    e.target.reset(); // reset file input manually
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Vendor Name</label>
        <input
          type="text"
          name="vendorName"
          value={formData.vendorName}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">PO Type</label>
        <select
          name="poType"
          value={formData.poType}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">Select</option>
          <option value="one-time">One-time</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {formData.poType === "yearly" && (
        <>
          <div>
            <label className="block font-medium">Start Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">End Date (optional)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </>
      )}

      <div>
        <label className="block font-medium mb-1">Expense Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="expenseType"
              value="professional-fees"
              checked={formData.expenseType === "professional-fees"}
              onChange={handleChange}
              required
            />
            Professional Fees
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="expenseType"
              value="one-time-service"
              checked={formData.expenseType === "one-time-service"}
              onChange={handleChange}
              required
            />
            One-time Service
          </label>
        </div>
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows={3}
          required
        ></textarea>
      </div>

      <div>
        <label className="block font-medium">PO Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Upload Attachment (PDF/Image)</label>
        <input
          type="file"
          name="attachment"
          accept="application/pdf,image/*"
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full md:w-auto cursor-pointer"
      >
        Submit PO
      </button>
    </form>
  );
}