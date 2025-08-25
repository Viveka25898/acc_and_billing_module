/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ComplianceEntryForm() {
  const [formData, setFormData] = useState({
    paymentType: "",
    paymentMonth: "",
    amount: "",
    challan: null, // { name, type, size, data(base64) } or null
    remarks: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (name === "challan") {
      const file = files && files[0];
      if (!file) {
        setFormData({ ...formData, challan: null });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          challan: {
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result, // base64 data URL
          },
        });
      };
      reader.readAsDataURL(file); // convert file → Base64
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.paymentType) newErrors.paymentType = "Payment type is required";
    if (!formData.paymentMonth) newErrors.paymentMonth = "Payment month is required";
    if (!formData.amount || isNaN(formData.amount)) newErrors.amount = "Valid amount is required";
    if (!formData.challan || !formData.challan.data) newErrors.challan = "Challan upload is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Get current user from localStorage (safe fallback)
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const username = currentUser?.username || "anonymous";

      // Get existing payments or initialize
      const statutoryData =
        JSON.parse(localStorage.getItem("statutoryPayments") || "null") || {
          payments: [],
          metadata: {
            lastId: 0,
            createdAt: new Date().toISOString(),
          },
        };

      // Create new payment object
      const newPayment = {
        id: `STAT-${Date.now()}`,
        type: formData.paymentType,
        period: formData.paymentMonth,
        amount: parseFloat(formData.amount),
        // Store the full challan object (with base64 data) in localStorage
        challanRef: formData.challan, 
        remarks: formData.remarks,
        status: "pending-compliance-manager",
        createdBy: username,
        createdAt: new Date().toISOString(),
        history: [
          {
            action: "Submitted by Compliance Team",
            by: username,
            at: new Date().toISOString(),
          },
        ],
      };

      // Update localStorage
      const updatedData = {
        payments: [...statutoryData.payments, newPayment],
        metadata: {
          ...statutoryData.metadata,
          lastId: (statutoryData.metadata?.lastId || 0) + 1,
          updatedAt: new Date().toISOString(),
        },
      };

      localStorage.setItem("statutoryPayments", JSON.stringify(updatedData));

      toast.success("Payment request submitted successfully!");

      // Reset form
      setFormData({
        paymentType: "",
        paymentMonth: "",
        amount: "",
        challan: null,
        remarks: "",
      });
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to submit payment request");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Payment Type</label>
        <select
          name="paymentType"
          value={formData.paymentType}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Type</option>
          <option value="PF">PF</option>
          <option value="ESIC">ESIC</option>
        </select>
        {errors.paymentType && (
          <p className="text-red-600 text-sm mt-1">{errors.paymentType}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Payment Month</label>
        <input
          type="month"
          name="paymentMonth"
          value={formData.paymentMonth}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
        {errors.paymentMonth && (
          <p className="text-red-600 text-sm mt-1">{errors.paymentMonth}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
        {errors.amount && (
          <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Upload Challan</label>
        <input
          type="file"
          name="challan"
          accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx"
          onChange={handleChange}
          className="w-full border rounded-lg p-2 cursor-pointer"
        />
        {errors.challan && (
          <p className="text-red-600 text-sm mt-1">{errors.challan}</p>
        )}
        {/* Optional: show selected file name */}
        {formData.challan?.name && (
          <p className="text-sm text-gray-600 mt-1">Selected: {formData.challan.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Remarks (Optional)</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          rows="3"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 cursor-pointer"
      >
        Submit Payment Request
      </button>
    </form>
  );
}
