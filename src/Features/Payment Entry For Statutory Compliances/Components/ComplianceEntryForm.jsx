import React, { useState } from "react"; 
import { toast } from "react-toastify";

export default function ComplianceEntryForm() {
  const [formData, setFormData] = useState({
    paymentType: "",
    paymentMonth: "",
    amount: "",
    challan: null,
    remarks: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "challan") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.paymentType) newErrors.paymentType = "Payment type is required";
    if (!formData.paymentMonth) newErrors.paymentMonth = "Payment month is required";
    if (!formData.amount || isNaN(formData.amount)) newErrors.amount = "Valid amount is required";
    if (!formData.challan) newErrors.challan = "Challan upload is required";
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

    const existing = JSON.parse(localStorage.getItem("statutoryPayments") || "[]");
    const newEntry = {
      ...formData,
      id: Date.now(),
      status: "PendingApproval",
    };
    localStorage.setItem("statutoryPayments", JSON.stringify([...existing, newEntry]));

    toast.success("Payment entry submitted successfully!");

    setFormData({ paymentType: "", paymentMonth: "", amount: "", challan: null, remarks: "" });
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
        {errors.paymentType && <p className="text-red-600 text-sm mt-1">{errors.paymentType}</p>}
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
        {errors.paymentMonth && <p className="text-red-600 text-sm mt-1">{errors.paymentMonth}</p>}
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
        {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
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
        {errors.challan && <p className="text-red-600 text-sm mt-1">{errors.challan}</p>}
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
