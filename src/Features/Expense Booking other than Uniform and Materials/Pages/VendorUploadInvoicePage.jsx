// File: src/features/vendor/pages/VendorUploadInvoicePage.jsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const mockPOs = [
  { id: 1, poNumber: "PO-2025-001", vendorId: "vendor1" },
  { id: 2, poNumber: "PO-2025-002", vendorId: "vendor1" },
  { id: 3, poNumber: "PO-2025-003", vendorId: "vendor2" },
];

export default function VendorUploadInvoicePage() {
  const location = useLocation();
  const prefilledPONumber = location.state?.poNumber || "";

  const [selectedPO, setSelectedPO] = useState(prefilledPONumber);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    invoiceAmount: "",
    gstin: "",
    file: null,
  });

  const [filteredPOs, setFilteredPOs] = useState([]);
  const currentVendorId = "vendor1"; // in real app, get from auth context or redux

  useEffect(() => {
    const vendorPOs = mockPOs.filter((po) => po.vendorId === currentVendorId);
    setFilteredPOs(vendorPOs);
  }, [currentVendorId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (!selectedPO || !formData.invoiceNumber || !formData.invoiceDate || !formData.invoiceAmount || !formData.gstin || !formData.file) {
        toast.warning("Please fill all required fields.");
        return;
      }
      console.log("Invoice submitted:", { selectedPO, ...formData });
      toast.success("Invoice uploaded successfully.");
      setSelectedPO(prefilledPONumber);
      setFormData({ invoiceNumber: "", invoiceDate: "", invoiceAmount: "", gstin: "", file: null });
      e.target.reset();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Upload Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Select PO</label>
          <select
            value={selectedPO}
            onChange={(e) => setSelectedPO(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Select PO --</option>
            {filteredPOs.map((po) => (
              <option key={po.id} value={po.poNumber}>
                {po.poNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Invoice Number</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Invoice Date</label>
          <input
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Invoice Amount</label>
          <input
            type="number"
            name="invoiceAmount"
            value={formData.invoiceAmount}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">GSTIN</label>
          <input
            type="text"
            name="gstin"
            value={formData.gstin}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Upload Invoice Document</label>
          <input
            type="file"
            name="file"
            accept="application/pdf,image/*"
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full md:w-auto cursor-pointer"
        >
          Submit Invoice
        </button>
      </form>
    </div>
  );
}