/* eslint-disable no-unused-vars */
import { useState } from "react";
import { toast } from "react-toastify";
import JVPreviewModal from "./JVPreviewModal";

export default function ExpenseForm({ vendors, onSave }) {
  const [formData, setFormData] = useState({
    vendorId: "",
    amount: "",
    description: "",
  });
  const [showJVModal, setShowJVModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceed = () => {
    try {
      const vendor = vendors.find((v) => v.id === parseInt(formData.vendorId));
      if (!vendor) throw new Error("Invalid vendor selected.");
      setSelectedVendor(vendor);
      setShowJVModal(true);
    } catch (err) {
      toast.error(err.message || "Error during JV preview.");
    }
  };

  const handleFinalSubmit = () => {
  try {
    const data = {
      ...formData,
      vendorName: selectedVendor.name,
      tdsRate: selectedVendor.tdsRate,
      tdsAmount: selectedVendor.tdsRate
        ? ((formData.amount * selectedVendor.tdsRate) / 100).toFixed(2)
        : 0,
      netAmount: selectedVendor.tdsRate
        ? (formData.amount - (formData.amount * selectedVendor.tdsRate) / 100).toFixed(2)
        : formData.amount,
    };

    onSave(data);
    toast.success("Expense booked successfully.");

    // ✅ Reset form & close modal
    setFormData({ vendorId: "", amount: "", description: "" });
    setShowJVModal(false); // <-- Close Modal Here
    setSelectedVendor(null);
  } catch (error) {
    toast.error("Error saving expense.");
  }
};


  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-lg font-semibold mb-4">Expense Booking</h2>
      <div className="space-y-3">
        <select
          name="vendorId"
          value={formData.vendorId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Vendor</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="description"
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleProceed}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Proceed
        </button>
      </div>

      {showJVModal && (
        <JVPreviewModal
          vendor={selectedVendor}
          amount={parseFloat(formData.amount)}
          onClose={() => setShowJVModal(false)}
          onConfirm={handleFinalSubmit}
        />
      )}
    </div>
  );
}
