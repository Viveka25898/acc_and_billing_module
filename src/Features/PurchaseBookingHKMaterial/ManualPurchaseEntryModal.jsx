import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const dummyPOs = ["PO-001", "PO-002", "PO-003"];
const dummyAccounts = ["Purchase A/c - Raw Material", "Purchase A/c - Services", "Purchase A/c - Others"];

export default function ManualPurchaseEntryModal({ invoice, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    vendorName: invoice?.vendorName || "",
    invoiceNumber: invoice?.invoiceNumber || "",
    poCovered: "",
    totalAmount: invoice?.totalAmount || "",
    purchaseAccount: "",
    narration: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.poCovered) newErrors.poCovered = "PO Covered is required.";
    if (!formData.totalAmount) newErrors.totalAmount = "Total Amount is required.";
    if (!formData.purchaseAccount) newErrors.purchaseAccount = "Purchase Account is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    try {
      if (!validate()) return;
      onSubmit(formData); // Pass data to parent
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-lg">
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Manual Purchase Entry</h2>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block font-medium">Vendor Name</label>
            <input
              type="text"
              value={formData.vendorName}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Invoice Number</label>
            <input
              type="text"
              value={formData.invoiceNumber}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">PO Covered <span className="text-red-500">*</span></label>
            <select
              name="poCovered"
              value={formData.poCovered}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select PO</option>
              {dummyPOs.map(po => (
                <option key={po} value={po}>{po}</option>
              ))}
            </select>
            {errors.poCovered && <p className="text-red-500 text-xs mt-1">{errors.poCovered}</p>}
          </div>

          <div>
            <label className="block font-medium">Total Amount <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.totalAmount && <p className="text-red-500 text-xs mt-1">{errors.totalAmount}</p>}
          </div>

          <div>
            <label className="block font-medium">Purchase Account <span className="text-red-500">*</span></label>
            <select
              name="purchaseAccount"
              value={formData.purchaseAccount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Account</option>
              {dummyAccounts.map(account => (
                <option key={account} value={account}>{account}</option>
              ))}
            </select>
            {errors.purchaseAccount && <p className="text-red-500 text-xs mt-1">{errors.purchaseAccount}</p>}
          </div>

          <div>
            <label className="block font-medium">Narration (Optional)</label>
            <textarea
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Additional notes or remarks..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Submit Manual Entry
          </button>
        </div>
      </div>
    </div>
  );
}
