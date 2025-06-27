// File: src/features/vendor/components/VendorInvoiceForm.jsx
import React, { useState } from "react";

export default function VendorInvoiceForm() {
  const [formData, setFormData] = useState({
    invoiceDate: "",
    invoiceNumber: "",
    companyName: "",
    address: "",
    cityStateZip: "",
    phone: "",
    email: "",
    billTo: {
      contactName: "",
      clientCompany: "",
      address: "",
      phone: "",
      email: "",
    },
    shipTo: {
      nameOrDept: "",
      clientCompany: "",
      address: "",
      phone: "",
    },
    items: [
      { description: "", qty: 1, unitPrice: 0, total: 0 },
    ],
    remarks: "",
    discount: 0,
    taxRate: 0,
    shipping: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleItemChange = (index, field, value) => {
    const items = [...formData.items];
    items[index][field] = field === "qty" || field === "unitPrice" ? parseFloat(value) || 0 : value;
    items[index].total = (items[index].qty * items[index].unitPrice).toFixed(2);
    setFormData({ ...formData, items });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", qty: 1, unitPrice: 0, total: 0 }],
    });
  };

  const removeItem = (index) => {
    const items = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items });
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const totalTax = ((subtotal - formData.discount) * formData.taxRate) / 100;
  const grandTotal = subtotal - formData.discount + totalTax + parseFloat(formData.shipping);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Invoice:", formData);
    alert("Invoice submitted successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Date</label>
          <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Number</label>
          <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Bill To</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Contact Name" value={formData.billTo.contactName} onChange={(e) => handleNestedChange("billTo", "contactName", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Client Company Name" value={formData.billTo.clientCompany} onChange={(e) => handleNestedChange("billTo", "clientCompany", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Address" value={formData.billTo.address} onChange={(e) => handleNestedChange("billTo", "address", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Phone" value={formData.billTo.phone} onChange={(e) => handleNestedChange("billTo", "phone", e.target.value)} className="border px-3 py-2 rounded w-full" />
        </div>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Ship To</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Name / Dept" value={formData.shipTo.nameOrDept} onChange={(e) => handleNestedChange("shipTo", "nameOrDept", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Client Company Name" value={formData.shipTo.clientCompany} onChange={(e) => handleNestedChange("shipTo", "clientCompany", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Address" value={formData.shipTo.address} onChange={(e) => handleNestedChange("shipTo", "address", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Phone" value={formData.shipTo.phone} onChange={(e) => handleNestedChange("shipTo", "phone", e.target.value)} className="border px-3 py-2 rounded w-full" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Items</h2>
        {formData.items.map((item, index) => (
          <div key={index} className="grid md:grid-cols-4 gap-4 items-end mb-2">
            <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} className="border px-3 py-2 rounded w-full" />
            <input type="number" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(index, "qty", e.target.value)} className="border px-3 py-2 rounded w-full" />
            <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)} className="border px-3 py-2 rounded w-full" />
            <span className="block py-2">Total: ₹{item.total}</span>
            <button type="button" onClick={() => removeItem(index)} className="text-red-500 text-sm hover:underline">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Item</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <textarea name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Remarks / Payment Instructions" className="border px-3 py-2 rounded w-full" />
        <div className="space-y-2">
          <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="Discount" className="border px-3 py-2 rounded w-full" />
          <input type="number" name="taxRate" value={formData.taxRate} onChange={handleChange} placeholder="Tax Rate (%)" className="border px-3 py-2 rounded w-full" />
          <input type="number" name="shipping" value={formData.shipping} onChange={handleChange} placeholder="Shipping / Handling" className="border px-3 py-2 rounded w-full" />
        </div>
      </div>

      <div className="text-sm mt-4 space-y-1">
        <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
        <p><strong>Subtotal Less Discount:</strong> ₹{(subtotal - formData.discount).toFixed(2)}</p>
        <p><strong>Tax Amount:</strong> ₹{totalTax.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ₹{parseFloat(formData.shipping).toFixed(2)}</p>
        <p className="text-green-700 font-semibold text-lg"><strong>Balance Due:</strong> ₹{grandTotal.toFixed(2)}</p>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Submit Invoice
        </button>
      </div>
    </form>
  );
}
