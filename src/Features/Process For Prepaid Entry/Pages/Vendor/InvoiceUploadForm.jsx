/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function PInvoiceUploadForm({ purchaseOrders = [] }) {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    selectedPOs: [],
    invoiceFile: null,
    dcFile: null,
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (file && file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePOSelect = (e) => {
    const options = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData({ ...formData, selectedPOs: options });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.invoiceNumber || !formData.invoiceDate || !formData.invoiceFile || !formData.dcFile) {
        toast.error("Please fill all required fields");
        return;
      }

      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => payload.append(key, v));
        } else {
          payload.append(key, value);
        }
      });

      toast.success("Invoice submitted successfully");
      // await axios.post('/api/upload-invoice', payload);
    } catch (error) {
      toast.error("Failed to submit invoice");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6"
    >
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800 uppercase">Invoice</h1>
        <p className="text-sm text-gray-600">Your Company Name</p>
        <p className="text-sm text-gray-600">123 Street Address, City, State, ZIP</p>
        <p className="text-sm text-gray-600">Phone: +91-XXXXXXXXXX | Email: example@email.com</p>
      </div>

      {/* Invoice Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Invoice Number *</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Invoice Date *</label>
          <input
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Bill To / Ship To */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded border">
          <h3 className="font-semibold mb-2">Bill To:</h3>
          <p>Contact Name</p>
          <p>Client Company Name</p>
          <p>Address</p>
          <p>Phone</p>
          <p>Email</p>
        </div>
        <div className="bg-gray-50 p-3 rounded border">
          <h3 className="font-semibold mb-2">Ship To:</h3>
          <p>Name / Dept</p>
          <p>Client Company Name</p>
          <p>Address</p>
          <p>Phone</p>
        </div>
      </div>

      {/* PO Dropdown */}
      <div>
        <label className="block text-sm font-medium">Select PO(s)</label>
        <select
          multiple
          value={formData.selectedPOs}
          onChange={handlePOSelect}
          className="w-full border px-3 py-2 rounded"
        >
          {purchaseOrders.map((po) => (
            <option key={po.id} value={po.number}>
              {po.number}
            </option>
          ))}
        </select>
      </div>

      {/* Uploads */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Upload Invoice (PDF) *</label>
          <input
            type="file"
            name="invoiceFile"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Upload Delivery Challan (PDF) *</label>
          <input
            type="file"
            name="dcFile"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={3}
        ></textarea>
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Submit Invoice
        </button>
      </div>
    </form>
  );
}
