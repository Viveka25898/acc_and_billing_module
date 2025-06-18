// src/pages/AE/FixedAssetEntryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FixedAssetEntryPage = () => {
  const { invoiceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [assetEntry, setAssetEntry] = useState({
    assetTag: "",
    serialNumber: "",
    location: "",
    warrantyPeriod: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
  });

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (location.state && location.state.invoice) {
      setInvoice(location.state.invoice);
    } else {
      // Fallback if no state is passed, fetch from local storage or redirect
      toast.error("No invoice data found");
      navigate("/dashboard/ae/invoice-review");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with backend/API call
    console.log("Fixed Asset Entry Submitted:", { ...assetEntry, invoiceId });
    toast.success("✅ Fixed Asset Purchase Entry Passed");
    navigate("/dashboard/ae/invoice-review");
  };

  if (!invoice) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl md:text-2xl font-bold text-green-700 mb-6">
        Fixed Asset Entry
      </h2>

      <div className="mb-4 space-y-1 text-sm md:text-base">
        <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
        <p><strong>Vendor:</strong> {invoice.vendorName}</p>
        <p><strong>Total Amount:</strong> ₹{invoice.totalAmount.toLocaleString()}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
        <div>
          <label className="block font-medium mb-1">Asset Tag</label>
          <input
            type="text"
            name="assetTag"
            value={assetEntry.assetTag}
            onChange={handleChange}
            placeholder="e.g., FA-2024-007"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Serial Number</label>
          <input
            type="text"
            name="serialNumber"
            value={assetEntry.serialNumber}
            onChange={handleChange}
            placeholder="e.g., SN-XY1234"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={assetEntry.location}
            onChange={handleChange}
            placeholder="e.g., HO, Mumbai"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Warranty Period</label>
          <input
            type="text"
            name="warrantyPeriod"
            value={assetEntry.warrantyPeriod}
            onChange={handleChange}
            placeholder="e.g., 3 Years"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            value={assetEntry.purchaseDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="md:col-span-2 text-right mt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Confirm Fixed Asset Purchase
          </button>
        </div>
      </form>
    </div>
  );
};

export default FixedAssetEntryPage;
